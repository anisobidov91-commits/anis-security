(function(){
var $=function(i){return document.getElementById(i)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function show(box,lvl,title,items){box.textContent="";var v=el("div","v "+lvl);v.appendChild(el("h3","",title));
if(items&&items.length){var u=el("ul");items.forEach(function(s){u.appendChild(el("li","",s))});v.appendChild(u)}box.appendChild(v);return v}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}

var TABS=["file","link","pass","apps","about"];
Array.prototype.forEach.call(document.querySelectorAll("nav button"),function(b){b.onclick=function(){
Array.prototype.forEach.call(document.querySelectorAll("nav button"),function(x){x.setAttribute("aria-selected",x===b)});
TABS.forEach(function(t){$("p-"+t).hidden=(t!==b.dataset.t)});window.scrollTo(0,0)}});

/* Файл */
var BADEXT=["apk","exe","scr","bat","cmd","com","msi","js","vbs","jar","ps1","lnk","dmg","iso"];
var DOCEXT=["pdf","doc","docx","xls","xlsx","jpg","jpeg","png","txt","mp3","mp4"];
$("fgo").onclick=async function(){
var out=$("fout"),f=$("f").files[0];
if(!f){show(out,"warn","Аввал файлро интихоб кунед.");return}
if(f.size>200*1024*1024){show(out,"warn","Файл аз 200 МБ калон аст.",["Барои ин барнома файлҳои хурдтар мувофиқанд."]);return}
show(out,"warn","Ҳисоб мешавад...");
try{
var buf=await f.arrayBuffer(),d=await crypto.subtle.digest("SHA-256",buf);
var hex=Array.from(new Uint8Array(d)).map(function(b){return b.toString(16).padStart(2,"0")}).join("");
var notes=[],lvl="ok",title="Аломати хатари возеҳ ёфт нашуд",
parts=f.name.toLowerCase().split("."),ext=parts.length>1?parts[parts.length-1]:"";
if(BADEXT.indexOf(ext)>-1){lvl="warn";title="Эҳтиёт кунед";notes.push("Навъи файл (."+ext+") метавонад иҷро шавад. Танҳо аз сарчашмаи боваринок насб кунед.")}
if(ext==="apk")notes.push("APK-ро танҳо аз Google Play ё сайти расмӣ насб кунед.");
if(parts.length>2&&BADEXT.indexOf(ext)>-1&&DOCEXT.indexOf(parts[parts.length-2])>-1){lvl="bad";title="Хатарнок: пасванди дугона";notes.push("Ном ба ҳуҷҷат монанд аст, вале файли иҷроишаванда аст.")}
var exp=$("eh").value.trim().toLowerCase().replace(/[\s:]/g,"");
if(exp){if(exp.length!==64){notes.push("Ҳаши ворид кардашуда 64 аломат нест.");if(lvl==="ok"){lvl="warn";title="Ҳаш мувофиқ нест"}}
else if(exp===hex){notes.push("Ҳаш бо ҳаши ворид кардашуда мувофиқ аст: файл тағйир наёфтааст.")}
else{lvl="bad";title="Ҳаш мувофиқ намеояд";notes.push("Файл бо нусхаи аслӣ баробар нест. Насб накунед.")}}
var v=show(out,lvl,title,notes);
v.appendChild(el("p","note",f.name+" · "+Math.round(f.size/1024)+" КБ"));
v.appendChild(el("div","hash",hex));
v.appendChild(el("p","note","Ин санҷиши вирус нест. Мувофиқ омадани ҳаш танҳо нишон медиҳад, ки файл тағйир наёфтааст."));
}catch(e){show(out,"bad","Ҳангоми ҳисоб хато шуд.",["Файлро дубора интихоб кунед."])}};

/* Пайванд */
var SHORT=["bit.ly","tinyurl.com","t.co","goo.gl","is.gd","cutt.ly","rb.gy","ow.ly"],
BADTLD=["zip","mov","top","xyz","click","gq","tk","ml","cf","icu"],
BRANDS=["paypal","google","apple","microsoft","facebook","instagram","whatsapp","telegram","binance","amazon"];
$("ugo").onclick=function(){
var out=$("uout"),raw=$("u").value.trim(),url;
if(!raw){show(out,"warn","Пайвандро дар ин ҷо гузоред.");return}
try{url=new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw)?raw:"https://"+raw)}catch(e){show(out,"warn","Пайванд дуруст нест.",["Шакли пайвандро санҷед."]);return}
var h=url.hostname.toLowerCase(),n=[],s=0;
function add(w,t){s+=w;n.push(t)}
if(url.protocol!=="https:")add(1,"Пайванд бо "+url.protocol.replace(":","")+" (на https): маълумот муҳофизат нашудааст.");
if(/^\d{1,3}(\.\d{1,3}){3}$/.test(h)||h.indexOf(":")>-1)add(2,"Ба ҷои номи сайт рақами IP истифода шудааст.");
if(url.username||raw.indexOf("@")>-1)add(2,"Аломати @ дар пайванд: сайти воқеӣ метавонад пинҳон бошад.");
if(h.indexOf("xn--")>-1)add(2,"Номи сайт бо кодҳои punycode (xn--): ҳарфҳои ба лотинӣ монанд метавонанд фиреб бошанд.");
if(h.split(".").length>4)add(1,"Зерномҳои зиёд: номи аслӣ дар охир меояд.");
if(SHORT.indexOf(h)>-1)add(1,"Пайванди кӯтоҳшуда: суроғаи воқеӣ пинҳон аст.");
var tld=h.split(".").pop();if(BADTLD.indexOf(tld)>-1)add(1,"Пасвандӣ (."+tld+") дар сайтҳои фиребгар зиёд вомехӯрад.");
BRANDS.forEach(function(b){if(h.indexOf(b)>-1&&!(h===b+".com"||h.endsWith("."+b+".com")))add(2,"Номи «"+b+"» дар домени бегона омадааст.")});
if((h.match(/-/g)||[]).length>3)add(1,"Дар номи сайт хатчаҳо зиёданд.");
if(raw.length>120)add(1,"Пайванд хеле дароз аст.");
var lvl=s>=3?"bad":s>=1?"warn":"ok",t=s>=3?"Хатарнок: бовар накунед":s>=1?"Эҳтиёт кунед":"Аломати хатари возеҳ ёфт нашуд";
var v=show(out,lvl,t,n);v.appendChild(el("p","note","Домен: "+h+". Натиҷа кафолат нест: ба сайтҳои ороста ҳам эҳтиёт кунед."))};

/* Парол */
var COMMON=["password","123456","12345678","123456789","qwerty","qwerty123","111111","abc123","iloveyou","admin","welcome","letmein","parol","parol123","000000","1q2w3e4r","dragon","monkey","football","12345"];
var pw=$("pw");
pw.oninput=function(){var p=pw.value,out=$("pout"),m=$("mt");
if(!p){out.textContent="";m.style.width="0";return}
var pool=0,n=[];if(/[a-z]/.test(p))pool+=26;if(/[A-Z]/.test(p))pool+=26;if(/\d/.test(p))pool+=10;if(/[^A-Za-z0-9]/.test(p))pool+=33;
var bits=p.length*Math.log2(pool||1),low=p.toLowerCase();
if(p.length<12)n.push("Кӯтоҳ: камтар аз 12 аломат.");
if(COMMON.some(function(c){return low===c||low.replace(/\d+$/,"")===c})){bits=Math.min(bits,8);n.push("Дар рӯйхати паролҳои маъруф аст.")}
if(/(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd|zxc)/.test(low)){bits*=.7;n.push("Қатори пайдарпайи аломатҳо дорад.")}
if(/(.)\1{2,}/.test(p)){bits*=.75;n.push("Аломатҳо такрор мешаванд.")}
if(/^\d+$/.test(p))n.push("Танҳо рақам: ҳарф ва аломатҳо илова кунед.");
else if(pool<62&&p.length<16)n.push("Ҳарфҳои калон, хурд, рақам ва аломатҳоро омехта кунед.");
var lv,t,pc,col;
if(bits<40){lv="bad";t="Суст";pc=25;col="var(--bad)"}else if(bits<60){lv="warn";t="Миёна";pc=50;col="var(--warn)"}else if(bits<80){lv="ok";t="Хуб";pc=75;col="var(--ok)"}else{lv="ok";t="Хеле хуб";pc=100;col="var(--ok)"}
m.style.width=pc+"%";m.style.background=col;
var v=show(out,lv,t,n);if(lv==="ok")v.appendChild(el("p","note","Паролҳои дароз ва ҷудогона барои ҳар ҳисоб беҳтарин аст. Менеҷери паролро истифода баред."))};
$("sh").onclick=function(){var t=pw.type==="password";pw.type=t?"text":"password";this.textContent=t?"Пинҳон":"Нишон"};

/* Барномаҳо */
var LV={high:["bad","Хатарнок"],medium:["warn","Эҳтиёт"],low:["ok","Дуруст"]};
var DEMO=[
{pkg:"demo.fastcleaner.pro",name:"Тозакунаки зуд (намуна)",installer:"",permissions:["android.permission.READ_SMS","android.permission.RECEIVE_SMS","android.permission.SYSTEM_ALERT_WINDOW"],bound:["android.permission.BIND_ACCESSIBILITY_SERVICE"],a11yEnabled:true,hasLauncher:true},
{pkg:"demo.free.vpn.lite",name:"VPN-и ройгон (намуна)",installer:"com.google.android.packageinstaller",permissions:["android.permission.REQUEST_INSTALL_PACKAGES"],bound:[],hasLauncher:false},
{pkg:"demo.chat.messenger",name:"Паёмрасон (намуна)",installer:"com.android.vending",permissions:["android.permission.READ_SMS","android.permission.RECEIVE_SMS","android.permission.SEND_SMS"],bound:[],hasLauncher:true},
{pkg:"demo.notes.app",name:"Дафтарча (намуна)",installer:"com.android.vending",permissions:[],bound:[],hasLauncher:true},
{pkg:"demo.photo.editor",name:"Муҳаррири акс (намуна)",installer:"com.android.vending",permissions:["android.permission.RECORD_AUDIO"],bound:[],hasLauncher:true}];
function card(x,i){var lv=LV[x.r.level],c=el("div","v "+lv[0]);c.style.animationDelay=(i*70)+"ms";
c.appendChild(el("h3","",x.a.name+" · "+lv[1]));c.appendChild(el("div","pk",x.a.pkg));
var u=el("ul");x.r.reasons.forEach(function(t){u.appendChild(el("li","",t))});c.appendChild(u);return c}
function renderApps(apps){
var out=$("aout");out.textContent="";
var rated=apps.map(function(a){return{a:a,r:AnisRisk.scoreApp(a)}}).sort(function(x,y){return y.r.score-x.r.score});
var c={high:0,medium:0,low:0};rated.forEach(function(x){c[x.r.level]++});
var s=el("div","sum");
[["h",c.high,"Хатарнок"],["m",c.medium,"Эҳтиёт"],["l",c.low,"Дуруст"]].forEach(function(t){var b=el("span",t[0]);b.appendChild(el("b","",String(t[1])));b.appendChild(document.createTextNode(t[2]));s.appendChild(b)});
out.appendChild(s);
var fl=rated.filter(function(x){return x.r.level!=="low"});
if(!fl.length)out.appendChild(el("p","note c","Барномаи шубҳанок ёфт нашуд."));
fl.forEach(function(x,i){out.appendChild(card(x,i))});
var d=el("details");d.appendChild(el("summary","","Ҳамаи барномаҳо ("+rated.length+")"));
rated.forEach(function(x){d.appendChild(el("div","li",x.a.name+" · "+LV[x.r.level][1]))});out.appendChild(d);
return rated.length}
async function run(getApps,demo){
var radar=$("radar"),st=$("ast"),btn=$("scan");
radar.classList.add("on");st.textContent="Скан мешавад...";
try{var apps=await getApps();await wait(1400);var n=renderApps(apps);
st.textContent=(demo?"Намунаи тарҳ: ":"Скан тамом шуд: ")+n+" барнома санҷида шуд."}
catch(e){st.textContent="Скан иҷро нашуд. Дубора кӯшиш кунед."}
radar.classList.remove("on")}
$("scan").onclick=function(){
var P=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.AppScanner;
if(!P){$("ast").textContent="Ин имконият танҳо дар барномаи Android кор мекунад. Барои дидани тарҳ «Намуна»-ро пахш кунед.";return}
run(function(){return P.listApps().then(function(r){return r.apps||[]})},false)};
$("demo").onclick=function(){run(function(){return Promise.resolve(DEMO)},true)};

if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
})();
