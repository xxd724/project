'use strict';
const db=uniCloud.database()
const dbCmd=db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {articleId,userId}= event;
	
	const userList=await db.collection('user').doc(userId).get();
	const thumbs_up_article_ids =userList.data[0].thumbs_up_article_ids ;
	
	let tempArr=[];
	let returnMsg='';
	let thumbsNumber=null;
	
	if(thumbs_up_article_ids.includes(articleId)){
		returnMsg="您取消了点赞";
		tempArr=dbCmd.pull(articleId);
		thumbsNumber=-1;  //减一
	}else{
		returnMsg="点赞成功";
		tempArr=dbCmd.addToSet(articleId);
		thumbsNumber=1;  //加一
	}
	//将处理的用户信息进行重新插入
	await db.collection('user').doc(userId).update({
		thumbs_up_article_ids:tempArr
	})
	//更改文章的点赞数量
	await db.collection('article').doc(articleId).update({
		thumbs_up_count:dbCmd.inc(thumbsNumber)
	})
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:returnMsg
		}
	}
};
