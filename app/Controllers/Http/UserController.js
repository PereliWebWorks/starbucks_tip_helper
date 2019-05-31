'use strict'

const User = use('App/Models/User');
const Hash = use('Hash');

class UserController {

  async login ({ request, response, auth }) {
    try {
      const { username, password } = request.all();
      await auth.attempt(username, password)
      response.json(true);
    }
    catch (error){
      console.log(error);
      response.json(false);
    }
  }

  async logout({response, auth}) {
    try {
      await auth.logout();
    }
    catch (error){
      console.log(error);
    }
    response.route('login');
  }

  async store({request, response, auth}) {
    try {
    	const user = new User();
      const { username, password } = request.all();
    	user.username = username;
    	user.password = password; //Password will be hashed
    	await user.save();
      await auth.attempt(username, password);
      response.json(true);
    }
    catch(error){
      console.log(error);
      response.json(false);
    }
  }
}

module.exports = UserController
