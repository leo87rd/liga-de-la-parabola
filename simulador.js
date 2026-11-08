
(function(){
  var cv=document.getElementById('cancha'); if(!cv) return;
  var ctx=cv.getContext('2d'), W=cv.width, H=cv.height, E=100, X0=70, Y0=H-50;   // 100 px = 1 m
  var sa=document.getElementById('sa'), sb=document.getElementById('sb'), sc=document.getElementById('sc'), sd=document.getElementById('sd');
  var out={a:document.getElementById('oa'),b:document.getElementById('ob'),c:document.getElementById('oc')};
  var res=document.getElementById('resultado'), eq=document.getElementById('ecuacion');
  var ALTO_ARO=3.05, TOL=0.12, bola=null, raf=0;
  function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  function P(){return {a:+sa.value,b:+sb.value,c:+sc.value,d:+sd.value}}
  function f(p,x){return p.a*x*x+p.b*x+p.c}
  function px(x){return X0+x*E}  function py(y){return Y0-y*E}
  function analizar(p){
    var disc=p.b*p.b-4*p.a*(p.c-ALTO_ARO), xv=-p.b/(2*p.a), yv=f(p,xv), r={xv:xv,yv:yv};
    if(disc<0){r.msg='El balón no llega a la altura del aro.';r.ok=false;r.x=null;return r}
    r.x=(-p.b-Math.sqrt(disc))/(2*p.a);                 // raíz de bajada (a<0)
    var dx=r.x-p.d;
    if(Math.abs(dx)<=TOL){r.ok=true;r.msg='¡Encesta! El balón cruza la altura del aro a '+r.x.toFixed(2)+' m.'}
    else if(dx<0){r.ok=false;r.msg='Se queda corto: cruza la altura del aro a '+r.x.toFixed(2)+' m y el aro está a '+p.d.toFixed(2)+' m.'}
    else{r.ok=false;r.msg='Se pasa: cruza la altura del aro a '+r.x.toFixed(2)+' m y el aro está a '+p.d.toFixed(2)+' m.'}
    return r;
  }
  function dibujar(p,t){
    ctx.clearRect(0,0,W,H);
    var tinta=css('--ink'), nav=css('--navy'), nar=css('--orange');
    // suelo y marcas
    ctx.fillStyle=css('--court'); ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=css('--line'); ctx.lineWidth=1; ctx.font='13px system-ui'; ctx.fillStyle=css('--muted');
    for(var m=0;m<=9;m++){ctx.beginPath();ctx.moveTo(px(m),py(0));ctx.lineTo(px(m),py(4.6));ctx.stroke();ctx.fillText(m+' m',px(m)-10,Y0+22)}
    for(var h=1;h<=4;h++){ctx.beginPath();ctx.moveTo(X0,py(h));ctx.lineTo(px(9),py(h));ctx.stroke();ctx.fillText(h+' m',8,py(h)+4)}
    ctx.strokeStyle=nav; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(X0-30,Y0); ctx.lineTo(px(9.4),Y0); ctx.stroke();
    // línea de 3.05 m
    ctx.setLineDash([6,6]); ctx.strokeStyle=nar; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(X0,py(ALTO_ARO)); ctx.lineTo(px(9),py(ALTO_ARO)); ctx.stroke(); ctx.setLineDash([]);
    // jugador
    ctx.fillStyle=nav; ctx.beginPath(); ctx.arc(X0-14,py(p.c+0.02)-32,14,0,7); ctx.fill();
    ctx.lineWidth=7; ctx.strokeStyle=nav; ctx.beginPath(); ctx.moveTo(X0-14,py(p.c)-16); ctx.lineTo(X0-14,Y0-30); ctx.stroke();
    // aro y tablero
    var ax=px(p.d), ay=py(ALTO_ARO);
    ctx.strokeStyle=tinta; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ax+26,ay-80); ctx.lineTo(ax+26,ay+10); ctx.stroke();
    ctx.strokeStyle=nar; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(ax-22,ay); ctx.lineTo(ax+22,ay); ctx.stroke();
    ctx.strokeStyle=tinta; ctx.lineWidth=1.2;
    for(var i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(ax+i*10,ay);ctx.lineTo(ax+i*5,ay+30);ctx.stroke()}
    // trayectoria
    var xf=p.d+1.6, paso=0.02; ctx.strokeStyle=nar; ctx.lineWidth=3; ctx.beginPath(); var ini=true;
    for(var x=0;x<=xf;x+=paso){var y=f(p,x); if(y<0) break; (ini?ctx.moveTo(px(x),py(y)):ctx.lineTo(px(x),py(y))); ini=false}
    ctx.stroke();
    // vértice
    var r=analizar(p);
    if(r.yv>0){ctx.fillStyle=nav; ctx.beginPath(); ctx.arc(px(r.xv),py(r.yv),6,0,7); ctx.fill();
      ctx.fillStyle=tinta; ctx.font='bold 13px system-ui'; ctx.fillText('vértice',px(r.xv)+9,py(r.yv)-8)}
    // balón en vuelo
    if(t!=null){var by=f(p,t); ctx.fillStyle='#e8730c'; ctx.strokeStyle='#0f2a43'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(px(t),py(by),12,0,7); ctx.fill(); ctx.stroke()}
  }
  function leer(){
    var p=P(); out.a.textContent=p.a.toFixed(3); out.b.textContent=p.b.toFixed(3); out.c.textContent=p.c.toFixed(2)+' m';
    eq.textContent='y = '+p.a.toFixed(3)+'x² + '+p.b.toFixed(3)+'x + '+p.c.toFixed(2);
    var r=analizar(p);
    document.getElementById('lv').textContent=r.xv.toFixed(2)+' m';
    document.getElementById('lh').textContent=r.yv.toFixed(2)+' m';
    document.getElementById('lx').textContent=r.x==null?'—':r.x.toFixed(2)+' m';
    res.textContent=r.msg; res.className=r.ok?'ok':'mal'; res.setAttribute('role','status');
    dibujar(p,null);
  }
  function tirar(){
    cancelAnimationFrame(raf); var p=P(), t=0, fin=p.d+1.6;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){dibujar(p,p.d);return}
    (function paso(){t+=0.07; dibujar(p,t); if(t<fin && f(p,t)>0) raf=requestAnimationFrame(paso); else dibujar(p,null)})();
  }
  [sa,sb,sc,sd].forEach(function(e){e.addEventListener('input',leer)});
  document.getElementById('tirar').addEventListener('click',tirar);
  document.getElementById('ejemplo').addEventListener('click',function(){sa.value=-0.15;sb.value=1.075;sc.value=2;sd.value=6;leer();tirar()});
  window.addEventListener('load',leer); leer();
})();
