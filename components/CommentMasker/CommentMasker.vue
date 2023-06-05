<template>
	<view>
		<uni-popup ref="popup" type="bottom" :is-mask-click="false">
			<!-- 内容区域 -->
			<view class="popup-wrapper">
				<view class="popup-header">
					<view class="popup-header-item" @click="closePopupMasker">取消</view>
					<view class="popup-header-item" @click="sendCommentData">发布</view>
				</view>
				<view class="popup-content">
					<textarea class="popup-content-textarea" v-model.trim="commentsVal" placeholder="请输入评论内容" maxlength="200"></textarea>
					<view class="popup-content-count">
						{{commentsVal.length}} / 200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"CommentMasker",
		props:{
			showPopup:Boolean
		},
		watch:{
			showPopup(newVal){
				newVal ? this.$refs.popup.open() : this.$refs.popup.close()
			}
		},
		data() {
			return {
				commentsVal:''
			};
		},
		methods: {
			/* 关闭弹窗的触发事件 */
			closePopupMasker() {
				this.$emit('closePopupMasker',false);
				if(this.commentsVal){
					setTimeout(() => this.commentsVal='',10000)
				}
			},
			/* 通知父组件进行评论内容的发送 */
			sendCommentData(){
				if(!this.commentsVal){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					})
					return
				}
				this.$emit("sendCommentData",this.commentsVal);
				this.commentsVal=''
			}
		},
	}
</script>

<style lang="scss">
.popup-wrapper{
	background-color: #fff;
	.popup-header{
		@include flex();
		font-size: 30rpx;
		color: #444;
		border-bottom: 2rpx solid #ebebeb;
		.popup-header-item{
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 60rpx;
		}
	}
	.popup-content{
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		.popup-content-textarea{
			height: 420rpx;
			width: 100%;
		}
		.popup-content-count{
			@include flex(flex-end);
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}
	}
}
</style>