<template>
  <div class="clock">
    <div class="dot"></div>
    <!-- clock dot -->
    <div class="sec animate"></div>
    <!-- clock second -->
    <div class="min animate"></div>
    <!-- clock minute -->
    <div class="hour animate"></div>
    <!-- clock hour -->
    <div v-for="n in 12" :key="n" class="dashes" />
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

      dashHands: [],

      hourDegree: 0,
      minuteDegree: 0,
      secondDegree: 0,

      isMinuteStarted: false,
      isHourStarted: false,
    };
  },
  mounted: function () {
    // Инициализируем атрибуты компонента
    this.currentTime = new Date();

    this.hourHand = document.querySelector(".clock").querySelector(".hour");
    this.minuteHand = document.querySelector(".clock").querySelector(".min");
    this.secondHand = document.querySelector(".clock").querySelector(".sec");
    this.dashHands = document
      .querySelector(".clock")
      .querySelectorAll(".dashes");
    console.log(this.dashHands);

    this.hourDegree = this.currentTime.getHours() * 15; // 360/24
    this.minuteDegree = this.currentTime.getMinutes() * 6; // 360/60
    this.secondDegree = this.currentTime.getSeconds() * 6; // 360/60
    for (let i = 0; i < 12; i++) {
      this.dashHands[i].style.transform = "rotate(" + i * 30 + "deg)";
    }

    // Устанавливаем изначальное положение.
    this.hourHand.style.transform = "rotate(" + this.hourDegree + "deg)";
    this.minuteHand.style.transform = "rotate(" + this.minuteDegree + "deg)";
    this.secondHand.style.transform = "rotate(" + this.secondDegree + "deg)";

    // Запускаем ре-рендер для секунд, как ре-рендр с самым маленьким интервалом.
    // Он в свою очеред будет запускать ре-рендр для минут. А минуты для часов.
    setInterval(this.second, 1000);
  },
  methods: {
    hour: function () {
      this.hourDegree = this.hourDegree + 30; // 360/12
      this.hourHand.style.transform = "rotate(" + this.hourDegree + "deg)";
    },
    minute: function () {
      this.minuteDegree = this.minuteDegree + 6; // 360/60
      this.minuteHand.style.transform = "rotate(" + this.minuteDegree + "deg)";

      if (!this.isHourStarted && this.minuteDegree % 360 == 0) {
        this.isHourStarted = true;
        this.hour();
        setInterval(this.hour, 60 * 60 * 1000);
      }
    },
    second: function () {
      this.secondDegree = this.secondDegree + 6; // 360/60
      this.secondHand.style.transform = "rotate(" + this.secondDegree + "deg)";

      if (!this.isMinuteStarted && this.secondDegree % 360 == 0) {
        this.isMinuteStarted = true;
        this.minute();
        setInterval(this.minute, 60 * 1000);
      }
    },
  },
};
</script>

<style scoped>
.dot {
  background-color: #eee;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dashes {
  position: absolute;
  width: 1px;
  top: 0%;
  height: 15px;
  background: #eee;
  z-index: 2;
  transform-origin: 10% 250px;
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
  bottom: 0;
  left: 0;
  width: 500px;
  height: 500px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 2px solid #eee;
  border-radius: 50%;
}
</style>