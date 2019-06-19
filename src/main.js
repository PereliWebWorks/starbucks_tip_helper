// import "@babel/polyfill";
import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import routes from '@/routes.js';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from '@/App.vue';
import axios from 'axios';

Vue.use(Vuex);
Vue.use(Router);
Vue.use(Vuetify, {iconfont: 'md'});
Vue.config.productionTip = false;

const store = new Vuex.Store({
	state: {
		employees: false, //Starts as false before downloading
		message: {
			type: 'info',
			text: '',
			timeout: 6000,
			show: false,
			loading: false
		}
	},
	mutations: {
		setMessage(state, message){
			let text = message.text;
			if (!text) throw new Error('You must include text when setting the message');
			let type = message.type || 'info';
			let show = true;
			state.message = {text, type, timeout: 6000, show, loading: false};
		},
		setProgressMessage(state){
			state.message = {timeout: 0, type: 'info', show: true, loading: true};
		},
		hideMessage(state){
			state.message.show = false;
		},
		addEmployee(state, e){
			e.hours = 0;
			state.employees.push(e);
		},
		updateEmployee(state, params){
			let employee = state.employees.find(e => e.id === params.id);
			if (!employee) throw new Error('Could not find employee with id ' + params.id);
			Object.assign(employee, params);
		},
		deleteEmployee(state, id){
			state.employees = state.employees.filter(emp => emp.id !== id);
		},
		addAllEmployees(state, employees){
			state.employees = employees.map(e => {e.hours = 0; return e;});
		},
		deleteAllEmployees(state){
			state.employees = false;
		}
	},
	actions: {
		async downloadEmployees({commit}){
			try{
				const res = await axios.get('/employees');
				commit('addAllEmployees', res.data);
			}
			catch (err){
				console.log(err);
				return false;
			}
		}
	}
});

if (localStorage.getItem('loggedIn') === 'true') store.dispatch('downloadEmployees');

const router = new Router({routes});

router.beforeEach((to, from, next) => {
	if (to.matched.some(r => r.meta.requiresAuth)){
		if (localStorage.getItem('loggedIn') !== 'true') {
			return next({path: '/login'});
		}
	}
	else if (to.matched.some(r => r.meta.requiresGuest)){
		if (localStorage.getItem('loggedIn') === 'true') {
			return next({path: '/'});
		}
	}
	next();
});

new Vue({
	store,
  router,
  render: h => h(App) 
}).$mount('#app');
