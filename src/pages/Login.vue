<template>
	<page>
		<template v-slot:content>
			<v-form>
				<h5>Sign Up</h5>
				<v-text-field
					label="Username"
					name="username"
					v-model="register.username"
				/>
				<v-text-field
					type="password"
					label="Password"
					name="password"
					v-model="register.password"
				/>
				<v-btn @click="onRegister">Sign Up</v-btn>
			</v-form>
			<v-form>
				<h5>Log In</h5>
				<v-text-field
					label="Username"
					name="username"
					v-model="login.username"
				/>
				<v-text-field
					type="password"
					label="Password"
					name="password"
					v-model="login.password"
				/>
				<v-btn @click="onLogin">Log In</v-btn>
			</v-form>
			
		</template>
	</page>
</template>

<script>
	import Page from './page.vue';
	import axios from 'axios';
	export default {
		data: function(){
			return {
				register: {
					username: null,
					password: null
				},
				login: {
					username: null,
					password: null
				},
				message: {
					type: null,
					text: null
				}
			}
		},
		methods: {
			async onRegister(e){
				try {
					const credentials = {username: this.register.username, password: this.register.password};
					const success = await axios.post('/users', credentials); 
					if (success) { //If it's succesful, attempt log in
						this.message = {
							type: 'success',
							text: 'Registration succesful! Redirecting...'
						};
						//Redirect here
						window.location.replace('/');
					}
					else { //Show error message
						this.message = {
							type: 'error',
							text: 'There was an error. Please try again later.'
						}
					}
				}
				catch (error){
					console.log('Error ' + error);
				}
			},
			async onLogin(e){
				try {
					const success = await axios.post('/login', this.login);
					if (success){
						window.location.replace('/');
					}
					else { //Show error message
						this.message = {
							type: 'error',
							text: 'There was an error. Please try again later.'
						}
					}
				}
				catch (error){
					console.log('Error ' + error);
				}
			}
		},


		components: {Page}
	}
</script>