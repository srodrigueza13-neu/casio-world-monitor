module.exports = async function (req, res) {
try {
const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current=temperature_2m");
const data = await r.json();

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
