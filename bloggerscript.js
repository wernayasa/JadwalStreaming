  "use strict";
  class BloggerScript {
    constructor(a = {}) {
      this.config = a, this._siteMap = {
        arr: new Array,
        callback: "undefined",
        fc: "function",
        max: 150,
        start: 1,
        url: "url"
      }
    }
    siteMap(b, c = function (a) {
      console.log(a)
    }) {
      let a = this;
      a.xhr("GET", `${b}?alt=json-in-script&start-index=${a._siteMap.start}&max-results=${a._siteMap.max}`, function (d) {
        if ("entry" in d.feed) {
          let e = d.feed.entry;
          Array.prototype.push.apply(a._siteMap.arr, a.getFeed(d)), e.length >= a._siteMap.max ? (a._siteMap.start += a._siteMap.max, a.siteMap(b, c)) : c(a._siteMap.arr)
        } else c(a._siteMap.arr)
      })
    }
    getFeed(a) {
      if (a.feed.entry) {
        let b = new Array;
        return a.feed.entry.forEach(a => {
          let c = {};
          c.title = a.title.$t, c.link = this.getLink(a.link), c.image = this.getImage(a), c.label = this.getLabel(a.category), c.date = this.getTime(a.published.$t), c.published = a.published.$t, c.updated = a.updated.$t, "summary" in a && (c.summary = a.summary.$t), "content" in a && (c.content = a.content.$t), "author" in a && (c.author = this.getAuthor(a)), b.push(c)
        }), b
      }
      return []
    }
    getImage(a) {
      if ("media$thumbnail" in a) return this.resizeImage(a.media$thumbnail.url);
      if (!("content" in a)) return this.config.noImage || ""; {
        let b = a.content.$t,
          d = b.indexOf("<img"),
          c = b.indexOf('src="', d),
          e = b.indexOf('"', c + 5),
          f = b.substr(c + 5, e - c - 5);
        return -1 != d && -1 != c && -1 != e && "" != f ? f : this.config.noImage || ""
      }
    }
    getAuthor(a) {
      var b, c, d, e, f, g;
      return {
        name: (null === (b = a.author[0]) || void 0 === b ? void 0 : null === (c = b.name) || void 0 === c ? void 0 : c.$t) || "",
        link: (null === (d = a.author[0]) || void 0 === d ? void 0 : null === (e = d.uri) || void 0 === e ? void 0 : e.$t) || "",
        image: (null === (f = a.author[0]) || void 0 === f ? void 0 : null === (g = f.gd$image) || void 0 === g ? void 0 : g.src) || ""
      }
    }
    getLink(a) {
      return a.find(a => "alternate" == a.rel).href
    }
    getLabel(a) {
      return a.map(a => a.term)
    }
    getTime(c) {
      if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(c)) {
        var b = c,
          d = b.substring(0, 4),
          e = b.substring(5, 7),
          f = b.substring(8, 10),
          a = new Array;
        return a[1] = "Jan", a[2] = "Feb", a[3] = "Mar", a[4] = "Apr", a[5] = "May", a[6] = "Jun", a[7] = "Jul", a[8] = "Aug", a[9] = "Sep", a[10] = "Oct", a[11] = "Nov", a[12] = "Dec", f + " " + a[parseInt(e, 10)] + " " + d
      }
      return !1
    }
    resizeImage(a) {
      return this.config.sizeImage ? a.match(/\/s[0-9]{2}-(w[0-9]+-)?c/) ? a.replace(/\/s[0-9]{2}-(w[0-9]+-)?c/, `/${this.config.sizeImage}`) : a.replace(/\=s[0-9]{2}-(w[0-9]+-)?c/, `=${this.config.sizeImage}`) : a
    }
    relatedPost(b = function (a) {
      console.log(a)
    }) {
      let a = this,
        c = 0,
        d = new Array,
        e = document.location.pathname;
      "undefined" != a.config.label && "" != a.config.label && 0 != a.config.label.length && a.config.label.forEach(f => {
        a.xhr("GET", `/feeds/posts/default/-/${f.replace(/\&amp;/g,"&").replace(/\//g,"%2F")}?alt=json-in-script&max-results=${a.config.jumlah}`, function (g) {
          if ("entry" in g.feed && a.getFeed(g).forEach(a => {
              !a.link.includes(e) && (d.some(b => b.link == a.link) || d.push(a))
            }), ++c == a.config.label.length) {
            if (0 == d.length) return !1;
            let f = a.shuffle(d);
            return f.length > a.config.jumlah && (f = f.slice(0, a.config.jumlah)), b(f)
          }
        })
      })
    }
    randomPost(b, c = function (a) {
      console.log(a)
    }) {
      let a = this,
        d = a.config.jumlah;
      a.xhr("GET", `${b}?alt=json-in-script&max-results=0`, function (f) {
        let e = f.feed.openSearch$totalResults.$t;
        if (a.config.allRandom) e = e <= 150 ? 1 : a.shuffle2(1, e - 150), d = 150;
        else {
          if (e < a.config.jumlah) return;
          e = a.shuffle2(1, e - a.config.jumlah)
        }
        a.xhr("GET", `${b}?alt=json-in-script&start-index=${e}&max-results=${d}`, function (b) {
          if ("entry" in b.feed) {
            let d = a.getFeed(b);
            return c(d = a.shuffle(d))
          }
        })
      })
    }
    shuffle(a) {
      var c, d, b = a.length;
      if (0 === b) return !1;
      for (; --b;) c = Math.floor(Math.random() * (b + 1)), d = a[b], a[b] = a[c], a[c] = d;
      return a
    }
    shuffle2(a, b) {
      return Math.floor(Math.random() * (b - a)) + a
    }
    xhr(b, c, d) {
      let a = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
      a.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status || 304 == this.status) {
          let a = this.responseText,
            b = JSON.parse(a.substring(a.indexOf("{"), a.lastIndexOf("}") + 1));
          d && d(b)
        }
      }, a.onerror = a => console.log(a), a.open(b, c, !0), a.send()
    }
    inTag(b) {
      let a = document.createElement("script");
      a.src = b, document.body.appendChild(a)
    }
  }