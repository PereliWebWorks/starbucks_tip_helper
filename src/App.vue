<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title>Tip Helper</v-toolbar-title>
			<v-toolbar-items class="hidden-sm-and-down">	
				<template v-if="loggedIn()">	
					<v-btn flat to="/tips">Tips</v-btn>
					<v-btn flat to="/employees">Employees</v-btn>
					<v-btn flat @click="logout">Log Out</v-btn>
				</template>
				<v-btn flat to="/donate">Donate</v-btn>
			</v-toolbar-items>
		</v-toolbar>
		<v-content>
			<v-container fluid grid-list-md>
				<v-layout>
					<v-flex xs12 md6 offset-md3>
						<v-alert
							:value="!!message.text"
							:type="message.type || 'info'"
							transition="fade-transition"
						>
							{{message.text}}
						</v-alert>
					</v-flex>
				</v-layout>
				<router-view 
					:employees="employees" 
					v-on:message="setMessage"
				></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import axios from 'axios';
	export default{
		data: function(){
			return {
				message: {
					type: null,
					text: null
				},
				employees: null
			}
		},
		methods: {
			setMessage({text, type}){
				this.message.text = text; 				
				this.message.type = type;
			},
			setEmployees(employees){
				this.employees = employees;
			},
			addEmployee(employee){
				this.employees.push(employee);
			},
			deleteEmployee(id){
				this.employees = this.employees.filter(e => e.id !== id);
			},
			async downloadEmployees(){
				try{
					const employees = await axios.get('/employees');
					if (employees){
						this.setEmployees(employees.data);
					}
				}
				catch (err){
					console.log(err);
				}
			},
			async logout(){
				const success = await axios.post('/logout');
				if (success){
					localStorage.setItem('loggedIn', 'false');
					this.employees = null;
					this.$router.push('/login');
				}
			},
			loggedIn(){
				return localStorage.getItem('loggedIn') ===
				 'true';
			}
		},
		provide() {
			return {
				addEmployee: this.addEmployee,
				deleteEmployee: this.deleteEmployee,
				downloadEmployees: this.downloadEmployees
			};
		}
	}
</script>
