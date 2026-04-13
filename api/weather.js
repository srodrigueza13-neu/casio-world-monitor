const https = require("https");

function getJson(url) {
return new Promise((resolve, reject) => {
https
.get(url, (res) => {
let data = "";

```
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  })
  .on("error", (err) => {
    reject(err);
  });
```

});
}

module.exports = async function (req, res) {
try {
const data = await getJson(
"https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current=temperature_2m"
);

```
res.status(200).json({
  temp: Math.round(data.current.temperature_2m) + "°C",
  cond: "LIVE"
});
```

} catch (e) {
res.status(500).json({
temp: "--°C",
cond: "ERROR WEATHER"
});
}
};
