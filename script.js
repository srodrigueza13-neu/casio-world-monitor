function pad(n){
return String(n).padStart(2,"0");
}

function updateClock(){
const d = new Date();

const h = pad(d.getHours());
const m = pad(d.getMinutes());

document.getElementById("h").innerText = h;
document.getElementById("m").innerText = m;
document.getElementById("date").innerText = d.toDateString();
}

async function loadWeather(){
try{
const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current=temperature_2m");
const data = await res.json();

```
document.getElementById("temp").innerText = Math.round(data.current.temperature_2m) + "°C";
document.getElementById("cond").innerText = "LIVE";
```

}catch(e){
document.getElementById("cond").innerText = "ERROR WEATHER";
}
}

async function loadNews(){
try{
const url = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://feeds.bbci.co.uk/news/world/rss.xml");
const res = await fetch(url);
const data = await res.json();

```
const text = data.items
  .slice(0,8)
  .map(function(x){ return "▸ " + x.title; })
  .join("   ");

document.getElementById("ticker").innerText = text;
```

}catch(e){
document.getElementById("ticker").innerText = "ERROR NEWS";
}
}

updateClock();
setInterval(updateClock, 1000);

loadWeather();
loadNews();
