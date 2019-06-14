import Tips from 'Pages/Tips.vue';
import Login from 'Pages/Login.vue';
import Employees from 'Pages/Employees.vue';

const routes = [
	{path: '/tips', component: Tips, meta: {requiresAuth: true}},
	{path: '/', redirect: '/tips'},
	{path: '/login', component: Login, meta: {requiresGuest: true}},
	{path: '/employees', component: Employees, meta: {requiresAuth: true}}
];


export default routes;