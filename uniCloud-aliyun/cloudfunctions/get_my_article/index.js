'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		userId
	} = event;
	let userInfo = await db.collection('user').doc(userId).get();
	let article_ids = userInfo.data[0].article_ids;
	const list = await db.collection('article')
		.aggregate()
		.project({
			content: 0,
			comments: 0
		})
		.match({
			id: dbCmd.in(article_ids)
		})
		.end()

	//返回数据给客户端
	return {
		code: 0,
		msg: "请求成功",
		data: list.data
	}
};
