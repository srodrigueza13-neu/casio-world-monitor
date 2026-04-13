const https = require("https");

function getText(url) {
return new Promise((resolve, reject) => {
https
.get(
url,
{
headers: {
"User-Agent": "World-Monitor/1.0"
}
},
(res) => {
let data = "";

```
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(data);
      });
    }
  )
  .on("error", (err) => {
    reject(err);
  });
```

});
}

module.exports = async function (req, res) {
try {
const xml = await getText("https://feeds.bbci.co.uk/news/world/rss.xml");

```
const items = [...xml.matchAll(/<title>(.*?)<\/title>/g)]
  .slice(2, 12)
  .map(function (x) {
    return { title: x[1] };
  });

res.status(200).json({ items: items });
```

} catch (e) {
res.status(500).json({
items: [{ title: "ERROR NEWS" }]
});
}
};
