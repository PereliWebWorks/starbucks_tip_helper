<template>
	<v-layout wrap>
		<v-flex xs12>
			<h1>Tips</h1>
		</v-flex>
		<v-flex xs12>
			<v-stepper v-model="currentStep" v-if="employeeInfo">
				<v-stepper-header>
					<v-stepper-step editable :complete="currentStep > 1" step="1">Add employee hours</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step editable :complete="currentStep > 2" step="2">Add tip totals</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step editable step="3">Get tip data</v-stepper-step>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="1">
						<v-card>
							<v-card-text>	
								<v-form ref="tipsForm" v-if="employees.length > 0">
									<v-text-field
										v-for="employee in employeeInfo"
										v-model="employee.hours"
										:label="employee.first_name + ' ' + employee.last_name"
										:key="employee.id"
										:rules="numberRules"
										clearable
										box
									/>
								</v-form>
								<v-subheader v-else>
									Go to the <v-btn to="/employees">employees page</v-btn> to add employees!
								</v-subheader>
							</v-card-text>
						</v-card>
						<v-btn color="primary" @click="currentStep = 2">Continue</v-btn>
						<v-btn @click="currentStep = 1">Back</v-btn>
					</v-stepper-content>
					<v-stepper-content step="2">
						<v-card>
							<v-card-text>
								<v-container grid-list-xl>
									<v-layout wrap>
										<v-flex xs12 md6>	
											<v-text-field
												v-model="totalTips"
												label="Total Tips"
												prefix="$"
												:rules="numberRules"
												clearable
												box
											/>
										</v-flex>
										<v-flex xs12 md6>
											<v-card dark elevation="10">
												<v-card-text>
													<div class="subheader">Total Hours: {{formHasError ? 'Form error' : totalHours}}</div>
													<div class="subheader">Tip Rate ($s/hr): {{rate | toFixed(3)}}</div>
												</v-card-text>
											</v-card>
										</v-flex>
									</v-layout>
								</v-container>
							</v-card-text>
						</v-card>
						<v-btn color="primary" @click="currentStep = 3">Continue</v-btn>
						<v-btn @click="currentStep = 1">Back</v-btn>
					</v-stepper-content>
					<v-stepper-content step="3">
						<v-card>
							<v-card-text>
								<v-data-table
									:items="tableData"
									:headers="tableHeaders"
									:pagination.sync="pagination"
								>
									<template v-slot:items="props">
										<td>{{props.item.first_name}}</td>
										<td>{{props.item.last_name}}</td>
										<td>${{props.item.tips | toFixed(2)}}</td>
										<td>${{props.item.tips_rounded | toFixed(2)}}</td>
										<td>${{props.item.tips_rounded_down | toFixed(2)}}</td>
										<td>{{props.item.hours}}</td>
									</template>
									<template v-slot:footer>
										<tr class="font-weight-bold grey lighten-3" id="tips-table-footer">
											<td colspan="2">Totals:</td>
											<td>${{totalTips}}</td>
											<td>${{totalRoundedTips}}</td>
											<td>${{totalRoundedDownTips}}</td>
											<td>{{totalHours}}</td>
										</tr>
									</template>
								</v-data-table>
							</v-card-text>
						</v-card>
						<v-btn @click="currentStep = 2">Back</v-btn>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
			<v-progress-linear v-else indeterminate />
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data: function(){
			return {
				employeeInfo: false,
				numberRules: [v => !isNaN(v) || 'Please enter a valid number'],
				totalTips: null,
				currentStep: 1,
				tableHeaders: [
					{text: 'First Name', value: 'first_name'},
					{text: 'Last Name', value: 'last_name'},
					{text: 'Tips', value: 'tips'},
					{text: 'Tips (rounded)', value: 'tips_rounded'},
					{text: 'Tips (rounded down)', value: 'tips_rounded_down'},
					{text: 'Hours', value: 'hours'}
				],
				pagination: {
					sortBy: 'last_name',
					rowsPerPage: -1
				},
				isMounted: false
			}
		},
		computed: {
			employees: function(){
				return this.$store.state.employees;
			},
			formHasError: function(){
				if (!this.isMounted || !this.$refs.tipsForm) return false;
				return !this.$refs.tipsForm.validate();
			},
			employeesWithHours: function(){
				let employees = [];
				for (var i in this.employeeInfo){
					let e = this.employeeInfo[i];
					if (isNaN(e.hours)) continue;
					if (!e.hours) continue;
					employees.push(e);
				}
				return this.employeeInfo.filter(e => e.hours);
			},
			totalHours: function(){ 
				return this.employeesWithHours.reduce((a,e) => a + Number(e.hours), 0);
			},
			rate: function(){
				if (!isNaN(this.totalHours) && !isNaN(this.totalTips) && this.totalHours !== 0 && !this.formHasError){
					let rate = this.totalTips / this.totalHours;
					return rate;
				}
				return null;
			},
			tableData: function(){
				if (this.formHasError) return;
				const rate = this.rate;
				if (!rate) return [];
				let employees = this.employeesWithHours;
				if (!employees) return [];
				return employees.map(e => {
					const tips = e.hours * rate;
					e.tips = tips;
					e.tips_rounded = Math.round(tips);
					e.tips_rounded_down = Math.floor(tips);
					return e; 
				});
			},
			totalRoundedTips: function(){
				if (!this.tableData) return;
				return this.tableData.reduce((a, e) => a + e.tips_rounded, 0);
			},
			totalRoundedDownTips: function(){
				if (!this.tableData) return;
				return this.tableData.reduce((a, e) => a + e.tips_rounded_down, 0);
			}
		},
		watch: {
			employees: function(newEmployees){
				if (!newEmployees) return;
				let newEmployeeInfo = newEmployees.map(e => {
					let newEmployee = {};
					Object.assign(newEmployee, e);
					//See if the employee already has corresponding info in the existing array
					let existingInfo = false;
					if (this.employeeInfo !== false) {
						existingInfo = this.employeeInfo.find(ex => ex.id === e.id);
					}
					if (existingInfo){
						Object.assign(newEmployee, existingInfo);
					}
					else {
						newEmployee.hours = null;
						newEmployee.tips = null;
					}
					return newEmployee;
				});
				this.employeeInfo = newEmployeeInfo;
			}
		},
		filters: {
			toFixed: function(value, digits){
				if (!value) return '';
				return Number(value).toFixed(digits);
			}
		},
		mounted(){
			this.isMounted = true;
		}
	}
</script>