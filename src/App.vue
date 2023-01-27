<template>
	<div id="app">
		<AnalogClock />
		<Weather />
	</div>
</template>

<script>
import AnalogClock from './components/AnalogClock.vue';
import Weather from './components/Weather.vue';

export default {
	name: 'App',
	components: {
		AnalogClock,
		Weather,
	}
}
</script>

<style>
@font-face {
	font-family: "Roboto";
	src: url("~@/assets/fonts/Roboto-Thin.ttf");
}

html {
	background-color: #000;
	color: #eee;
	font-family: 'Roboto', sans-serif;
}

#app {}
</style>
