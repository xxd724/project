'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		content,
		feedbackImageList,
		userId
	} = event;
	await db.collection('feedback').add({
		user_id: userId,
		feedbackImageList,
		content
	})
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "提交成功"
		}
	}
};
