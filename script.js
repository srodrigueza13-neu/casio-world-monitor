function pad(n){
return String(n).padStart(2,"0");
}

function updateClock(){
const d = new Date();

document.getElementById("h").innerText = pad(d.getHours());
document.getElementById("m").innerText = pad(d.getMinutes());
document.getElementById("date").innerText = d.toDateString();
}

async function loadWeather(){
try{
const res = await fetch("/api/weather");
const data = await res.json();

```
document.getElementById("temp").innerText = data.temp;
document.getElementById("cond").innerText = data.cond;
```

}catch(e){
document.getElementById("cond").innerText = "ERROR WEATHER";
}
}

async function loadNews(){
try{
const res = await fetch("/api/news");
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
setInterval(updateClock,1000);

loadWeather();
loadNews();
