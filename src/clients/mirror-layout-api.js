class MirrorLayoutAPI{
  #host

  #getRSSPath = "/v1/get_rss"
  #getCurrentWeatherPath = "/v1/get_current_weather"
  #getWeatherForecastPath = "/v1/get_weather_forecast"
  #getAllEventsPath = "/v1/get_all_events"
  #getInitialConfigPath = "/v1/get_initial_config"

  addMobileClientPath = "/v1/add_mobile_client"

  constructor(host) {
    this.#host = host;
  }

  async getRSS() {
    let bytes = await fetch(`http://${this.#host}${this.#getRSSPath}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })

    let response = await bytes.json()
    
    let rawNews = response.news;
    let news = Array(rawNews.length);
    
    for (let i = 0; i < rawNews.length; i++) {
      news[i] = {
        title: rawNews[i].title,
        description: rawNews[i].description,
        created: new Date(rawNews[i].createdAt),
        source: {
          id: rawNews[i].source.id,
          name: rawNews[i].source.name,
        },
      };
    }

    return news;
  }

  async getCurrentWeather() {
    let bytes = await fetch(`http://${this.#host}${this.#getCurrentWeatherPath}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })

    let rawCurrentWeather = await bytes.json()
    
    let currentWeather = {
      temprature: rawCurrentWeather.temprature,
      kind: rawCurrentWeather.kind,
      humidity: rawCurrentWeather.humidity,      
      windSpeed: rawCurrentWeather.windSpeed,
    };

    return currentWeather;
  }

  async getWeatherForecast() {
    let bytes = await fetch(`http://${this.#host}${this.#getWeatherForecastPath}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })

    let response = await bytes.json()

    let rawForecastDays = response.forecastDays;
    let forecastDays = Array(rawForecastDays.length);
    
    for (let i = 0; i < rawForecastDays.length; i++) {
      forecastDays[i] = {
        kind: rawForecastDays[i].kind,
        pop: rawForecastDays[i].pop,
        humidity: rawForecastDays[i].humidity,
        minTemprature: rawForecastDays[i].minTemprature,
        maxTemprature: rawForecastDays[i].maxTemprature,
      };
    }
    
    return forecastDays;
  }

  async getAllEvents() {
    let bytes = await fetch(`http://${this.#host}${this.#getAllEventsPath}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })

    let response = await bytes.json()

    let rawEvents = response.events;
    let events = Array(rawEvents.length);
    
    for (let i = 0; i < rawEvents.length; i++) {
      events[i] = {
        title: rawEvents[i].title,
        start: rawEvents[i].start,
        end: rawEvents[i].end,
      };
    }
    
    return events;
  }

  async getInitialConfig() {
    let response;

    await fetch(`http://${this.#host}${this.#getInitialConfigPath}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })
    .then(bytes => bytes.json())
    .then(rawResponse => {
        console.log("from-client", rawResponse)

        response = {
          hasClients: rawResponse.hasClients,
          backendLocalIP: rawResponse.backendLocalIp
        }

    });

    return response;
  }

}

export const MirrorLayoutAPIHost = process.env.VUE_APP_MIRROR_LAYOUT_API_HOST || "localhost:8081";

export const MirrorLayoutAPIClient = new MirrorLayoutAPI(MirrorLayoutAPIHost);
