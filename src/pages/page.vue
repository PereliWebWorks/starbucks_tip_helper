<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title>Tip Helper</v-toolbar-title>
			<v-toolbar-items class="hidden-sm-and-down">	
				<v-btn flat>Log Out</v-btn>
				<v-btn flat>Donate</v-btn>
			</v-toolbar-items>
		</v-toolbar>
		<v-content>
			<v-container fluid>
				<slot name="content"></slot>
			</v-container>
		</v-content>
	</v-app>
</template>
