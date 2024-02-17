<template>

<div ref="wrapper" class="wrapper">
  <div class="content" v-if="this.qrCode != null">
    <h1>Устройство еще не настроено</h1>
    <h2>Воспользуйтесь мобильным приложением Mirror чтобы отсканировать QR код</h2>
  </div>

  <img v-bind:src="this.qrCode" />
</div>

</template>

<script>

const QRCode = require('qrcode');

import { MirrorLayoutAPIClient } from '../clients/mirror-layout-api'

const componentName = "InitialStartUp";

export default {
  name: componentName,
  props: {
    backendLocalIP:String,
  },
  data: () => ({
    qrCode: null
  }),
  async mounted() {
    console.log("backendLocalIP", this.backendLocalIP);
    let message = {
      url: `http://${this.backendLocalIP}${MirrorLayoutAPIClient.addMobileClientPath}`,
    }

    this.qrCode = await this.generateQRCode(JSON.stringify(message))
  },
  methods: {
    async generateQRCode(content) {
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        scale: 7,
        color: {
          dark:"#eee",
          light:"#000"
        }
      }
      return await QRCode.toDataURL(content, opts);
    },
  }
};

</script>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 0;
}

.content {
  text-align: center;
  max-width: 30em;
}

</style>
