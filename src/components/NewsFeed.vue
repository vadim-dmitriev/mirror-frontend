<template>

<div ref="wrapper" class="wrapper">
  <div v-for="(item, index) in news" :key="index">
    <div class="news-item">
      <img
        class="news-item-icon"
        v-bind:src="getSourceIcon(item.Source.ID)"
      />
      <div class="news-item-created">
        {{ getCreatedTime(item.Created) }}
      </div>
      <div class="news-item-title">{{ item.Title }}</div>
    </div>
    <hr v-show="index < news.length - 1" size="0" color="#bbb" noshade />
  </div>
</div>

</template>

<script>

import { EventBus } from "@/App.vue";
import { MirrorLayoutAPIClient } from "../clients/mirror-layout-api"

const componentName = "NewsFeed";

export default {
  name: componentName,
  data: function () {
    return {
      mirrorLayoutAPIClient: null,
      news: [],
    };
  },
  mounted: async function () {
    this.mirrorLayoutAPIClient = MirrorLayoutAPIClient;

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

    await this.updateNews();

    setInterval(this.updateNews, 1 * 60 * 1000);
  },
  methods: {
    updateNews: async function () {
      let rss = await this.mirrorLayoutAPIClient.getRSS();

      this.setNews(rss)
    },
    setNews: function (news) {
      this.news = new Array(news.length);

      for (let i = 0; i < news.length; i++) {
        this.news[i] = {
          Title: news[i].title,
          Description: news[i].description,
          Created: new Date(news[i].created),
          Source: {
            ID: news[i].source.id,
            Name: news[i].source.name,
          },
        };
      }

      this.news.sort(function (a, b) {
        return b - a;
      });
    },
    getSourceIcon: function (source_id) {
      return require("@/assets/icons/news_sources/" + source_id + ".png");
    },
    getCreatedTime: function (created) {
      let options = {
        hour: "2-digit",
        minute: "2-digit",
      };
      return created.toLocaleTimeString("ru-RU", options);
    },
  },
  computed: {},
};
</script>

<style scoped>

.wrapper {
  margin: 20px;
  width: 800px;
  font-size: 20px;
}

.news-item {
  display: flex;
  align-items: center;

  margin: 10px;
}

.news-item-icon {
  width: 25px;
  height: 25px;
}

.news-item-title {
}

.news-item-created {
  margin: 10px;
}

</style>