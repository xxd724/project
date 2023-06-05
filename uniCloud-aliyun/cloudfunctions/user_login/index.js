'use strict';
//获取数据库引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		loginName,
		password,
		phone,
		type
	} = event;

	if (type === 'account') {
		const res = await db.collection('user')
			.aggregate()
			.match({
				loginName,
				password
			})
			.end()
		console.log(res);
		return res.affectedDocs ? {
			code: 0,
			msg: "获取用户信息成功",
			data: res.data[0]
		} : {
			code: 1,
			msg: "获取用户信息失败，请检查账号或密码"
		}
	} else if (type === 'mobile') {
		const result = await db.collection('user')
			.aggregate()
			.match({
				phone
			})
			.end()
		console.log(result);
		return result.affectedDocs ? {
			code: 0,
			msg: "获取用户信息成功",
			data: result.data[0]
		} : {
			code: 1,
			msg: "手机号或验证码有误"
		}
	}
};
