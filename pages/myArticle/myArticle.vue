<template>
	<view>
		<ListCard v-if="articleList.length" :item="item" v-for="item in articleList" :key="item._id"></ListCard>
		<view class="no-data" v-else>目前没有文章</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this._getMyArticle();
		},
		data() {
			return {
				articleList: [],
			}
		},
		methods: {
			async _getMyArticle() {
				console.log(this);
				console.log(this.userInfo._id);
				const list = await this.$http.get_my_article({
					userId: this.userInfo._id
				});
				this.articleList = list;
				console.log(list);
			}
		}
	}
</script>

<style lang="scss">
	.no-data {
		height: 400rpx;
		line-height: 400rpx;
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}
</style>
