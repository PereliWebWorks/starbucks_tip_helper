<template>
	<v-form ref="newEmployeeForm" @keyup.enter="attemptAddEmployee">
		<h3>Add an Employee</h3>	
			<v-flex md6 xs12>	
				<v-text-field 
					v-model="newEmployee.first"
					label="First Name"
					clearable
					required
				/>
			</v-flex>
			<v-flex xs12 md6>
				<v-text-field 
					v-model="newEmployee.last"
					label="Last Name"
					clearable
					required
				/>
			</v-flex>
		<v-btn @click="attemptAddEmployee">Add</v-btn>
	</v-form>
</template>

<script>
	import axios from 'axios';
	export default {
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
					 this.$store.commit('setProgressMessage');
					const {first, last} = this.newEmployee;
					const data = {first_name: first, last_name: last};
					const employee = await axios.post('/employees', data);
					if (employee && employee.data){
						this.$store.commit('setMessage', {text: 'Employee added!', type: 'success'});
						this.$store.commit('addEmployee', employee.data);
						this.$refs.newEmployeeForm.reset();
					}
				}
				catch (err){
					console.log(error);
				}
			}
		}
	}
</script>