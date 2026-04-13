export default async function handler(req, res) {
try {
const url = "https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current=temperature_2m";
const r = await fetch(url);
const data = await r.json();

```
const temp = Math.round(data.current.temperature_2m) + "°C";

res.status(200).json({
  temp: temp,
  cond: "LIVE"
});
```

} catch (e) {
res.status(500).json({
temp: "--°C",
cond: "ERROR WEATHER"
});
}
}
