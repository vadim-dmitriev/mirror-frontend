<template>
  <div ref="wrapper" class="wrapper">
    <div ref="weather" class="weather">
      <div class="weather-main">
        <div class="container">
          <div class="container-item weather-temprature">
            {{ tempratureViewed(currentTemprature) }}
          </div>
          <div class="container-item weather-cloud-icon">
            <img :src="currentWeatherKindIcon" />
          </div>
        </div>

        <div class="container">
          <div class="container-item weather-wind">Ветер {{ currentWindSpeedViewed }} м/с</div>
          <div class="container-item weather-humidity">Влажность {{ currentHumidityViewed }}%</div>
        </div>
      </div>

      <table class="weather-forecast">
        <tr class="weather-forecast-day" v-for="(item, idx) in forecast" :key="idx">
          <td class="weather-forecast-day-name">
            <div>{{ item.dayOfWeek }}</div>
          </td>
          <td class="weather-forecast-day-cloud-temprature">
            <img :src="weatherForecastIcon(item.kind)" class="weather-forecast-day-cloud-icon" />
            <div>{{ tempratureViewed(item.minTemp) }}...{{ tempratureViewed(item.maxTemp) }}</div>
          </td>
          <td class="weather-forecast-day-precipitation">
            <img src="../assets/icons/weather/precipitation.png" class="weather-forecast-day-precipitation-icon" />
            <div>{{ item.pop.toFixed(0) }}%</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

import { EventBus, BackendHost } from "@/App.vue";

const componentName = "Weather";
const FONT_SIZE = 30;

export default {
  name: componentName,
  data() {
    return {
      currentTemprature: 0,
      currentWindSpeed: 0,
      currentHumidity: 0,
      currentKind: "clear",
      forecast: [
        {
          minTemp: 1,
          maxTemp: 2,
          pop: 15,
          kind: "clear",
          dayOfWeek: "Ср",
        },
        {
          minTemp: 1,
          maxTemp: 2,
          pop: 15,
          kind: "clear",
          dayOfWeek: "Чт",
        },
        {
          minTemp: 1,
          maxTemp: 2,
          pop: 15,
          kind: "clear",
          dayOfWeek: "Пт",
        },
        {
          minTemp: 1,
          maxTemp: 2,
          pop: 15,
          kind: "clear",
          dayOfWeek: "Сб",
        },
        {
          minTemp: 1,
          maxTemp: 2,
          pop: 15,
          kind: "clear",
          dayOfWeek: "Вс",
        },
      ],
    };
  },
  mounted: async function () {
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

    this.$refs.weather.style.fontSize = `${FONT_SIZE}px`;

    await this.updateWeatherData();
    // Запускаем обновление данных о погоде с интервалом в минуту
    setInterval(this.updateWeatherData, 1 * 60 * 1000);
  },
  methods: {
    updateWeatherData: async function () {
      let response = await fetch(`http://${BackendHost}:8081/weather`);

      if (response.status == 200) {
        let json = await response.json();

        this.setCurrentWeather(json.current);
        this.setWeatherForecast(json.forecast);
      }

      let days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      let currentTime = new Date();

      for (let i = 0; i < this.forecast.length; i++) {
        this.forecast[i].dayOfWeek =
          days[(currentTime.getDay() + i) % days.length];
      }
    },
    setCurrentWeather(currentWeather) {
      this.currentTemprature = currentWeather.temp;
      this.currentHumidity = currentWeather.humidity;
      this.currentWindSpeed = currentWeather.wind_speed;
      this.currentKind = currentWeather.kind;
    },
    setWeatherForecast(weatherForecast) {
      let forecastList = weatherForecast.list;

      for (let i = 0; i < forecastList.length; i++) {
        this.forecast[i].minTemp = Number(forecastList[i].temp_min).toFixed(0);
        this.forecast[i].maxTemp = Number(forecastList[i].temp_max).toFixed(0);
        this.forecast[i].pop = forecastList[i].pop * 100;
        this.forecast[i].kind = forecastList[i].kind;
        this.forecast[i].humidity = forecastList[i].humidity;
      }
    },
    weatherForecastIcon(forecastKind) {
      return require("@/assets/icons/weather/" + forecastKind + ".png");
    },
    tempratureViewed(temprature) {
      let roundedTemprature = Math.round(temprature);

      if (roundedTemprature >= 0) {
        return "+" + roundedTemprature + "°";
      }

      return roundedTemprature + "°";
    },
    round(intValue) {
      return Math.round(intValue).toFixed(1);
    },
  },
  computed: {
    currentWeatherKindIcon: function () {
      // Иконки взяты с https://www.iconfinder.com/iconsets/weather-line-5
      return require("@/assets/icons/weather/" +
        this.currentKind +
        ".png");
    },
    currentWindSpeedViewed: function () {
      return Math.round(this.currentWindSpeed, 2);
    },
    currentHumidityViewed: function () {
      return Math.round(this.currentHumidity, 2);
    },
  },
};
</script>

<style scoped>
.wrapper {
	margin: 20px;
}
.weather {
  font-size: 20px;
  width: 23em;
}

.weather-main {
  padding-bottom: 0.5em;
  border-bottom: 1px solid #eee;
  margin-bottom: 1em;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container:first-child {
  margin-bottom: 0.5em;
}

.container-item {
  flex-basis: 100px;
  flex-grow: 1;
  text-align: center;
}

.weather-temprature {
  font-size: 2.5em;
}

.weather-cloud-icon {
  height: 5.5em;
}

.weather-cloud-icon img {
  height: 100%;
}

.weather-wind {
  font-size: 0.8em;
}

.weather-humidity {
  font-size: 0.8em;
}

.weather-forecast {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

.weather-forecast-day {
  display: flex;
}

.weather-forecast td {
  box-sizing: border-box;
  width: calc(100% / 3);
  display: flex;
  align-items: center;
  height: 1.5em;
  font-size: 0.9em; 
}

.weather-forecast-day-cloud-temprature {
  justify-content: center;
}

.weather-forecast-day-cloud-temprature img {
  height: 70%;
  margin-right: 0.4em;
  opacity: 0.6;
}

.weather-forecast-day-precipitation {
  justify-content: flex-end;
}

.weather-forecast-day-precipitation img {
  height: 80%;
  opacity: 0.6;
}

</style>