import "@babel/polyfill";
import Vue from 'vue';
import Vuetify from 'vuetify';
import Main from './pages/Main.vue';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);



Vue.config.productionTip = false;

new Vue({
  render: h => h(Main),
}).$mount('#app');
