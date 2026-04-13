function pad(n){
return String(n).padStart(2,"0");
}

function updateClock(){
let d=new Date();
document.getElementById("h").innerText=pad(d.getHours());
document.getElementById("m").innerText=pad(d.getMinutes());
document.getElementById("date").innerText=d.toDateString();
}

setInterval(updateClock,1000);
updateClock();

async function loadWeather(){
try{
let res=await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.58&longitude=-70.99&current=temperature_2m");
let data=await res.json();

document.getElementById("temp").innerText=Math.round(data.current.temperature_2m)+"°C";
document.getElementById("cond").innerText="LIVE";

}catch(e){
document.getElementById("cond").innerText="ERROR WEATHER";
}
}

async function loadNews(){
try{

let url="https://api.rss2json.com/v1/api.json?rss_url="+encodeURIComponent("https://feeds.bbci.co.uk/news/world/rss.xml");

let res=await fetch(url);
let data=await res.json();

let matches=data.items
.slice(0,8)
.map(x=>"▸ "+x.title);

document.getElementById("ticker").innerText=matches.join("   ");

}catch(e){
document.getElementById("ticker").innerText="ERROR NEWS";
}
}
