<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeActiveIndex">
		<swiper-item v-for="(item,index) in labelList" :key="item._id">
			<view class="swiper-item uni-bg-red">
				<!-- <ListItem :articleList="articleList"></ListItem> -->
				<ListItem :loadData="loadData[index]" :articleList="articleData[index]" @loadMore='loadMoreData'>
				</ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name: "ArticleList",
		props: {
			labelList: Array,
			activeIndex: Number
		},
		created() {
			this.labelList.length && this._getArticleList(this.activeIndex);
		},
		watch: {
			labelList(newValue, oldValue) {
				if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
					return
				}
				this.articleData = {},
					this.loadData = {},
					// console.log(newValue);
					// this._getArticleList();
					this._getArticleList(this.activeIndex);
			}

		},
		data() {
			return {
				// articleList:[]
				articleData: {},
				loadData: {},
				page: 1,
				pageSize: 6
			};
		},
		methods: {
			changeActiveIndex(e) {
				// const index=e.detail.current;
				// this.$emit('changeActiveIndex',index);
				// const {current}=e.detail;
				// this.$emit("changeActiveIndex",current)
				// this._getArticleList(current);
				const {
					current
				} = e.detail;
				this.$emit("changeActiveIndex", current);
				if (!this.articleData[current] || !this.articleData[current].length == 0) {
					this._getArticleList(current);
				}

			},
			// 进行数据的请求获取
			async _getArticleList(currentIndex) {

				// const articleList=await this.$http.get_article_list({classify:this.labelList[this.activeIndex].name});
				// this.articleList=articleList;
				// const articleList=await this.$http.get_article_list({classify:this.labelList[currentIndex].name});
				// this.articleData[currentIndex]=articleList;
				//指定每一个分类里面的页数信息
				if (!this.loadData[currentIndex]) { //初始化没有值
					this.loadData[currentIndex] = {
						page: 1,
						loading: 'loading',
						total: 0
					}
				}
				const {
					articleList,
					total
				} = await this.$http.get_article_list({
					classify: this.labelList[currentIndex].name,
					// page:this.page,
					page: this.loadData[currentIndex].page,
					pageSize: this.pageSize
				});
				let oldList = this.articleData[currentIndex] || []; //追加每一次的请求数据结果
				oldList.push(...articleList)
				// this.$set(this.articleData,currentIndex,articleList);
				this.$set(this.articleData, currentIndex, oldList);
				this.loadData[currentIndex].total = total; //加载的总数
			},
			//到底加载更多内容事件
			loadMoreData() {

				if (this.loadData[this.activeIndex].total === this.articleData[this.activeIndex].length) {
					this.loadData[this.activeIndex] = { //重新赋值
						...this.loadData[this.activeIndex],
						...{
							loading: "noMore"
						}
					}
					this.$forceUpdate() //强制更改数据
					return;
				}

				// this.page++;
				this.loadData[this.activeIndex].page++; //加载每一类的分页数据
				this._getArticleList(this.activeIndex);
			}
		}
	}
</script>

<style lang="scss">
	.swiper-container {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
