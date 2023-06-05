import { mapState,mapMutations } from 'vuex'
export default {
	install(Vue){
		Vue.mixin({
			data(){
				return{
					
				}
			},
			methods:{
				checkIsLogin(){
					return new Promise(resolve => {
						if(this.userInfo){
							resolve()
						}else{
							uni.navigateTo({
								url:'../../pages/userInfo/login/login'
							})
						}
					})
				},
				...mapMutations(['updateUserInfo'])
			},
			computed:{
				...mapState(['userInfo'])
			}
		})
	}
}