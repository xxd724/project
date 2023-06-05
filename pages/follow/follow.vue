<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:currentIndex ===0}" @click="currentIndex=0">文章</view>
				<view class="follow-tab-item" :class="{active:currentIndex ===1}" @click="currentIndex=1">作者</view>
			</view>
		</view>
		<!-- 内容切换区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex=$event.detail.current">
				<swiper-item :class="{'no-data':articleDataNone}">
					{{articleDataNone && '暂无收藏文章'}}
					<ListItem :isShowLoadMore="isShowLoadMore" :articleList="articleList" v-if="articleList.length">
					</ListItem>
					<!-- <view v-if="dataNone" class="no-data">暂无收藏文章</view> -->
				</swiper-item>
				<swiper-item :class="{'no-data':authorDataNone}">
					{{authorDataNone && '暂无关注的作者'}}
					<AuthorList :authorList="authorList"></AuthorList>
					<!-- <view class="no-data" v-if="authorDataNone">
						暂无关注的作者
					</view> -->
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.checkIsLogin();
			this._getFollowArticle('noLoading');
			this._getAuthorList('noLoading');
		},
		// watch: {
		// 	"articleList.length": {
		// 		immediate: true,
		// 		handler(newVal, oldVal) {
		// 			if (newVal != oldVal) {
		// 				this._getFollowArticle();
		// 			}
		// 		}
		// 	}
		// },
		onLoad() {
			// #ifdef MP-WEIXIN
			if (!this.$store.state.userInfo) {
				uni.redirectTo({
					url: "/pages/userInfo/login/login"
				})
				return
			}
			// #endif
			//todo 没有这个历史记录栈的时候不会触发这个事件
			uni.$on('updateArticle', (e) => {
				this._getFollowArticle('noLoading');
			})
			// todo 修改关注的作者，进行从新请求函数 
			uni.$on('updateAuthor', (e) => {
				this._getAuthorList('noLoading');
			})
			this._getFollowArticle();
			this._getAuthorList();
		},
		data() {
			return {
				isShowLoadMore: false,
				currentIndex: 0,
				articleList: [],
				articleDataNone: "",
				authorList: [],
				authorDataNone: ''
			}
		},
		methods: {
			async _getFollowArticle(isLoading) {
				const list = await this.$http.get_follow_article({
					userId: this.userInfo._id,
					isLoading
				});
				if (list.length) {
					this.articleDataNone = '';
				} else {
					this.articleDataNone = true;
				}
				this.articleList = list;
				// !list.length && (this.dataNone = true);
			},
			async _getAuthorList(isLoading) {
				const list = await this.$http.get_follow_author({
					userId: this.userInfo._id,
					isLoading
				});
				if (list.length) {
					this.authorDataNone = "";
				} else {
					this.authorDataNone = true
				}
				this.authorList = list;
			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/follow/css/follow.scss'
</style>
