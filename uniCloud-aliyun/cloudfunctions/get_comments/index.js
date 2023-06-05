'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		articleId,
		pageSize=10,
		page=1
		} =event;
		
	const list =await db.collection('article')
	.aggregate()
	.match({
		_id:articleId
	})
	.unwind('$comments')   //使用指定的数组字段中的每个元素，对文档进行拆分。拆分后，文档会从一个变为一个或多个，分别对应数组的每个元素。想要拆分的数组的字段名，需要以 $ 开头
	.project({
		_id:0,
		comments:1
	})  //把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段   <字段>: <1 或 true> 指定包含某个已有字段      _id: <0 或 false>	舍弃 _id 字段
	.replaceRoot({
		newRoot:'$comments'
	}) //指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。  <字段名>	指定一个已有字段作为输出的根节点（如果字段不存在则报错） <对象>	计算一个新字段，并且把这个新字段作为根节点  以$开头
	.skip(pageSize * (page - 1))   //指定一个正整数，跳过对应数量的文档，输出剩下的文档。
	.limit(pageSize) //限制输出到下一阶段的记录数。
	.end()
	return {
		code:0,
		msg:"评论内容获取成功",
		data:list.data
	}
};
