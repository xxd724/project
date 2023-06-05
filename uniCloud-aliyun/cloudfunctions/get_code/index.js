'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		phone
	} = event;
	//创建一个随机数,返回给前端
	const currentNumber = Math.random().toString().substr(2, 6);
	try {

		const res = uniCloud.sendSms({
			appid: '', //uni-app应用标识
			smsKey: '', //smsKey
			smsSecret: '', //smsSecret
			phone, //发送目标手机号   单条短信发送
			// phoneList:['188********', '138********'],  //发送目标手机号  多条短信发送
			templateId: '12333', // 获取的短信模版
			data: {
				// name:"",
				code: currentNumber, //验证码
				// action:'注册',
				expMinute: '3' //多少分钟内有效
			}
		})
		//调用成功，请注意这时不代表发送成功
		return {
			code: 0,
			data: {
				mobileCode: currentNumber,
				msg: "请注意在手机上查看"
			}
		}
	} catch (err) {
		// 调用失败
		return {
			code: 1,
			msg: '短信验证码发送失败'
		}
	}

};