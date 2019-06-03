<template>
	<v-layout>
		<v-flex xs12 md6>
			<v-form ref="newEmployeeForm">
				<h3>Add an Employee</h3>
				<v-text-field 
					v-model="newEmployee.first"
					label="First Name"
					clearable
				/>
				<v-text-field 
					v-model="newEmployee.last"
					label="Last Name"
					clearable
				/>
				<v-btn @click="attemptAddEmployee">Add</v-btn>
			</v-form>
		</v-flex>
		<v-flex xs12 md4 offset-md2>
			<v-card>
				<v-list>
					<v-subheader>Employees</v-subheader>
					<template v-if="employees">	
						<v-list-tile
							v-for="employee in employees"
							:key="employee.id"
							@click=""
						>
							<v-list-tile-content>
								{{employee.first_name}} {{employee.last_name}}
							</v-list-tile-content>
							<v-list-tile-action>
								<v-btn icon ripple @click="() => attemptDeleteEmployee(employee.id)"><v-icon>delete</v-icon></v-btn>
							</v-list-tile-action>
						</v-list-tile>
					</template>
					<template v-else>
						<v-subheader>Loading employee data...</v-subheader>
					</template>
				</v-list>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from 'axios';
	export default {
		props: ['employees'],
		data: function(){
			return {
				newEmployee: {
					first: null,
					last: null
				}
			}
		},
		methods: {
			async attemptAddEmployee(){
				try {	
					 this.$emit('message', {text: 'Adding employee...'});
					const {first, last} = this.newEmployee;
					const data = {first_name: first, last_name: last};
					const employee = await axios.post('/employees', data);
					if (employee && employee.data){
						 this.$emit('message', {text: 'Employee added!', type: 'success'});
						this.addEmployee(employee.data);
						this.$refs.newEmployeeForm.reset();
					}
				}
				catch (err){
					console.log(error);
				}
			},
			async attemptDeleteEmployee(id){
				try {
					 this.$emit('message', {text: 'Deleting employee...'});
					const success = await axios.delete(`/employees/${id}`);
					if (success && success.data){
						 this.$emit('message', {text: 'Employee deleted', type: 'success'});
						this.deleteEmployee(id);
					}
				}
				catch(err){
					console.log(err);
				}
			}
		},
		created(){
			if (!this.employees) this.downloadEmployees();
		},
		inject: ['addEmployee', 'downloadEmployees', 'deleteEmployee'],
	}
</script>