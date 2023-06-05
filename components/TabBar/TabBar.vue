<template>
	<view class="tab">
		<!-- 滚动区域 -->
		<scroll-view scroll-x="true" class="tab-scroll" :scroll-with-animation="true" :scroll-into-view="currentIndex">
			<view class="tab-scroll-box">
				<view @click="changeActiveIndex(index)" :class="{active:activeIndex === index}" class="tab-scroll-item" v-for="(item,index) in labelList" :key="index" :id="`item${index}`">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<!-- 图标部分 -->
		<view class="tab-icon">
			<uni-icons @click="goLabelAdmin" type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"TabBar",
		props:{
			labelList:Array,
			activeIndex:Number
		},
		watch:{
			activeIndex(index){
				this.currentIndex=`item${index}`;
			}
		},
		data() {
			return {
				currentIndex:'item0'
			}
		},
		methods:{
			async goLabelAdmin(){
				await this.checkIsLogin()
				uni.navigateTo({
					url:'../../pages/labelAdmin/labelAdmin'
				})
			},
			changeActiveIndex(index){
				this.$emit('changeActiveIndex',index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/components/TabBar/css/TabBar.scss'
</style>