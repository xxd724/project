export default {
	install(Vue) { //使用install的形式进行安装mixin
		Vue.mixin({
			data() {
				return {
					userRules: {
						loginName: {
							rules: [{//required: true  是否必填，配置此参数不会显示输入框左边的必填星号，如需要，请配置uni-forms-item组件的的required为true
							required: true, "errorMessage": "账号不能为空"},
							{validateFunction: this.validateLoginName}]
						},
						password: {
							rules: [{required: true,'errorMessage': "密码不能为空"}]
						},
						phone: {
							rules: [{required: true,"errorMessage": "手机号码不能为空"},
							{validateFunction: this.validatePhone}]
						},
						vCode: {
							rules: [{required: true,"errorMessage": "验证码不能为空"},
							{validateFunction: this.validateMobileCode}]
						}
					},
					mobileReg: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
				}
			},
			methods: {
				validateLoginName(rule, val, data, callback) {
					switch (true) {
						case val.length < 6:
							callback("用户名不正确");
							break;
						default:
							return true
					}
				},
				/* 验证手机号码 */
				validatePhone(rule, val, data, callback) {
					switch (true) {
						case !this.mobileReg.test(val):
							callback('手机号码格式不正确')
							break;
						default:
							return true
					}
				},
				//验证后端返回验证码
				validateCode(rule, val, data, callback) {
					switch(true){
						case val !== this.returnCode:
						callback('请输入正确的验证码')
						break;
						default:
						return true
					}
				}
			}
		})
	}
}
