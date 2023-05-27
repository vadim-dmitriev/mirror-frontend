<template>
  <div class="weather">
    <div class="weather-main">
      <div class="weather-temprature">
        {{ tempratureViewed(currentTemprature) }}
      </div>
      <div class="weather-icon">
        <img v-bind:src="currentWeatherKindIcon" class="icon" />
      </div>
    </div>

    <div class="weather-bottom">
      <div>Ветер {{ currentWindSpeedViewed }}м/с</div>
      <div>Влажность {{ currentHumidityViewed }}%</div>
    </div>

    <hr size="0" color="#bbb" noshade />
    <br />

    <div class="weather-forecast">
      <div class="weather-forecast-day" v-for="item in forecast" :key="item">
        <div class="weather-forecast-day-name">
          {{ item.dayOfWeek }}
        </div>
        <div class="weather-forecast-day-main">
          <div>
            <img
              class="weather-forecast-day-icon"
              v-bind:src="weatherForecastIcon(item.kind)"
            />
          </div>
          <div>
            {{ tempratureViewed(item.minTemp) }}...{{
              tempratureViewed(item.maxTemp)
            }}
          </div>
        </div>
        <div class="weather-forecast-day-precipitation">
          <div>
            <img
              style="height: 20px; opacity: 0.6"
              src="../assets/icons/weather/precipitation.png"
            />
          </div>
          <div>{{ item.pop.toFixed(0) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Weather",
  data() {
    return {
      currentTemprature: 0,
      currentWindSpeed: 0,
      currentHumidity: 0,
      currentWeatherKind: "clear",
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
    await this.updateWeatherData();
    // Запускаем обновление данных о погоде с интервалом в минуту
    setInterval(this.updateWeatherData, 1 * 60 * 1000);
  },
  methods: {
    updateWeatherData: async function () {
      let response = await fetch("http://localhost:8081/weather");

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
        this.currentWeatherKind +
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
.weather {
  position: absolute;
  bottom: 0;
  left: 600px;
  width: 500px;

  display: table;
}

.weather > div {
  display: table-row;
  width: 500px;
}

.weather > hr {
  width: 200%;
}

.weather-main > div {
  display: table-cell;
  height: 150px;
  width: 150px;
}

.weather-temprature {
  font-size: 5vw;
  text-align: center;
  vertical-align: middle;
}

.weather-icon {
  vertical-align: middle;
}

img.icon {
  display: block;
  margin: auto;
  width: 50%;
}

.weather-bottom > div {
  display: table-cell;
  text-align: center;
  margin: 0 50px 0 50px;
}

.weather-forecast-day {
  width: 200%;

  display: flex;

  font-size: 2.5vh;
}

.weather-forecast-day-name {
}

.weather-forecast-day-main {
  display: flex;
  width: 100px;
  margin: auto;
}

.weather-forecast-day-main > div {
  margin: auto;
}

.weather-forecast-day-icon {
  opacity: 0.6;
  margin: auto;
  height: 20px;
}

.weather-forecast-day-precipitation {
  display: flex;
}
</style>