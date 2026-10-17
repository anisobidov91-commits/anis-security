(function(){
var $=function(i){return document.getElementById(i)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function show(box,lvl,title,items){box.textContent="";var v=el("div","v "+lvl);v.appendChild(el("h3","",title));
if(items&&items.length){var u=el("ul");items.forEach(function(s){u.appendChild(el("li","",s))});v.appendChild(u)}box.appendChild(v);return v}

Array.prototype.forEach.call(document.querySelectorAll("nav button"),function(b){b.onclick=function(){
Array.prototype.forEach.call(document.querySelectorAll("nav button"),function(x){x.setAttribute("aria-selected",x===b)});
["file","link","pass","about"].forEach(function(t){$("p-"+t).hidden=(t!==b.dataset.t)});window.scrollTo(0,0)}});

/* Fayl */
var BADEXT=["apk","exe","scr","bat","cmd","com","msi","js","vbs","jar","ps1","lnk","dmg","iso"];
var DOCEXT=["pdf","doc","docx","xls","xlsx","jpg","jpeg","png","txt","mp3","mp4"];
$("fgo").onclick=async function(){
var out=$("fout"),f=$("f").files[0];
if(!f){show(out,"warn","Avval faylro intikhob kuned.");return}
if(f.size>200*1024*1024){show(out,"warn","Fayl az 200 MB kalon ast.",["Baroi in barnoma faylhoi kuchaktar mos ast."]);return}
show(out,"warn","Hisob meshavad...");
try{
var buf=await f.arrayBuffer(),d=await crypto.subtle.digest("SHA-256",buf);
var hex=Array.from(new Uint8Array(d)).map(function(b){return b.toString(16).padStart(2,"0")}).join("");
var notes=[],lvl="ok",title="Alomati khatari ravshan peyda nashud",
parts=f.name.toLowerCase().split("."),ext=parts.length>1?parts[parts.length-1]:"";
if(BADEXT.indexOf(ext)>-1){lvl="warn";title="Ehtiyot kuned";notes.push("Navi fayl (."+ext+") metavonad kor kunad. Faqat az manbai bovarbakhsh nasb kuned.")}
if(ext==="apk")notes.push("APK-ro faqat az Google Play ya sayti rasmi nasb kuned.");
if(parts.length>2&&BADEXT.indexOf(ext)>-1&&DOCEXT.indexOf(parts[parts.length-2])>-1){lvl="bad";title="Khatarnok: pasvandi dugona";notes.push("Nom monandi hujjat ast, vale fayli ijroi ast.")}
var exp=$("eh").value.trim().toLowerCase().replace(/[\s:]/g,"");
if(exp){if(exp.length!==64){notes.push("Hashi voridshuda 64 belgi nest.");if(lvl==="ok"){lvl="warn";title="Hash namuvofiq ast"}}
else if(exp===hex){notes.push("Hash bo hashi voridshuda mos meoyad: fayl dagarguna nashudaast.")}
else{lvl="bad";title="Hash mos nameoyad";notes.push("Fayl bo nusxai asli yakson nest. Nasb nakuned.")}}
var v=show(out,lvl,title,notes);
v.appendChild(el("p","note",f.name+" · "+Math.round(f.size/1024)+" KB"));
v.appendChild(el("div","hash",hex));
v.appendChild(el("p","note","In skani virus nest. Mos omadani hash faqat nishon medihad, ki fayl dagarguna nashudaast."));
}catch(e){show(out,"bad","Xato hangomi hisob.",["Faylro dobora intikhob kuned."])}};

/* Havola */
var SHORT=["bit.ly","tinyurl.com","t.co","goo.gl","is.gd","cutt.ly","rb.gy","ow.ly"],
BADTLD=["zip","mov","top","xyz","click","gq","tk","ml","cf","icu"],
BRANDS=["paypal","google","apple","microsoft","facebook","instagram","whatsapp","telegram","binance","amazon"];
$("ugo").onclick=function(){
var out=$("uout"),raw=$("u").value.trim(),url;
if(!raw){show(out,"warn","Havolaro dar inja guzored.");return}
try{url=new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw)?raw:"https://"+raw)}catch(e){show(out,"warn","Havola durust nest.",["Shakli havolaro tekshir kuned."]);return}
var h=url.hostname.toLowerCase(),n=[],s=0;
function add(w,t){s+=w;n.push(t)}
if(url.protocol!=="https:")add(1,"Havola bo "+url.protocol.replace(":","")+" (na https): ma’lumot himoya nashudaast.");
if(/^\d{1,3}(\.\d{1,3}){3}$/.test(h)||h.indexOf(":")>-1)add(2,"Ba joi nomi sayt, raqami IP istifoda shudaast.");
if(url.username||raw.indexOf("@")>-1)add(2,"Belgii @ dar havola: sayti vokei metavonad pinhon bosh.");
if(h.indexOf("xn--")>-1)add(2,"Nomi sayt bo kodi punycode (xn--): harfhoi monandi lotin metavonand fireb bosh.");
if(h.split(".").length>4)add(1,"Zerdomenhoi besyor: nomi asli dar okhir meoyad.");
if(SHORT.indexOf(h)>-1)add(1,"Havolai kutohshuda: manzili vokei pinhon ast.");
var tld=h.split(".").pop();if(BADTLD.indexOf(tld)>-1)add(1,"Pasvandi (."+tld+") dar saythoi fireb besyor meoyad.");
BRANDS.forEach(function(b){if(h.indexOf(b)>-1&&!(h===b+".com"||h.endsWith("."+b+".com")))add(2,"Nomi “"+b+"” dar domeni begona meoyad.")});
if((h.match(/-/g)||[]).length>3)add(1,"Dar nomi sayt khatchaho besyor ast.");
if(raw.length>120)add(1,"Havola nihoyat daroz ast.");
var lvl=s>=3?"bad":s>=1?"warn":"ok",t=s>=3?"Khatarnok: bovar nakuned":s>=1?"Ehtiyot kuned":"Alomati khatari ravshan peyda nashud";
var v=show(out,lvl,t,n);v.appendChild(el("p","note","Domen: "+h+". Natija kafolat nest: ba saythoi ranjishavar ham ehtiyot kuned."))};

/* Parol */
var COMMON=["password","123456","12345678","123456789","qwerty","qwerty123","111111","abc123","iloveyou","admin","welcome","letmein","parol","parol123","000000","1q2w3e4r","dragon","monkey","football","12345"];
var pw=$("pw");
pw.oninput=function(){var p=pw.value,out=$("pout"),m=$("mt");
if(!p){out.textContent="";m.style.width="0";return}
var pool=0,n=[];if(/[a-z]/.test(p))pool+=26;if(/[A-Z]/.test(p))pool+=26;if(/\d/.test(p))pool+=10;if(/[^A-Za-z0-9]/.test(p))pool+=33;
var bits=p.length*Math.log2(pool||1),low=p.toLowerCase();
if(p.length<12)n.push("Kutoh: kamtar az 12 belgi.");
if(COMMON.some(function(c){return low===c||low.replace(/\d+$/,"")===c})){bits=Math.min(bits,8);n.push("Dar royhati parolhoi marufi besyor.")}
if(/(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd|zxc)/.test(low)){bits*=.7;n.push("Qatori peydarpeyi belgiho dorad.")}
if(/(.)\1{2,}/.test(p)){bits*=.75;n.push("Belgiho takror meshavand.")}
if(/^\d+$/.test(p))n.push("Faqat raqam: harf va belgiho ilova kuned.");
else if(pool<62&&p.length<16)n.push("Harfhoi kalon, khurd, raqam va belgiho omekhta kuned.");
var lv,t,pc,col;
if(bits<40){lv="bad";t="Zaif";pc=25;col="var(--bad)"}else if(bits<60){lv="warn";t="Miyona";pc=50;col="var(--warn)"}else if(bits<80){lv="ok";t="Khub";pc=75;col="var(--ok)"}else{lv="ok";t="Bisyor khub";pc=100;col="var(--ok)"}
m.style.width=pc+"%";m.style.background=col;
var v=show(out,lv,t,n);if(lv==="ok")v.appendChild(el("p","note","Parolhoi daroz va judogona baroi har hisob behtarin ast. Menejeri parol istifoda kuned."))};
$("sh").onclick=function(){var t=pw.type==="password";pw.type=t?"text":"password";this.textContent=t?"Pinhon":"Nishon"};
})();

/* PWA: servis-vorker (faqat ba https ya localhost) */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
