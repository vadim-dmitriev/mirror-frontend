class MirrorLayoutAPI{
  constructor(host) {
    this.host = host;
    this.getRSSPath = "/v1/get_rss";
  }

  async getRSS() {
    let bytes = await fetch(`http://${this.host}${this.getRSSPath}`, {
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
        created: new Date(rawNews[i].created),
        source: {
          id: rawNews[i].source.id,
          name: rawNews[i].source.name,
        },
      };
    }

    return news;
  }

}

export const MirrorLayoutAPIHost = process.env.VUE_APP_MIRROR_LAYOUT_API_HOST || "localhost:8081";

export const MirrorLayoutAPIClient = new MirrorLayoutAPI(MirrorLayoutAPIHost);
