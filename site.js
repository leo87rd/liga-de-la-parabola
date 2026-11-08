
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
        col=document.getElementById('eq-color'), cam=document.getElementById('camiseta'),
        cartel=document.getElementById('eq-cartel');
    nom.value=leer('eq-nombre',''); num.value=leer('eq-numero','10'); col.value=leer('eq-color','#0f2a43');
    function pintar(){
      cam.style.background=col.value; cam.textContent=num.value||'0';
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
