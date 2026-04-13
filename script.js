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
const CONTRACTS_URL = "https://script.google.com/macros/s/AKfycbx28ipebSpJ_ecrv7JpP60i9wzKj8FFJAPsDcUdgIUY3LoGttQl_93w-_EJzMlavlUy/exec";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDatePretty(dateStr) {
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const [day, month, year] = dateStr.split("-").map(Number);
  return `${pad(day)} ${months[month - 1]} ${year}`;
}

function getDaysUntil(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(year, month - 1, day);
  const diffMs = target - today;
  return Math.floor(diffMs / 86400000);
}

async function loadContractsReminder() {
  try {
    const res = await fetch(CONTRACTS_URL, { cache: "no-store" });
    const data = await res.json();

    if (!data.ok || !data.next) {
      document.getElementById("contractDate").innerText = "-- --- ----";
      document.getElementById("contractName").innerText = "SIN VENCIMIENTOS";
      document.getElementById("contractType").innerText = "--";
      return;
    }

    const item = data.next;
    const days = getDaysUntil(item.fecha);

    document.getElementById("contractDate").innerText = formatDatePretty(item.fecha);
    document.getElementById("contractName").innerText = item.trabajador.toUpperCase();

    let meta = item.tipo.toUpperCase();
    if (days === 0) {
      meta += " · HOY";
    } else if (days === 1) {
      meta += " · EN 1 DÍA";
    } else if (days > 1) {
      meta += ` · EN ${days} DÍAS`;
    }

    document.getElementById("contractType").innerText = meta;

  } catch (e) {
    document.getElementById("contractDate").innerText = "-- --- ----";
    document.getElementById("contractName").innerText = "ERROR";
    document.getElementById("contractType").innerText = "--";
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
loadContractsReminder();

setInterval(updateClock, 1000);
setInterval(updateWorldClocks, 1000);
setInterval(loadContractsReminder, 60000);

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
