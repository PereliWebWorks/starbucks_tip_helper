<template>
	<v-layout wrap>
		<v-flex xs12 md12>
			<h1>Tips</h1>
		</v-flex>
		<template v-if="employeeInfo">	
			<!-- hours -->
			<v-flex md8 xs12>
				<v-expansion-panel>
					<v-expansion-panel-content>
						<template v-slot:header><v-subheader>Employee Hours</v-subheader></template>
							<v-card>
								<v-card-text>	
									<v-form>
										<v-text-field
											v-for="employee in employeeInfo"
											v-model.number="employee.hours"
											:label="employee.first_name + ' ' + employee.last_name"
											:key="employee.id"
											type="number"
										/>
									</v-form>
								</v-card-text>
							</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-flex>
			<!-- Tip info -->
			<v-flex md4 xs12>
				<v-card>
					<v-card-text>
						<div>	
							<v-text-field
								type="number"
								v-model="totalTips"
								label="Total Tips"
								prefix="$"
							/>
						</div>
						<div>Total Hours: {{totalHours}}</div>
						<div>$/hr: {{rate | toFixed(4)}}</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Results -->
			<v-flex xs12>
				<v-expansion-panel>
					<v-expansion-panel-content>
						<template v-slot:header>
							<v-subheader>Results</v-subheader>
						</template>
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
								</v-data-table>
							</v-card-text>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-flex>
		</template>
		<template v-else>
			<v-subheader>Downloading employee info...</v-subheader>
		</template>
	</v-layout>
</template>

<script>
	export default {
		props: ['employees'],
		data: function(){
			return {
				employeeInfo: [],
				totalTips: null,
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
				}
			}
		},
		computed: {
			employeesWithHours: function(){
				return this.employeeInfo.filter(e => e.hours);
			},
			totalHours: function(){
				return this.employeeInfo.reduce((a,e) => a + e.hours, 0);
			},
			rate: function(){
				if (this.totalHours && this.totalTips){
					let rate = this.totalTips / this.totalHours;
					return rate;
				}
				return null;
			},
			tableData: function(){
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
			}
		},
		watch: {
			employees: function(newEmployees){
				this.employeeInfo = newEmployees.map(e => {
					let newEmployee = {};
					Object.assign(newEmployee, e);
					//See if the employee already has corresponding info in the existing array
					let existingInfo = this.employeeInfo.find(ex => ex.id === e.id);
					if (existingInfo){
						Object.assign(newEmployee, existingInfo);
					}
					else {
						newEmployee.hours = null;
						newEmployee.tips = null;
					}
					return newEmployee;
				});
			}
		},
		filters: {
			toFixed: function(value, digits){
				if (!value) return '';
				return Number(value).toFixed(digits);
			}
		},
		async created(){
			if (!this.employees) {
				this.downloadEmployees();
			}
		},
		inject: ['downloadEmployees']
	}
</script>