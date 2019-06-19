<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title><v-btn depressed flat to="/tips" :active-class="null">Tips Helper</v-btn></v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">	
				<template v-if="loggedIn()">	
					<v-btn flat to="/tips">Tips</v-btn>
					<v-btn flat to="/employees">Employees</v-btn>
					<v-btn flat @click="logout">Log Out</v-btn>
				</template>
				<v-btn flat @click="donateModalOpen = true">Donate</v-btn>
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
					<template v-if="!message.loading">
						{{message.text}}
						<v-spacer />
						<v-btn flat @click="hideMessage"><v-icon>close</v-icon></v-btn>
					</template>
					<template v-else>
						<v-progress-linear indeterminate />
					</template>
				</v-snackbar>
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
				<div class="text-xs-center">
					<v-dialog v-model="donateModalOpen" width="350">
						<v-card>
							<v-card-title primary-title class="headline">Help me pay for the server!</v-card-title>
							<v-divider />
							<v-card-text class="text-xs-center">
								<v-form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
									<input type="hidden" name="cmd" value="_donations" />
									<input type="hidden" name="business" value="CSTKGJFRDZ9E6" />
									<input type="hidden" name="currency_code" value="USD" />
									<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
									<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
								</v-form>
							</v-card-text>
							<v-divider />
							<v-card-actions>
								<v-btn flat @click="donateModalOpen = false">Close</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</div>
			</v-container>
		</v-content>
		<v-footer app height="auto">
      <v-layout pa-3 justify-center align-content-space-between row wrap>  
        <v-flex xs12 md6>
          <strong>By <a href="https://pereliwebworks.com" target="_blank">Drew Pereli</a></strong>
        </v-flex>
        <v-flex text-xs-right xs12 md6>
          <strong><a href="https://github.com/PereliWebWorks/starbucks_tip_helper" target="_blank">Source Code</a></strong>
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
				donateModalOpen: false
			};
		},
		computed: {
			message: function(){
				return this.$store.state.message;
			},
			employees: function(){
				return this.$store.state.employees;
			}
		},
		methods: {
			async logout(){
				try {
					await axios.post('/logout');
					localStorage.setItem('loggedIn', 'false');
					this.$store.commit('deleteAllEmployees');
					this.$router.push('/login');
				}
				catch (error){
					console.log(error);
					this.$store.commit('setMessage', {type: 'error', text: 'Something went wrong...'});
				}
			},
			loggedIn(){
				return localStorage.getItem('loggedIn') === 'true';
			},
			hideMessage(){this.$store.commit('hideMessage');}
		}
	}
</script>
