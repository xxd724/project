'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		userId
	} = event;
	let userInfo = await db.collection('user').doc(userId).get();
	let author_likes_ids = userInfo.data[0].author_likes_ids;

	const list = await db.collection('user')
		.aggregate()
		.addFields({
			// 判断这个文章的数组是否包含文章的_id ,$_id 指的是文章列表里面的_id,如果包含，返回true，否则，返回false，在这个里面是过滤查询的每一条记录值
			is_like: $.in(['$id', author_likes_ids])
		})
		.project({
			password: 0,
			loginName: 0
		})
		.match({
			is_like: true
		})
		.end()

	//返回数据给客户端
	return {
		code: 0,
		msg: "请求成功",
		data: list.data
	}
};
