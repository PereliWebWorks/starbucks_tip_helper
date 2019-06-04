<template>
	<div>
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
	</div>
</template>

<script>
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
				}
			}
		},
		methods: {
			async onRegister(e){
				try {
					const credentials = {username: this.register.username, password: this.register.password};
					const success = await axios.post('/users', credentials); 
					if (success) { //If it's succesful, attempt log in
						 this.$emit('message', {
							type: 'success',
							text: 'Registration succesful! Redirecting...'
						});
						localStorage.setItem('loggedIn', 'true');
						this.$router.push('/tips');
					}
					else { //Show error message
						 this.$emit('message', {
							type: 'error',
							text: 'There was an error. Please try again later.'
						});
					}
				}
				catch (error){
					console.log('Error ' + error);
				}
			},
			async onLogin(e){
				try {
					this.$emit('message', {text: 'Logging in...', fade: false});
					const success = await axios.post('/login', this.login);
					if (success){
						localStorage.setItem('loggedIn', 'true');
					 	this.$emit('message', {text: 'Welcome!', type: 'success'});
						this.$router.push('/');
					}
					else { //Show error message
						 this.$emit('message', {
							type: 'error',
							text: 'There was an error. Please try again later.'
						});
					}
				}
				catch (error){
					console.log('Error ' + error);
				}
			}
		}
	}
</script>