<template>
	<view class="login-container">
		<image src="../../../static/img/login_bg.png" mode="" class="banner-bg"></image>
		<!-- 导航 -->
		<view class="login-nav">
			<view class="nav-item" @click="changeaccount" :class="isShow ? 'active': ''">
				账号登录
			</view>
			<view class="nav-item" @click="changemobile" :class="isShow ? '' : 'active'">
				手机登录
			</view>
		</view>
		<!-- 表单部分 -->
		<uni-forms class="form" ref="form" :modelValue="formData">
			<view v-if="isShow">
				<uni-forms-item label="账号" name="loginName">
					<input type="text" placeholder-class="placeholder" class="form-input" placeholder="请输入账号"
						v-model="formData.loginName">
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input password"
						type="password" placeholder="请输入密码" v-model="formData.password"></uni-easyinput>
				</uni-forms-item>
			</view>
		</uni-forms>
		<uni-forms class="form" ref="forms" :modelValue="formData">
			<view v-if="!isShow">
				<uni-forms-item label="手机号" name="phone">
					<input type="number" placeholder-class="placeholder" class="form-input" placeholder="请输入手机号"
						v-model="formData.phone">
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<input placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入验证码"
						v-model="formData.vCode" />
					<SendCode @setCurrentCode="returnCode=$event" @getForm="getForm" class="code-component"></SendCode>
				</uni-forms-item>
			</view>
			<button class="login-btn" @click="_userLoginValidate">立即登录</button>
		</uni-forms>
		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		onReady() {
			this.$refs.form.setRules(this.userRules);
			this.$refs.forms.setRules(this.userRules);
		},
		data() {
			return {
				type: '',
				isShow: true,
				formData: {
					loginName: "",
					password: "",
					phone: "",
					vCode: ""
				},
				returnCode: ''
			}
		},
		methods: {
			async _userLoginValidate() {
				const res = await this.$refs.form.validate();
				const result = await this.$refs.forms.validate();
				if (this.isShow) {
					this.type = "account";
					this._sendUserInfo({
						...res,
						type: this.type
					})
				} else {
					this.type = "mobile";
					this._sendUserInfo({
						...result,
						type: this.type
					})
				}
			},
			//切换表单类型
			changeaccount() {
				this.isShow = true;
				this.type = 'account';
				this.formData = {};
				this.$refs.forms.clearValidate([]); //清空校验规则
			},
			changemobile() {
				this.isShow = false;
				this.type = 'mobile';
				this.formData = {};
				this.$refs.form.clearValidate([]);
			},
			//发送数据到后端
			async _sendUserInfo(data) {
				const user = await this.$http.user_login(data);
				if (user) {
					//使用store的形式进行存储
					this.updateUserInfo(user);
					uni.showToast({
						title: "登录成功",
						icon: 'success'
					});
					setTimeout(() => {
						uni.switchTab({
							url: "/pages/index/index"
						})
						// // #ifdef H5
						// uni.switchTab({
						// 	url: "/pages/index/index"
						// })
						// // #endif
						// // #ifndef H5
						// uni.navigateBack()
						// // #endif
						// // uni.navigateBack()
					}, 1000);
				}
			},
			//发送表单到sendCode组件
			getForm(cb) {
				cb && cb(this.$refs.forms)
			},
			...mapMutations(['updateUserInfo'])
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.code-component {
		flex-shrink: 0;
	}
</style>
<style lang="scss" scoped>
	@import '@/pages/userInfo/login/css/login.scss';
</style>
