'use strict'


/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers');

//Log in screen
Route.get('login', ({response}) => {
	response.download(Helpers.publicPath('login.html'));
}).middleware(['guest']);

//Log in
Route.post('login', 'UserController.login').middleware(['guest']).as('login');
//Log out
Route.route('logout', 'UserController.logout').middleware(['auth']);


//Register
Route.resource('users', 'UserController').only(['store']).middleware(['guest']);

//Get profile info
Route.resource('users', 'UserController').only(['show', 'destroy']).middleware(['auth']);

//CRUD for employees
Route
	.resource('employees', 'EmployeesController')
	.apiOnly()
	.middleware(['auth']);

//Main page
Route.get('/', ({response}) => {
	response.download(Helpers.publicPath('main.html'));
}).middleware(['auth']).as('main');