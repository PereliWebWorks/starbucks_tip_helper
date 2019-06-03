<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title>Tip Helper</v-toolbar-title>
			<v-toolbar-items class="hidden-sm-and-down">	
				<v-btn flat>
					<router-link to="/donate">Donate</router-link>
				</v-btn>
				<v-btn flat @click="logout">Log Out</v-btn>
			</v-toolbar-items>
		</v-toolbar>
		<v-content>
			<v-container fluid>
				<v-alert
					:value="!!message.text"
					:type="message.type || 'info'"
				>
					{{message.text}}
				</v-alert>
				<router-view></router-view>
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
				}
			}
		},
		methods: {
			setMessage({text, type}){
				this.message.text = text;
				this.message.type = type;
			},
			async logout(){
				const success = await axios.post('/logout');
				if (success){
					localStorage.setItem('loggedIn', 'false');
					this.$router.push('/login');
				}
			}
		},
		provide() {
			return {
				setMessage: this.setMessage
			};
		}
	}
</script>
