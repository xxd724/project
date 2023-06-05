export default {
	updateUserInfo(state,userInfo){
		uni.setStorageSync("userInfo",userInfo);  //本地储存用户信息
		state.userInfo=userInfo;  //修改store数据
	},
	//修改历史记录存储
	setHistory(state,val){
		let list=state.historyList;
		if((list.length > 0) && list.findIndex(item =>item ===val) > -1){return}  //如果有数据就不做存储
		//如果没有数据
		list.unshift(val);
		uni.setStorageSync('historyList',list);
		state.historyList=list;
	},
	//清空历史记录
	cleanHistory(state){
		uni.removeStorageSync('historyList');
		state.historyList=[];
	},
	//设置导航栏选项卡
	setlabelList(state,labelList){
		uni.setStorageSync("labelList",labelList);
		state.labelList=labelList;
	}
}