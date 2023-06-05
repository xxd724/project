<template>
	<view class="comment-box">
		<view class="comment-header">
			<view class="comment-header-logo">
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<view class="comment-title" v-if="!commentData.is_reply">
					{{commentData.author.author_name}}
				</view>
				<view class="comment-title" v-else>
					{{commentData.author.author_name}}
					<text class="reply-text">回复</text>
					{{commentData.to}}
				</view>
				<view class="">
					<uni-dateformat :date="commentData.create_time" format="yyyy-MM-dd hh:mm"></uni-dateformat>
				</view>
			</view>
		</view>
		<view class="comment-content">
			<view class="">
				{{commentData.comment_content}}
			</view>
			<view class="comment-info">
				<view class="comment-button" @click="commentReply({comment:commentData,isReply})">
					回复
				</view>
			</view>
			<!-- 子回复展示区域 -->
			<view class="comment-reply-list" v-for="item in commentData.replyArr" :key="item.comment_id">
				<CommentsBox :isReply="true" :commentData="item" @commentReply="commentReply"></CommentsBox>
			</view>
		</view>
	</view>
</template>

<script>
	import CommentsBox from '@/components/CommentsBox/CommentsBox.vue'
	export default {
		name:"CommentsBox",
		props:{
			commentData:Object,
			isReply:{
				type:Boolean,
				default:false
			}
		},
		components:{
			CommentsBox
		},
		data() {
			return {
				
			};
		},
		methods: {
			//回复事件的处理函数
			commentReply(data) {
				if(data.isReply){
					data.comment.reply_id=data.comment.comment_id;
					data.comment.comment_id=this.commentData.comment_id;
				}	
				this.$emit("commentReply",data)
			}
		},
	}
</script>

<style lang="scss">
@import '@/components/CommentsBox/css/CommentsBox.scss'
</style>