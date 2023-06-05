<template>
	<view class="article-detail-container">
		<view class="detail-title">{{articleData.title}}</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">{{articleData.author.author_name}}</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}} 浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">
				{{isFollowAuthor ? '取消关注' : '关注'}}
			</button>
		</view>
		<view class="detail-content-container">
			<view class="detail-html">
				<!-- preview	图片地址，原始事件	预览图片时触发 -->
				<!-- navigate	链接地址，原始事件	点击链接时触发 -->
				<!-- <u-parse :content="article" @preview="preview" @navigate="navigate" ></u-parse> -->
				<u-parse :content="content"></u-parse>
			</view>
			<!-- 评论内容部分 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content-container" v-for="(item,index) in commentList" :key="index">
					<CommentsBox @commentReply="commentReply" :commentData="item"></CommentsBox>
				</view>
				<view class="no-data" v-if="!commentList.length">暂无评论</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="input-container" @click="openMaskerComment">
				<text>谈谈您的看法</text>
				<uni-icons type="compose" size="22" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box">
					<uni-icons type="chat" size="22" color="#f07373" @click="goCommentPage"></uni-icons>
				</view>
				<SaveLikes class="detail-bottom-icon-box" size="22" :item="articleData"></SaveLikes>
				<!-- <view class="detail-bottom-icon-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view> -->
				<view class="detail-bottom-icon-box">
					<uni-icons :type="isCompliments ? 'hand-up-filled' : 'hand-up'" size="22" color="#f07373"
						@click="_updateCompliments"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="_sendCommentData">
		</CommentMasker>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	import {
		marked
	} from 'marked'
	export default {
		components: {
			uParse
		},
		onLoad(...options) {
			let that = this;
			// this.articleData = JSON.parse(options[0].params);
			try {
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.on('acceptDataFromOpenerPage', function(data) {
					that.articleData = data
				})
			} catch (e) {

			}
			this.articleData = uni.getStorageSync('params');
			// this.articleData = this.$router.currentRoute.query;
			this._getArticleDetail();
			// 获取评论列表
			this._getCommentList();

		},
		data() {
			return {
				articleData: null,
				showPopup: false,
				commentList: [],
				replyData: {},
			}
		},
		methods: {
			async _getArticleDetail() {
				const data = await this.$http.get_article_detail({
					article_id: this.articleData._id
				});
				this.articleData = data;
			},
			async openMaskerComment() {
				await this.checkIsLogin();
				this.showPopup = true;
			},
			async _sendCommentData(content) {
				const {
					msg
				} = await this.$http.update_comment({
					userId: this.userInfo._id,
					articleId: this.articleData._id,
					content,
					...this.replyData
				});
				// uni.showToast({
				// 	title:msg
				// })
				this.showPopup = false;
				//更新评论数据
				this.replyData = {};
				this._getCommentList();
			},
			async _getCommentList() {
				const listArr = await this.$http.get_comments({
					articleId: this.articleData._id
				});
				this.commentList = listArr;
			},
			commentReply(data) {
				this.replyData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply
				};
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id);
				this.openMaskerComment()
			},
			async _followAuthor() {
				await this.checkIsLogin();
				const {
					msg
				} = await this.$http.update_follow_author({
					authorId: this.articleData.author.id,
					userId: this.userInfo._id
				});
				uni.showToast({
					title: msg
				})
				//改变store里面的用户存储状态，同样本地存储也修改
				//处理用户存储信息
				let followIds = [...this.userInfo.author_likes_ids]
				if (followIds.includes(this.articleData.author.id)) {
					followIds = followIds.filter(item => item !== this.articleData.author.id)
				} else {
					followIds.push(this.articleData.author.id)
				}
				uni.$emit('updateAuthor');
				this.updateUserInfo({
					...this.userInfo,
					author_likes_ids: followIds
				})
			},
			async _updateCompliments() {
				await this.checkIsLogin();
				const {
					msg
				} = await this.$http.update_compliments({
					articleId: this.articleData._id,
					userId: this.userInfo._id
				})
				uni.showToast({
					title: msg
				})
				//修改用户点赞数量
				let thumbsArr = [...this.userInfo.thumbs_up_article_ids]
				if (thumbsArr.includes(this.articleData._id)) {
					this.articleData.thumbs_up_count -= 1;
					thumbsArr = thumbsArr.filter(item => item !== this.articleData._id)
				} else {
					this.articleData.thumbs_up_count += 1;
					thumbsArr.push(this.articleData._id)
				}
				this.updateUserInfo({
					...this.userInfo,
					thumbs_up_article_ids: thumbsArr
				})
			},
			//跳转到评论列表
			goCommentPage() {
				uni.navigateTo({
					url: `/pages/commentList/commentList?articleId=${this.articleData._id}`
				})
			}
		},
		computed: {
			content() {
				// return this.articleData.content ? marked(this.articleData.content) : null; //小程序读取未知计算属性会报错
				try {
					return marked(this.articleData.content)
				} catch (e) {
					return null
				}
			},
			//是否关注作者
			isFollowAuthor() {
				try {
					return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id)
				} catch (e) {
					//TODO handle the exception
					return false
				}
			},
			isCompliments() {
				try {
					return this.userInfo && this.userInfo.thumbs_up_article_ids.includes(this.articleData._id)
				} catch (e) {
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/articleDetail/css/articleDetail.scss'
</style>
