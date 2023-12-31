<template>
	<div ref="wrapper" class="wrapper">
		<div class="clock">
			<div ref="second" class="hand secondHand"></div>
			<div ref="minute" class="hand minuteHand"></div>
			<div ref="hour" class="hand hourHand"></div>
		</div>
	</div>
</template>

<script>

import { EventBus } from "@/App.vue";

const SCALE = 5;
const componentName = "AnalogClock";

export default {
	name: componentName,
	data: () => ({
		currentTime: null,
		hourHand: null,
		minuteHand: null,
		secondHand: null,
	}),
	mounted() {
		EventBus.$emit(`state`, {
			Name: componentName,
			position: {
				X: Math.floor(this.$refs.wrapper.getBoundingClientRect().left),
				Y: Math.floor(this.$refs.wrapper.getBoundingClientRect().top),
			},
			size: {
				Width: Math.floor(this.$refs.wrapper.getBoundingClientRect().width),
				Height: Math.floor(this.$refs.wrapper.getBoundingClientRect().height),
			},
		});

		EventBus.$on(`move_${componentName}`, (data) => {
			this.$refs.wrapper.style.top = `${data.y}px`;
			this.$refs.wrapper.style.left = `${data.x}px`;
		});

		this.$refs.wrapper.style.width = `${SCALE * 100}px`;
		this.$refs.wrapper.style.height = `${SCALE * 100}px`;

		// Initializing attributes
		this.currentTime = new Date();
		this.hourHand = this.$refs.hour;
		this.minuteHand = this.$refs.minute;
		this.secondHand = this.$refs.second;

		// Getting secondhand degree 
		let secondsDegrees = this.currentTime.getSeconds() * 360 / 60;

		// Getting minutehand degree  
		let minutesDegrees = this.currentTime.getMinutes() * 360 / 60;

		// Getting hourhand degree based on decimal hour value calculated 
		// from current hour and curent minutes
		let hoursDegrees = (this.currentTime.getHours() + this.currentTime.getMinutes() / 60) * 360 / 12;

		this.hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
		this.minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
		this.secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

		this.runClock();
	},
	methods: {
		runClock() {
			this.currentTime = new Date();

			// Getting secondhand degree 
			let secondsDegrees = this.currentTime.getSeconds() * 360 / 60;

			if ( secondsDegrees !== 0) {
				// Adding rotate attributes to secondhand
				this.secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
			} else {
				// Getting hourhand degree based on decimal hour value calculated 
				// from current hour and curent minutes
				let hoursDegrees = (this.currentTime.getHours() + this.currentTime.getMinutes() / 60) * 360 / 12;

				// Getting minutehand degree  
				let minutesDegrees = this.currentTime.getMinutes() * 360 / 60;
				
				// Fixing transform bug
				this.hourHand.classList.add('fixed');
				this.minuteHand.classList.add('fixed');
				this.secondHand.classList.add('fixed');
				
				// Adding rotate attributes to hands
				this.hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
				this.minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
				this.secondHand.style.transform = `rotate(0deg)`;

				// Fixing transform bug
				setTimeout(() => {
					this.hourHand.classList.remove('fixed');
					this.minuteHand.classList.remove('fixed');
					this.secondHand.classList.remove('fixed'); },
				0);
			}
			
			// Rerendering increments per second
			setTimeout(this.runClock, 1000);
		},
	}
};
</script>

<style>
.wrapper {
	margin: 20px;
}

.clock {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 2px solid #eeeeee;
	display: flex;
	justify-content: center;
	align-items: center;

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #eeeeee;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
}

.hand {
	position: absolute;
	background-color: #eeeeee;
	transform-origin: 50% 100%;
	border-radius: 2px;
	transition: all 0.1s ease-in-out;
}

.fixed {
	transition: none;
}

.hourHand {
	width: 5px;
	height: 35%;
	top: 15%;
}

.minuteHand {
	width: 3px;
	height: 40%;
	top: 10%;
}

.secondHand {
	width: 1px;
	height: 45%;
	top: 5%;
}
</style>
