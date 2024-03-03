<template>

<div class="app">

  <div v-if="this.config.hasClients" class="common-widget">
    <NewsFeed class="widget" />
    <AnalogClock class="widget" />
    <Calendar class="widget" />
    <Weather class="widget" />

    <VoiceAssistant class="hidden-widget" />
  </div>

  <div v-else class="initial-start-up">
    <InitialStartUp class="widget" v-bind:backendLocalIP="this.config.backendLocalIP" />
  </div>

</div>

</template>

<script>

import Vue from "vue";

// Components
import AnalogClock from "./components/AnalogClock.vue";
import Weather from "./components/Weather.vue";
import VoiceAssistant from "./components/VoiceAssistant.vue";
import NewsFeed from "./components/NewsFeed.vue";
import Calendar from "./components/Calendar.vue";
import InitialStartUp from "./components/InitialStartUp.vue";

// Tools
import { MirrorLayoutAPIHost, MirrorLayoutAPIClient } from './clients/mirror-layout-api'

// EventBus
export const EventBus = new Vue();

export default {
  name: "App",
  components: {
    AnalogClock,
    Weather,
    VoiceAssistant,
    NewsFeed,
    Calendar,
    InitialStartUp,
  },
  data: function () {
    return {
      wsConnection: null,
      config: null
    };
  },
  beforeMount: async function () {
    this.config = await MirrorLayoutAPIClient.getInitialConfig();

    console.log("config", this.config)

    let initialComponentStates = []

    EventBus.$on("state", (data) => {
      initialComponentStates.push(data);
    });
    
    this.wsConnection = new WebSocket(`ws://${MirrorLayoutAPIHost}/ws`);
      
    this.wsConnection.addEventListener("open", () => {
      console.log("Successfully connected to WS Server");
      
      // Как только установили WS соединение, сразу отправляем 
      // серверу "настройки клиента".
      this.wsConnection.send(JSON.stringify({
        name: "mirror-frontend",
        screen: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        widgets: initialComponentStates,
      }));
    });

    this.wsConnection.addEventListener("close", () => {
      console.log("Successfully disconnected from WS Server");
    })

    this.wsConnection.onmessage = function (event) {
      var message = JSON.parse(event.data)
      
      if (message.type == "moveWidget") {
        EventBus.$emit(`move_${message.data.widgetName}`, message.data)
      }

      if (message.type == "refresh_screen") {
        location.reload()
      }

      if (message.type == "refresh_widget") {
        EventBus.$emit(`refresh_widget_${message.data}`)
      }

      if (event.data == "Keyword") {
        EventBus.$emit("VoiceAssistant", event.data);
      }
    };

  },
};
</script>

<style>

@font-face {
  font-family: "Roboto";
  src: url("~@/assets/fonts/Roboto-Thin.ttf");
}

html {
  background-color: #000;
  color: #eee;
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0px;
}

</style>

<style scoped>

.app {
  width: 100%;
  height: 100vh;
}

.common-widget {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;

  height: 100vh;
}

.widget {
  margin: 10px;
}

.initial-start-up {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  padding: 0px;
  margin: 0px;
}

.visible-bottom-widget {
  position: absolute;
  left: 0;
  bottom: 0;
}

.hidden-widget {
  position: absolute;
  left: 0;
  top: 0;

  display: flex;

  height: 100vh;
  width: 100%;

  justify-content: center;
  align-items: center;
}

</style>
