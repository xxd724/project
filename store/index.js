import Vue from 'vue';
import VueX from 'vuex';
import actions from './actions.js';
import mutations from './mutations.js';
import state from './state.js';

Vue.use(VueX);

export default new VueX.Store({
	actions,
	mutations,
	state
})
