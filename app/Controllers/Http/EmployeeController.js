'use strict'
const capitalize = require('just-capitalize');
const Employee = use('App/Models/Employee');
const { validate } = use('Validator');

class EmployeeController {
	async store({request, response, auth}){
		try {
			const rules = {
			  first_name: 'required',
			  last_name: 'required'
			};
			const validation = await validate(request.all(), rules);
			if (validation.fails()) return response.conflict({});
			const user = await auth.getUser();
			const {first_name, last_name} = request.all();
			const employee = await Employee.create({
				user_id: user.id,
				first_name: capitalize(first_name),
				last_name: capitalize(last_name)
			});
			response.created(employee);
		}
		catch (err){
			console.log(err);
			response.internalServerError({});
		}
	}

	async index({request, response, auth}){
		try {
			const user = await auth.getUser();
			const employees = await user.employees().fetch();
			response.ok(employees);
		}
		catch (error){
			console.log(err);
			response.internalServerError({});
		}
	}

	async destroy({params, response, auth}){
		try{
			const user = await auth.getUser();
			const employee = await Employee.find(params.id);
			if (employee.user_id !== user.id) return response.forbidden({});
			await employee.delete();
			response.ok({});
		}
		catch(err){
			console.log(err);
			response.internalServerError({});
		}
	}
}

module.exports = EmployeeController
