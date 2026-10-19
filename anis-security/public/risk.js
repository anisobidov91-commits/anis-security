(function(root){
var STORES=["com.android.vending","com.sec.android.app.samsungapps","com.amazon.venezia","com.huawei.appmarket","com.xiaomi.mipicks","com.heytap.market"];
var PERM=[
["android.permission.READ_SMS",2,"Метавонад SMS-ҳоро бихонад"],
["android.permission.RECEIVE_SMS",1,"Метавонад SMS-ҳои воридшударо бигирад"],
["android.permission.SEND_SMS",2,"Метавонад SMS фиристад (хатари хароҷоти пинҳонӣ)"],
["android.permission.SYSTEM_ALERT_WINDOW",2,"Метавонад болои барномаҳои дигар экран кашад (рӯйпӯш)"],
["android.permission.REQUEST_INSTALL_PACKAGES",2,"Метавонад APK-ҳои дигарро насб кунад"],
["android.permission.READ_CALL_LOG",1,"Рӯйхати занғҳоро мехонад"],
["android.permission.RECORD_AUDIO",1,"Метавонад садо сабт кунад"],
["android.permission.ACCESS_BACKGROUND_LOCATION",1,"Ҷойгиршавиро дар пасзамина мегирад"],
["android.permission.MANAGE_EXTERNAL_STORAGE",1,"Ба ҳамаи файлҳои телефон дастрасӣ дорад"]];
var BOUND=[
["android.permission.BIND_ACCESSIBILITY_SERVICE",2,"Хидмати дастрасии махсус (Accessibility) дорад, ки троянҳои бонкӣ аксар вақт суиистифода мекунанд"],
["android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",2,"Метавонад хабарномаҳоро (аз ҷумла кодҳои SMS) бихонад"]];
function scoreApp(a){
var s=0,why=[],perms=a.permissions||[],bound=a.bound||[],side=STORES.indexOf(a.installer||"")<0;
if(side){s+=2;why.push("Аз мағозаи расмӣ насб нашудааст")}
PERM.forEach(function(p){if(perms.indexOf(p[0])>-1){s+=p[1];why.push(p[2])}});
BOUND.forEach(function(p){if(bound.indexOf(p[0])>-1){s+=p[1];why.push(p[2])}});
if(a.a11yEnabled){s+=3;why.push("Дастрасии махсус (Accessibility) ҳоло фаъол аст")}
if(a.deviceAdmin){s+=3;why.push("Администратори дастгоҳ шудааст (нест кардани он душвор аст)")}
if(a.debuggable){s+=1;why.push("Дар ҳолати debug сохта шудааст")}
if(side&&a.hasLauncher===false){s+=1;why.push("Дар экран нишон (icon) надорад")}
if(!side)s=Math.floor(s/2);
return{score:s,level:s>=5?"high":s>=2?"medium":"low",reasons:why}}
root.AnisRisk={scoreApp:scoreApp};
if(typeof module!=="undefined")module.exports=root.AnisRisk;
})(typeof window!=="undefined"?window:globalThis);
