<template>
	<div class="clock">
		<div class="dot"></div> <!-- clock dot, esthetic only -->
		<div class="sec animate"></div> <!-- clock second -->
		<div class="min animate"></div> <!-- clock minute -->
		<div class="hour animate"></div> <!-- clock hour -->
	</div>
</template>

<script>
export default {
	name: "AnalogClock",
	data: function () {
		return {
			currentTime: null,
			hourHand: null,
			minuteHand: null,
			secondHand: null,
		}
	},
	mounted: function () {
		// Инициализируем атрибуты компонента
		this.currentTime = new Date();
		this.hourHand = document.querySelector(".clock").querySelector(".hour");
		this.minuteHand = document.querySelector(".clock").querySelector(".min");
		this.secondHand = document.querySelector(".clock").querySelector(".sec");


		// Запускаем ре-рендер с интервалом в секунду
		setInterval(this.runClock, 1000);
	},
	methods: {
		runClock: function () {
			// Берем текущее время
			this.currentTime = new Date();

			// Getting hour handle degree based on decimal hour value calculated 
			// from current hour and curent minutes
			var hoursDegree = (this.currentTime.getHours() + this.currentTime.getMinutes() / 60) * 30; // 360/12

			//Getting minute handle degree  
			var minutesDegree = this.currentTime.getMinutes() * 6; // 360/60
			//Getting second handle degree  
			var secondsDegree = this.currentTime.getSeconds() * 6; // 360/60

			// Addint rotate attributes to handles
			this.hourHand.style.transform = "rotate(" + hoursDegree + "deg)";
			this.minuteHand.style.transform = "rotate(" + minutesDegree + "deg)";
			this.secondHand.style.transform = "rotate(" + secondsDegree + "deg)";
		},
	}
};
</script>

<style scoped>
.dot {
	background-color: #eee;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.hour,
.min,
.sec {
	position: absolute;
	background-color: #eee;
	transform-origin: 50% 100%;
	border-radius: 2px;
}

.hour {
	width: 5px;
	height: 35%;
	top: 15%;
}

.min {
	width: 3px;
	height: 40%;
	top: 10%;
}

.sec {
	width: 1px;
	height: 45%;
	top: 5%;
}

.animate {
	transition: all 0.1s ease-in-out;
}

.clock {
	position: absolute;
	top: 50px;
	left: 50px;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	border: 2px solid #eee;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>