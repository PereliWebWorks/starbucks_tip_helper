<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title>Tip Helper</v-toolbar-title>
			<v-spacer></v-spacer>
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
				<v-snackbar
					v-model="message.show"
					:color="message.type"
					:top="true"
					:timeout="message.timeout"
				>
					{{message.text}}
				</v-snackbar>
				<keep-alive>
					<router-view 
						:employees="employees" 
						v-on:message="setMessage"
					></router-view>
				</keep-alive>
			</v-container>
		</v-content>
		<v-footer app height="auto">
      <v-layout justify-center row wrap>
        <v-flex py-3 text-xs-center white--text xs12>
          <strong>By <a href="https://pereliwebworks.com" target="_blank">Drew Pereli</a></strong>
        </v-flex>
      </v-layout>
    </v-footer>
	</v-app>
</template>

<script>
	import axios from 'axios';
	export default{
		data: function(){
			return {
				message: {
					type: 'info',
					text: '',
					show: false,
					timeout: 6000
				},
				employees: null
			}
		},
		methods: {
			setMessage({text, type, fade=true}){
				this.message.text = text; 				
				this.message.type = type || 'info';
				this.message.show = true;
				if (!fade){
					this.message.timeout = 0;
				}
				else {
					this.message.timeout = 6000;
				}
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
						return true;
					}
					return false;
				}
				catch (err){
					console.log(err);
					return false;
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
				return localStorage.getItem('loggedIn') === 'true';
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
