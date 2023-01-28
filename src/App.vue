<template>
  <div id="app">
    <AnalogClock />
    <Weather />
    <VoiceAssistant />
  </div>
</template>

<script>
import Vue from "vue";

import AnalogClock from "./components/AnalogClock.vue";
import Weather from "./components/Weather.vue";
import VoiceAssistant from "./components/VoiceAssistant.vue";

export const EventBus = new Vue();

export default {
  name: "App",
  components: {
    AnalogClock,
    Weather,
    VoiceAssistant,
  },
  data: function () {
    return {
      wsConnection: null,
    };
  },
  created: function () {
    this.wsConnection = new WebSocket("ws://localhost:8081/ws");

    this.wsConnection.onopen = function () {
      console.log("Successfully connected to WS Server");
    };

    this.wsConnection.onmessage = function (event) {
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

#app {
}
</style>
