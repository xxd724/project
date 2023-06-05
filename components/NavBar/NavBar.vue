<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<!-- #ifdef APP-PLUS -->

			<!-- #endif -->
			<!-- 处理我们的app以及小程序的导航栏 -->
			<view :style="{height:statusBarHeight + 'rpx'}"></view>

			<!-- 当组件应用于使用的时候，展示回退按钮 -->
			<view @click="returnArticleList" class="return-icon" :style="{top:statusBarHeight + 'rpx'}" v-if="isSearch">
				<uni-icons type="back" size="22" color="#fff"></uni-icons>
			</view>

			<view class="nav-bar-content" :style="{marginRight:marginRight + 'rpx',marginLeft:isSearch ? '24rpx' : ''}"
				@click="goSearch">
				<uni-icons type="search" color="#999"></uni-icons>
				<view v-if="!isSearch" class="nav-bar-search-text">输入文章标题进行搜索</view>
				<input v-else class="search-input" v-model.trim="searchVal" type="text" placeholder="输入文章标题进行搜索"
					@confirm='changeInput' confirm-type='search'>
			</view>
		</view>
		<!-- 底部垫片 -->
		<view :style="{height:statusBarHeight + 80 + 'rpx'}">

		</view>
	</view>
</template>

<script>
	export default {
		name: "NavBar",
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			parentVal: String
		},
		data() {
			return {
				statusBarHeight: 20,
				marginRight: 0
			};
		},
		created() {
			this.getSystemInfo();
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusBarHeight = systemInfo.statusBarHeight *
					2); //判断systemInfo.statusBarHeight是否有值，如果有执行右侧
				// #ifdef MP-WEIXIN
				const mentButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.statusBarHeight = mentButtonInfo.top * 2;
				this.marginRight = mentButtonInfo.width * 2;
				// #endif
			},
			/* 跳转到搜索页面 */
			goSearch() {
				if (this.isSearch) {
					return
				}
				uni.navigateTo({
					url: '../../pages/search/search'
				})
			},
			//返回文章列表
			returnArticleList() {
				// #ifdef H5
				uni.switchTab({
					url: '../../pages/index/index'
				})
				// #endif
				// #ifndef H5
				uni.navigateBack()
				// #endif
			},
			changeInput() {
				this.$emit('sendSearchData')
			}
		},
		computed: {
			searchVal: {
				get() {
					return this.parentVal
				},
				set(val) {
					this.$emit('updateVal', val)
					if (!val) {
						this.$emit('sendSearchData')
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/components/NavBar/css/NavBar.scss'
</style>
