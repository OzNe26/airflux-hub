/* Airflux – sociétés des Cartes (clients, prospects, anciens clients), partagées par tous les outils.
   Lit directement la page des Cartes : quand les Cartes sont mises à jour, tous les outils suivent.
   Si la lecture échoue (Cartes protégées ou indisponibles), on utilise la copie de secours societes.json. */
(function(){
  var CARTES='/plan-9b797da4c86b/';
  var BASE=((document.currentScript&&document.currentScript.src)||location.href).replace(/[^/]*$/,'');
  function grabJSON(t,marker){
    var i=t.indexOf(marker);if(i<0)return null;
    i=t.indexOf('{',i);if(i<0)return null;
    var d=0,s=false,e=false;
    for(var j=i;j<t.length;j++){var c=t[j];
      if(s){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')s=false;continue}
      if(c==='"')s=true;else if(c==='{')d++;else if(c==='}'){d--;if(!d)return JSON.parse(t.slice(i,j+1))}}
    return null;
  }
  function compact(D){
    var out=[],seen={};
    Object.keys(D.people||{}).forEach(function(k){(D.people[k].pts||[]).forEach(function(p){
      if(p.la==null||p.lo==null)return;var key=p.ref||p.i;if(seen[key])return;seen[key]=1;
      var o={};['n','s','ref','v','cp','la','lo','su','ad','co'].forEach(function(f){if(p[f]!=null&&p[f]!=='')o[f]=p[f]});out.push(o)})});
    return out;
  }
  var P=null;
  window.loadSocietes=function(){
    if(P)return P;
    P=fetch(CARTES,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text()})
      .then(function(t){var D=grabJSON(t,'const D=')||grabJSON(t,'const D =');if(!D)throw new Error('Cartes illisibles');var a=compact(D);if(!a.length)throw new Error('vide');window.SOC_SRC={from:'cartes',n:a.length};return a})
      .catch(function(err){return fetch(BASE+'societes.json',{cache:'no-cache'})
        .then(function(r){return r.json()}).then(function(j){window.SOC_SRC={from:'copie',n:j.pts.length,date:j.date,err:String(err&&err.message||err)};return j.pts})
        .catch(function(){window.SOC_SRC={from:'aucune',n:0};return []})});
    return P;
  };
})();
