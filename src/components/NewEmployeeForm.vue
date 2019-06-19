<template>
	<v-form ref="newEmployeeForm" @keyup.native.enter="attemptAddEmployee" lazy-validation>
		<h3>Add an Employee</h3>	
			<v-flex md6 xs12>	
				<v-text-field 
					v-model="newEmployee.first"
					label="First Name"
					clearable
					:rules="nameRules"
					id="first-name-field"
				/>
			</v-flex>
			<v-flex xs12 md6>
				<v-text-field 
					v-model="newEmployee.last"
					label="Last Name"
					clearable
					:rules="nameRules"
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
					first: '',
					last: ''
				},
				nameRules: [v => !!v || 'This field is required']
			}
		},
		methods: {
			async attemptAddEmployee(){
				try {
					if (!this.$refs.newEmployeeForm.validate()) return;
					this.$store.commit('setProgressMessage');
					const {first, last} = this.newEmployee;
					const data = {first_name: first, last_name: last};
					const response = await axios.post('/employees', data);
					this.$store.commit('setMessage', {text: 'Employee added!', type: 'success'});
					this.$store.commit('addEmployee', response.data);
					this.$refs.newEmployeeForm.reset();
					document.getElementById('first-name-field').focus();
				}
				catch (error){
					console.log(error);
				}
			}
		}
	}
</script>