'use strict'
const capitalize = require('just-capitalize');
const Employee = use('App/Models/Employee');

class EmployeeController {
	async store({request, response, auth}){
		try {
			const user = await auth.getUser();
			const {first_name, last_name} = request.all();
			const employee = await Employee.create({
				user_id: user.id,
				first_name: capitalize(first_name),
				last_name: capitalize(last_name)
			});
			response.json(employee);
		}
		catch (err){
			console.log(err);
			response.json(false);
		}
	}

	async index({request, response, auth}){
		try {
			const user = await auth.getUser();
			const employees = await user.employees().fetch();
			response.json(employees);
		}
		catch (error){
			console.log(err);
			response.json(false);
		}
	}

	async destroy({params, response, auth}){
		try{
			const user = await auth.getUser();
			const employee = await Employee.find(params.id);
			if (employee.user_id !== user.id) throw new Error('Employee does not belong to user');
			await employee.delete();
			response.json(true);
		}
		catch(err){
			console.log(err);
			response.json(false);
		}
	}
}

module.exports = EmployeeController
