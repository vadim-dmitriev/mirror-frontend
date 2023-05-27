<template>
  <div class="news">
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
export default {
  name: "NewsFeed",
  data: function () {
    return {
      news: [],
    };
  },
  mounted: async function () {
    await this.updateNews();

    setInterval(this.updateNews, 1 * 60 * 1000);
  },
  methods: {
    updateNews: async function () {
      let response = await fetch("http://localhost:8081/news");

      if (response.status == 200) {
        let json = await response.json();

        this.setNews(json.news);
      }
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
      return created.toLocaleTimeString([], options);
    },
  },
  computed: {},
};
</script>

<style scoped>
.news {
  left: 750px;
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