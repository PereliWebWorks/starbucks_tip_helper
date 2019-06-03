import Main from './pages/Main.vue';
import Login from './pages/Login.vue';

const routes = [
	{path: '/', component: Main, meta: {requiresAuth: true}},
	{path: '/login', component: Login, meta: {requiresGuest: true}}
];


export default routes;