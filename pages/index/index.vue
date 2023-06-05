<template>
	<view class="home_container">
		<NavBar></NavBar>
		<!-- 滚动区域 -->
		<TabBar :labelList="labelList" :activeIndex="activeIndex" @changeActiveIndex='changeActiveIndex'></TabBar>
		<!-- 文章列表组件 -->
		<ArticleList :labelList="labelList" class='list_container' :activeIndex='activeIndex'
			@changeActiveIndex='changeActiveIndex'></ArticleList>
	</view>
</template>

<script>
	// import { get_label_list } from '@/ajax/api/interface/home.js'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		onLoad() {
			this._initlabelList();
		},
		data() {
			return {
				// labelList:[],
				activeIndex: 0
			}
		},
		methods: {
			// _initlabelList(){
			// 	uniCloud.callFunction({
			// 		name:'get_label_list',
			// 		success:(res) =>{  //this指向不对，所以需要用箭头函数 得到正确的this指向
			// 			this.labelList=res.result.data;
			// 		}
			// 	})
			// }
			// async _initlabelList(){
			// 	const label_List=await get_label_list();
			// 	this.labelList=label_List;
			// }
			async _initlabelList() {
				if (this.labelList.length) {
					return
				}
				const labelList = await this.$http.get_label_list();
				// this.labelList=[ {name:"全部"},...labelList];
				this.setlabelList([{
					name: "全部"
				}, ...labelList]);
			},
			changeActiveIndex(index) {
				this.activeIndex = index;
			},
			...mapMutations(['setlabelList'])
		},
		computed: {
			// ...mapState(['labelList'])
			labelList() {
				if (this.userInfo) {
					this.activeIndex = 0;
					return [...this.$store.state.labelList.slice(0, 1), ...this.$store.state.labelList.filter(item => this
						.userInfo.label_ids.includes(item._id))]
				} else {
					return this.$store.state.labelList;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		height: 100%;
	}

	.home_container {
		flex: 1;
		overflow: hidden;
		@include flex(flex-start, column);
		box-sizing: border-box;
		align-items: inherit;
	}

	.list_container {
		flex: 1;
		box-sizing: border-box;
	}
</style>
