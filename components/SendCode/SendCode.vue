<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{runTime ? `${time}秒后重新获取` : '获取验证码'}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "SendCode",
		//不支持小程序
		props: {
			forms: Object
		},
		data() {
			return {
				time: 60,
				timeId: null,
				runTime: false
			};
		},
		methods: {
			getForm() {
				if (this.runTime) {
					return
				}
				this.$emit('getForm', this._sendCode)
			},
			async _sendCode(forms) {
				//获取form表单 =>phone单独的进行验证
				const {
					phone
				} = await forms.validateField(['phone']);
				//定时器的创建
				this.runTime = true;
				this.timeRunning();
				const {
					msg,
					mobileCode
				} = await this.$http.get_code({
					phone
				});
				this.$emit('setCurrentCode', mobileCode)
			},
			timeRunning() {
				this.timeId = setInterval(() => {
					if (this.time === 1) {
						clearInterval(this.timeId);
						this.timeId = null;
						this.runTime = false;
						this.time = 60
					}
					this.time--
				}, 1000)
			}
		},
		beforeDestroy() { // 组件销毁
			clearInterval(this.timeId);
			this.timeId = null;
			this.time = 60;
			this.runTime = false
		}
	}
</script>

<style lang="scss" scoped>
	.code-container {
		flex-shrink: 0;
		margin-right: 20rpx;

		.vCode-btn {
			background-color: $base-color;
			border-radius: 10rpx;
			padding: 18rpx;
			opacity: .8;
			color: #fff;
		}
	}
</style>
