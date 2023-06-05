<template>
	<!-- @click.stop作用(阻止点击事件继续传播，即阻止事件冒泡) -->
	<view class="save-icons" @click.stop="_changeSaveStatus">
		<!-- <uni-icons color="#ff6600" type="heart-filled" size="20"></uni-icons> -->
		<uni-icons color="#ff6600" :type="isSave ? 'heart-filled':'heart'" :size="size"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "SaveLikes",
		props: {
			item: Object,
			size: {
				type: String,
				default: '20'
			}
		},
		data() {
			return {};
		},
		methods: {
			async _changeSaveStatus() {
				// TODOS 判断用户是否登录
				await this.checkIsLogin();
				const {
					msg,
					newUserInfo
				} = await this.$http.update_save_like({
					articleId: this.item._id,
					userId: this.userInfo._id
				})
				// uni.showToast({
				// 	title:msg,
				// 	icon:"none"
				// })
				uni.$emit('updateArticle');
				this.updateUserInfo({
					...this.userInfo,
					...newUserInfo
				});

			}
		},
		computed: {
			isSave() {
				try {
					return this.userInfo && this.userInfo.article_likes_ids.includes(this.item._id)
				} catch (e) {
					//TODO handle the exception
					return false
				}
			}
		}
	}
</script>

<style>

</style>
