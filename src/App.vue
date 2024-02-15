<template>
  <div id="app">
	<AnalogClock class="visible-bottom-widget" />
	<Weather class="visible-top-widget" />
	<NewsFeed class="visible-top-widget" />

	<VoiceAssistant class="hidden-widget" />
  </div>
</template>

<script>
import Vue from "vue";

// Components
import AnalogClock from "./components/AnalogClock.vue";
import Weather from "./components/Weather.vue";
import VoiceAssistant from "./components/VoiceAssistant.vue";
import NewsFeed from "./components/NewsFeed.vue";

// Tools
import { MirrorLayoutAPIHost } from './clients/mirror-layout-api'

export const EventBus = new Vue();


export default {
	name: "App",
	components: {
		AnalogClock,
		Weather,
		VoiceAssistant,
		NewsFeed,
	},
	data: function () {
		return {
			wsConnection: null,
		};
	},
	created: function () {
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

.visible-bottom-widget {
  position: absolute;
  left: 0;
  bottom: 0;
}

.visible-top-widget {
  position: absolute;
  left: 0;
  top: 0;
}

.hidden-widget {
  position: absolute;
  left: 0;
  top: 0;

  display: flex;

  height: 100vh;
  width: 100vw;

  justify-content: center;
  align-items: center;
}
</style>
