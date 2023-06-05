<template>
	<view class="label-container">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit" @click="changeEdit">{{isEdit ? '完成' : '编辑'}}</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item,index) in selflabelList" :key="item._id">
					{{item.name}}
					<uni-icons @click="deletelabelItem(item)" v-if="isEdit" type="clear" class="icon-close" size="20" color="#ff0000"></uni-icons>
				</view>
				<view v-if="!selflabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<!-- 标签推荐界面 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<view class="label-content">
				<view @click="changeSelfLabelList(item)" class="label-content-item" v-for="(item,index) in recommendlabelList" :key="item._id">
					{{item.name}}
				</view>
				<view v-if="!recommendlabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				isEdit:false,
				labelIds:[]
			}
		},
		watch:{
			userInfo:{
				immediate:true,
				handler(newVal,oldVal){
					this.labelIds=this.userInfo.label_ids;
				}
			}
		},
		methods: {
			changeEdit(){
				this.isEdit && this._updatelabel();
				this.isEdit=!this.isEdit;
			},
			//修改标签发送给后端
			async _updatelabel(){
				const label_ids = this.selflabelList.map(item => item._id);
				const {msg} = await this.$http.update_label_ids({userId:this.userInfo._id,label_ids});
				uni.showToast({
					title:msg
				})
				this.updateUserInfo({...this.userInfo,label_ids})
			},
			changeSelfLabelList(item){
				if(!this.isEdit){return}
				this.labelIds.push(item._id);
			},
			//删除标签
			deletelabelItem(item){
				this.labelIds = this.labelIds.filter(id => id !== item._id);
			}
		},
		computed:{
			...mapState(['labelList']),
			selflabelList(){
				return this.labelList.filter(item =>this.labelIds.includes(item._id));
			},
			recommendlabelList(){
				return this.labelList.filter(item =>!this.labelIds.includes(item._id) && item._id);
			}
		}
	}
</script>

<style lang="scss">
@import '@/pages/labelAdmin/css/labelAdmin.scss'
</style>
