import "@babel/polyfill";
import Vue from 'vue';
import Vuetify from 'vuetify';
import Login from './pages/Login.vue';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);



Vue.config.productionTip = false;

new Vue({
  render: h => h(Login),
}).$mount('#app');
