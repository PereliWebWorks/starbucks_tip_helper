'use strict'

const User = use('App/Models/User');
const Hash = use('Hash');
const { validate } = use('Validator');

class UserController {

  async login ({ request, response, auth }) {
    try {
      const { username, password } = request.all();
      await auth.attempt(username, password);
      response.ok({});
    }
    catch (error){
      if (error.name === 'PasswordMisMatchException' || error.name === 'UserNotFoundException'){
        return response.unauthorized({});
      }
      console.log(error);
      return response.internalServerError({});
    }
  }

  async logout({response, auth}) {
    try {
      await auth.logout();
      response.ok({});
    }
    catch (error){
      console.log(error);
      response.internalServerError({});
    }
  }

  async store({request, response, auth}) {
    try {
      const rules = {
        username: 'required|unique:users,username',
        password: 'required'
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) return response.conflict({});
    	const user = new User();
      const { username, password } = request.all();
    	user.username = username;
    	user.password = password; //Password will be hashed
    	await user.save();
      await auth.attempt(username, password);
      response.created({});
    }
    catch(error){
      console.log(error);
      response.internalServerError({});
    }
  }
}

module.exports = UserController
