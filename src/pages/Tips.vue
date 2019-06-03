<template>
	<v-layout>
		<h1>Tips page</h1>
	</v-layout>
</template>

<script>
	export default {
		props: ['employees'],
		created(){
			if (!this.employees) this.downloadEmployees();
		},
		inject: ['downloadEmployees']
	}
</script>