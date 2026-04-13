function pad(n){
return String(n).padStart(2,"0");
}

function updateClock(){
const d = new Date();

document.getElementById("h").innerText = pad(d.getHours());
document.getElementById("m").innerText = pad(d.getMinutes());
document.getElementById("date").innerText = d.toDateString();
}

function updateWorldClocks(){
const now = new Date();

const tokyo = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
const madrid = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));

document.getElementById("tokyo").innerText =
"TOKYO " + pad(tokyo.getHours()) + ":" + pad(tokyo.getMinutes());

document.getElementById("madrid").innerText =
"MADRID " + pad(madrid.getHours()) + ":" + pad(madrid.getMinutes());
}

async function loadWeather(){
try{
const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current_weather=true");
const data = await res.json();

document.getElementById("temp").innerText = Math.round(data.current_weather.temperature) + "°C";
document.getElementById("cond").innerText = "LIVE WEATHER";
document.getElementById("range").innerText = "SAN FERNANDO, CL";

}catch(e){
document.getElementById("temp").innerText = "--°C";
document.getElementById("cond").innerText = "ERROR WEATHER";
document.getElementById("range").innerText = "NO WEATHER DATA";
}
}

async function loadNews(){
try{
const url = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://feeds.bbci.co.uk/news/world/rss.xml");
const res = await fetch(url);
const data = await res.json();

if (!data.items || !data.items.length) {
  throw new Error("No news items");
}

const keywords = ["war", "attack", "explosion", "crash", "earthquake"];
let breaking = null;

data.items.forEach(function(item){
  const title = item.title.toLowerCase();
  if (keywords.some(function(k){ return title.includes(k); })) {
    if (!breaking) {
      breaking = item.title;
    }
  }
});

if (breaking) {
  const b = document.getElementById("breaking");
  b.style.display = "block";
  b.innerText = "🚨 BREAKING: " + breaking;
}

let newsList = data.items.slice(0, 8);
let index = 0;

function showNextNews() {
  document.getElementById("ticker").innerText =
    "▸ " + newsList[index].title;

  index++;
  if (index >= newsList.length) index = 0;
}

showNextNews();
setInterval(showNextNews, 5000);

}catch(e){
document.getElementById("ticker").innerText = "ERROR NEWS";
}
}


updateClock();
updateWorldClocks();
loadWeather();
loadNews();

setInterval(updateClock, 1000);
setInterval(updateWorldClocks, 1000);

function updateNextEvent(){
const now = new Date();
const current = now.getHours() * 60 + now.getMinutes();

let next = null;

for (let i = 0; i < events.length; i++) {
const e = events[i];
const parts = e.time.trim().split(":");

const hour = Number(parts[0]);
const minute = Number(parts[1]);
const total = hour * 60 + minute;

if (total >= current) {
  next = e;
  break;
}

}

if (next) {
document.getElementById("nextEvent").innerText =
next.time + " — " + next.text;
} else {
document.getElementById("nextEvent").innerText =
"MAÑANA " + events[0].time + " — " + events[0].text;
}
}
