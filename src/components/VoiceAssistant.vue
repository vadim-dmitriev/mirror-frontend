<template>
  <div>
    <img src="@/assets/gif/voice_assistant_2.gif" v-bind:hidden="hidden" />
  </div>
</template>

<script>
import { EventBus } from "@/App.vue";

export default {
  name: "VoiceAssistant",
  data: function () {
    return {
      hidden: true,
    };
  },
  created: function () {
    EventBus.$on("VoiceAssistant", () => {
      this.hidden = !this.hidden;
    });
  },
};
</script>

<style>
img {
  animation-direction: alternate;
  display: block;
  opacity: 1;
  transition: opacity 1s ease-out;
  -moz-transition: opacity 1s ease-out;
  -webkit-transition: opacity 1s ease-out;
  -o-transition: opacity 1s ease-out;
}

img[hidden] {
  animation-direction: alternate;
  opacity: 0;
  transition: opacity 1s ease-out;
  -moz-transition: opacity 1s ease-out;
  -webkit-transition: opacity 1s ease-out;
  -o-transition: opacity 1s ease-out;
}
</style>