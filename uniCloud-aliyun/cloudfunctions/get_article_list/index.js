'use strict';
const db=uniCloud.database();
exports.main = async (event, context) => {
	// const {classify} =event;
	const {classify,page=1,pageSize=10} =event;
	let matchObj={};
	if(classify !== "全部"){
		matchObj={classify}
	}
	const list=await db.collection('article')
	.aggregate()
	.match(matchObj)
	.project({
		content:0
	})
	.skip(pageSize * (page - 1)) // 第一页的数据是从0开始的
	.limit(pageSize)  //每页返回多少条数据
	.end()
	
	//返回当前匹配的选项里的数据总数
	const {total}=await db.collection('article').where(matchObj).count();
	
	//返回数据给客户端
	return {
		code:0,
		msg:"数据获取成功",
		// data:list.data
		data:{
			articleList:list.data,
			total
		}
	}
};
