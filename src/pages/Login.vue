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
					this.$store.commit('setProgressMessage');
					const credentials = {username: this.register.username, password: this.register.password};
					await axios.post('/users', credentials); 
					this.$store.commit('setMessage', {
						type: 'success',
						text: 'Registration succesful! Redirecting...'
					});
					localStorage.setItem('loggedIn', 'true');
					this.$store.dispatch('downloadEmployees');
					this.$router.push('/tips');
				}
				catch (error){
					let text = 'There was an error. Please try again later.';
					let type = 'error';
					if (error.response){
						if (error.response.status === 409){
							text = 'That username is already being used.';
							type = 'warning';
						}
					}
					this.$store.commit('setMessage', {type, text});
				}
			},
			async onLogin(e){
				try {
					this.$store.commit('setProgressMessage');
					await axios.post('/login', this.login);
					localStorage.setItem('loggedIn', 'true');
				 	this.$store.dispatch('downloadEmployees');
				 	this.$store.commit('setMessage', {text: 'Welcome!', type: 'success'});
					this.$router.push('/');
				}
				catch (error){
					let text = 'There was an error. Please try again later.';
					let type = 'error';
					if (error.response){
						if (error.response.status === 401){
							text = 'Invalid username or password.';
						}
					}
					this.$store.commit('setMessage', {type, text});
				}
			}
		}
	}
</script>