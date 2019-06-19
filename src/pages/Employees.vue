<template>
	<v-layout wrap>
		<v-flex xs12 md6>
			<new-employee-form />
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
						<v-progress-linear indeterminate />
					</template>
				</v-list>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from 'axios';
	import NewEmployeeForm from 'Components/NewEmployeeForm.vue';
	export default {
		computed: {
			employees: function(){
				return this.$store.state.employees;
			}
		},
		methods: {
			async attemptDeleteEmployee(id){
				try {
					this.$store.commit('setProgressMessage');
					await axios.delete(`/employees/${id}`);
					this.$store.commit('deleteEmployee', id);
				 	this.$store.commit('setMessage', {text: 'Employee deleted', type: 'success'});
				}
				catch(err){
					console.log(err);
				}
			}
		},
		beforeRouteEnter (to, from, next) {
		  next(() => {
		  	document.getElementById('first-name-field').focus();
		  });
		},
		components: {NewEmployeeForm}
	}
</script>