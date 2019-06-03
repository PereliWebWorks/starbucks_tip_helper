// import "@babel/polyfill";
import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes.js';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from './App.vue';

Vue.use(Router);
Vue.use(Vuetify, {iconfont: 'md'});
Vue.config.productionTip = false;

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
  router,
  render: h => h(App) 
}).$mount('#app');
