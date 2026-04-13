export default async function handler(req,res){

try{

const r=await fetch("https://feeds.bbci.co.uk/news/world/rss.xml");
const xml=await r.text();

const items=[...xml.matchAll(/<title>(.*?)</title>/g)]
.slice(2,12)
.map(x=>({title:x}));

res.status(200).json({items});

}catch(e){
res.status(500).json({error:"fail"});
}

}
