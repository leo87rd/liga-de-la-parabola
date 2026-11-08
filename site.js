
(function(){
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(btn){btn.addEventListener('click',function(){var a=nav.classList.toggle('abierto');btn.setAttribute('aria-expanded',a)})}
  function leer(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
  function guardar(k,v){try{localStorage.setItem(k,v)}catch(e){}}

  // Mi equipo: rol, nombre, número y color de la camiseta
  var roles=document.querySelectorAll('.rol');
  if(roles.length){
    var actual=leer('rol','');
    roles.forEach(function(r){
      r.setAttribute('aria-pressed', r.dataset.rol===actual);
      r.addEventListener('click',function(){
        roles.forEach(function(x){x.setAttribute('aria-pressed','false')});
        r.setAttribute('aria-pressed','true'); guardar('rol',r.dataset.rol);
        document.getElementById('rol-elegido').textContent='Tu rol: '+r.dataset.rol;
      });
    });
    if(actual) document.getElementById('rol-elegido').textContent='Tu rol: '+actual;
    var nom=document.getElementById('eq-nombre'), num=document.getElementById('eq-numero'),
        col=document.getElementById('eq-color'), cartel=document.getElementById('eq-cartel');
    nom.value=leer('eq-nombre',''); num.value=leer('eq-numero','10'); col.value=leer('eq-color','#0f2a43');
    function pintar(){
      if(window.pintarEquipo) window.pintarEquipo(nom.value,num.value,col.value);
      cartel.textContent=nom.value?('Equipo: '+nom.value):'Pon el nombre de tu equipo';
      guardar('eq-nombre',nom.value);guardar('eq-numero',num.value);guardar('eq-color',col.value);
    }
    [nom,num,col].forEach(function(e){e.addEventListener('input',pintar)}); pintar();
  }

  // Bitácora: se guarda en este navegador y se puede descargar como texto
  var form=document.getElementById('bitacora');
  if(form){
    var campos=form.querySelectorAll('[data-k]');
    campos.forEach(function(c){c.value=leer('bit-'+c.dataset.k,'');c.addEventListener('input',function(){guardar('bit-'+c.dataset.k,c.value)})});
    document.getElementById('descargar').addEventListener('click',function(){
      var t='BITÁCORA DEL EQUIPO\n\n';
      campos.forEach(function(c){t+=c.previousElementSibling.textContent+':\n'+(c.value||'(sin completar)')+'\n\n'});
      var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));
      a.download='bitacora-equipo.txt';a.click();URL.revokeObjectURL(a.href);
    });
    document.getElementById('borrar').addEventListener('click',function(){
      if(confirm('¿Borrar todo lo escrito en la bitácora?')){campos.forEach(function(c){c.value='';guardar('bit-'+c.dataset.k,'')})}
    });
  }
})();

(function(){
  function leer(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
  function guardar(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function tinta(hex){var r=parseInt(hex.substr(1,2),16),g=parseInt(hex.substr(3,2),16),b=parseInt(hex.substr(5,2),16);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff'}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // ---- Avatares y escudo
  var AV=[{n:'Jugador 1',s:'#f1c9a0',h:'#2b1b12',e:0},{n:'Jugador 2',s:'#8d5524',h:'#111111',e:1},
          {n:'Jugadora 3',s:'#c68642',h:'#3b2314',e:2},{n:'Jugador 4',s:'#5c3a21',h:'#111111',e:3},
          {n:'Jugadora 5',s:'#e0ac69',h:'#6b3f1d',e:2},{n:'Jugador 6',s:'#3d2314',h:'#111111',e:0}];
  function avatarSVG(a,color,num){
    var pelo=a.e===1?'<circle cx="42" cy="26" r="22" fill="'+a.h+'"/>':'';
    var cab='';
    if(a.e===0) cab='<path d="M26 33 Q26 16 42 16 Q58 16 58 33 Q50 24 42 24 Q34 24 26 33Z" fill="'+a.h+'"/>';
    if(a.e===2) cab='<path d="M26 34 Q24 14 42 14 Q60 14 58 34 L54 34 Q54 24 42 22 Q30 24 30 34Z" fill="'+a.h+'"/><rect x="22" y="30" width="7" height="30" rx="3" fill="'+a.h+'"/><rect x="55" y="30" width="7" height="30" rx="3" fill="'+a.h+'"/>';
    if(a.e===3) cab='<rect x="26" y="24" width="32" height="6" fill="#c0392b"/>';
    return '<svg viewBox="0 0 84 100" role="img" aria-label="'+a.n+'">'+pelo+
      '<path d="M18 98 L18 66 Q18 56 30 56 L54 56 Q66 56 66 66 L66 98Z" fill="'+color+'" stroke="#0f2a43" stroke-width="2"/>'+
      '<rect x="36" y="46" width="12" height="12" fill="'+a.s+'"/><circle cx="42" cy="34" r="16" fill="'+a.s+'"/>'+cab+
      '<circle cx="36" cy="35" r="2" fill="#222"/><circle cx="48" cy="35" r="2" fill="#222"/>'+
      '<path d="M36 42 Q42 47 48 42" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>'+
      '<text x="42" y="86" text-anchor="middle" font-family="system-ui,Arial" font-weight="800" font-size="20" fill="'+tinta(color)+'">'+esc(num||'0')+'</text></svg>';
  }
  function escudoSVG(nombre,color){
    var t=(nombre||'Tu equipo').slice(0,14), fs=t.length>9?12:15;
    return '<svg viewBox="0 0 120 140" role="img" aria-label="Escudo del equipo '+esc(t)+'">'+
      '<path d="M60 6 L112 24 L112 70 Q112 110 60 134 Q8 110 8 70 L8 24Z" fill="'+color+'" stroke="#0f2a43" stroke-width="5"/>'+
      '<circle cx="60" cy="50" r="22" fill="#e8730c" stroke="#0f2a43" stroke-width="3"/>'+
      '<path d="M60 28v44M38 50h44M44 34c8 8 8 24 0 32M76 34c-8 8-8 24 0 32" stroke="#0f2a43" stroke-width="2.4" fill="none"/>'+
      '<text x="60" y="100" text-anchor="middle" font-family="system-ui,Arial" font-weight="800" font-size="'+fs+'" fill="'+tinta(color)+'">'+esc(t)+'</text></svg>';
  }
  var picker=document.querySelector('.avatares');
  if(picker){
    var sel=parseInt(leer('avatar','0'),10)||0, estado={n:'',num:'10',c:'#0f2a43'};
    function dibujar(){
      picker.querySelectorAll('.av').forEach(function(b,i){b.innerHTML=avatarSVG(AV[i],estado.c,estado.num);b.setAttribute('aria-pressed',i===sel)});
      document.getElementById('avatar-vista').innerHTML=avatarSVG(AV[sel],estado.c,estado.num);
      document.getElementById('escudo-vista').innerHTML=escudoSVG(estado.n,estado.c);
    }
    picker.querySelectorAll('.av').forEach(function(b,i){b.addEventListener('click',function(){sel=i;guardar('avatar',i);dibujar()})});
    window.pintarEquipo=function(n,num,c){estado={n:n,num:num,c:c};dibujar()};
    var n0=document.getElementById('eq-nombre'),u0=document.getElementById('eq-numero'),c0=document.getElementById('eq-color');
    estado={n:n0.value,num:u0.value,c:c0.value}; dibujar();
  }

  // ---- Fichas de entrenamiento
  var fn=document.getElementById('fichas-n');
  if(fn){
    var v=parseInt(leer('fichas','3'),10); if(isNaN(v)) v=3;
    function pf(){fn.textContent=v;guardar('fichas',v)}
    document.getElementById('fichas-mas').addEventListener('click',function(){v++;pf()});
    document.getElementById('fichas-menos').addEventListener('click',function(){if(v>0){v--;pf()}});
    pf();
  }

  // ---- Sellos (insignias): se marcan al lograrlos
  document.querySelectorAll('.ins-b').forEach(function(b){
    var k='sello-'+b.dataset.id, on=leer(k,'0')==='1';
    function pintar(){b.setAttribute('aria-pressed',on);b.querySelector('.est').textContent=on?'Conseguido':'Por conseguir'}
    b.addEventListener('click',function(){on=!on;guardar(k,on?'1':'0');pintar()}); pintar();
  });

  // ---- Mazo de cartas
  var bot=document.getElementById('sacar');
  if(bot){
    var CARTAS=[
      ['Ayuda','Pista del entrenador','Te dicen la posición del vértice.'],
      ['Ayuda','Pase extra','Puedes repetir un tiro fallado.'],
      ['Obstáculo','Defensa alta','La altura de salida baja 0,2 m.'],
      ['Obstáculo','Cambio de aro','La distancia al aro sube 0,5 m.'],
      ['Desafío','Sin calculadora','Resuelven a mano y ganan una ficha extra.'],
      ['Desafío','Tiempo muerto','Tienen cinco minutos para ajustar la jugada.']];
    var cg=document.getElementById('carta-grande');
    bot.addEventListener('click',function(){
      var c=CARTAS[Math.floor(Math.random()*CARTAS.length)];
      cg.innerHTML='<span class="tipo">'+c[0]+'</span><h3>'+c[1]+'</h3><p style="margin:0">'+c[2]+'</p>';
    });
  }
})();
