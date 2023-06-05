'use strict';
//数据库引用
const db = uniCloud.database();
//定义修改指令
const dbCmd=db.command;
exports.main = async (event, context) => {
	const {userId,articleId} =event;
	//获取用户数据表的集合
	const userInfo=await db.collection('user').doc(userId).get();
	const articleIds=userInfo.data[0].article_likes_ids;
	let articleArr=null;
	let msg=null;
	//判断数据表的指定数据里面是否收藏了这篇文章
	if(articleIds.includes(articleId)){
		//删除操作
		articleArr=dbCmd.pull(articleId);
		msg="取消收藏";
	}else{
		//添加操作
		articleArr=dbCmd.addToSet(articleId)
		msg="收藏成功"
	}
	//修改当前指定的用户的收藏文章状态
	await db.collection('user').doc(userId).update({
		article_likes_ids:articleArr
	})
	//重新获取用户信息
	const updateUser=await db.collection('user').doc(userId).get()
	return {
		code:0,
		data:{
			msg,
			newUserInfo:updateUser.data[0]
		}
	}
};
