/* Shared by every page: menu, footer and the numbers from settings.js. */
(function(){
  var S=SETTINGS;
  var file=(location.pathname.split('/').pop()||'index.html');
  var pages=[["index.html","Home"],["about.html","About us"],["services.html","Our services"],["how-it-works.html","How it works"],["terms.html","Terms"],["faq.html","FAQ"]];
  var navHtml='';
  pages.forEach(function(p){navHtml+='<a href="'+p[0]+'"'+(p[0]===file?' class="active" aria-current="page"':'')+'>'+p[1]+'</a>';});
  navHtml+='<a class="btn" href="contact.html">Get a costing</a>';
  var h=document.getElementById('site-header');
  if(h){h.className='top';h.innerHTML='<a class="logo" id="logo" href="index.html" style="color:inherit;text-decoration:none"></a><nav aria-label="Main">'+navHtml+'</nav>';}
  var f=document.getElementById('site-footer');
  if(f){f.innerHTML='&copy; '+new Date().getFullYear()+' <span data-s="brand"></span>. Cost figures shown on this site are illustrative. Contact: <span data-s="email"></span>';}

  var els=document.querySelectorAll('[data-s]');
  for(var k=0;k<els.length;k++){var val=S[els[k].getAttribute('data-s')];if(val===undefined)val='';if(typeof val==='number')val=val.toLocaleString('en-US');els[k].textContent=val;}
  var logo=document.getElementById('logo');
  if(logo){
    if(S.brand.indexOf(' ')>0){var parts=S.brand.split(' ');logo.textContent=parts[0];var sp=document.createElement('span');sp.textContent=' '+parts.slice(1).join(' ');logo.appendChild(sp);}
    else{logo.textContent='';var a1=document.createElement('span');a1.textContent=S.brand.charAt(0);logo.appendChild(a1);logo.appendChild(document.createTextNode(S.brand.slice(1)));}
  }
  var motion=!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hdr=document.getElementById('site-header');
  function onScroll(){if(hdr)hdr.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var fnd=document.getElementById('founder');if(fnd)fnd.hidden=!S.founderName;
  var root=document.documentElement;
  try{
    if(motion&&'IntersectionObserver' in window){
      var sel='main .eyebrow,main h1,main h2,main .lead,main .cta,main .facts,main .sheet,main .hero-desc,main .hero-actions,main .split>div>p,main .grid4>div,main .linkcards>a,main .steps li,main .terms tr,main .svc tbody tr,main .fit>*,main .form>div,main details,main .endcta,main .contact,main .two>div>h3,main .two>div>ol,main .row,main section>p';
      var all=Array.prototype.slice.call(document.querySelectorAll(sel));
      var set=new Set(all);
      var atoms=all.filter(function(el){var p=el.parentElement;while(p){if(set.has(p))return false;p=p.parentElement;}return true;});
      function cleanup(el,d){setTimeout(function(){el.classList.remove('rv','go');el.style.animationDelay='';},d+1100);}
      var io=new IntersectionObserver(function(es){
        var n=0;
        es.forEach(function(e){if(e.isIntersecting){e.target.style.animationDelay=(n*90)+'ms';e.target.classList.add('go');cleanup(e.target,n*90);n++;io.unobserve(e.target);}});
      },{threshold:0.1});
      var n0=0,vh=window.innerHeight;
      atoms.forEach(function(el){
        el.classList.add('rv');
        if(el.getBoundingClientRect().top<vh*0.98){var dl=Math.min(n0*85,1500);el.style.animationDelay=dl+'ms';el.classList.add('go');cleanup(el,dl);n0++;}
        else io.observe(el);
      });
    }
  }finally{root.classList.add('ready');}
  function countUp(el,to,fmt,delay){
    if(!motion){el.textContent=fmt(to);return;}
    el.textContent=fmt(0);var t0=null,dur=1100;
    function step(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(step);}
    setTimeout(function(){requestAnimationFrame(step);},delay||0);
  }
  var li=document.getElementById('li');if(li){li.href=S.linkedinUrl;li.textContent=S.linkedinText;}
  var wa=document.getElementById('wa');if(wa)wa.hidden=!S.whatsapp;


  var track=document.getElementById('track');
  if(track){
    var slidesCfg=S.heroSlides||[["images/photo1.jpg","Factory floor"],["images/photo2.jpg","Fabric swatches"],["images/photo4.jpg","Fabric sourcing"],["images/photo3.jpg","Packing"],["images/photo5.jpg","Finished garments"]];
    var n=slidesCfg.length,idx=0,timer=null,busy=false;
    var cap=document.getElementById('cap'),dotsEl=document.getElementById('dots'),dots=[];
    function mkSlide(src){var d=document.createElement('div');d.className='slide';var im=document.createElement('img');im.src=src;im.alt='';im.decoding='async';d.appendChild(im);return d;}
    slidesCfg.forEach(function(sl,i){track.appendChild(mkSlide(sl[0]));
      var bt=document.createElement('button');bt.type='button';bt.setAttribute('aria-label','Show slide '+(i+1)+': '+sl[1]);
      bt.addEventListener('click',function(){go(i);restart();});dotsEl.appendChild(bt);dots.push(bt);});
    track.appendChild(mkSlide(slidesCfg[0][0]));
    function mark(){var k=((idx%n)+n)%n;dots.forEach(function(d,i){if(i===k)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});if(cap)cap.textContent=slidesCfg[k][1];}
    function place(i,anim){track.classList.toggle('nox',!anim);track.style.transform='translateX(-'+(i*100)+'%)';if(!anim){void track.offsetWidth;}}
    function go(i){
      if(busy&&motion)return;
      if(!motion){idx=((i%n)+n)%n;place(idx,false);mark();return;}
      if(i<0){place(n,false);idx=n;i=n-1;void track.offsetWidth;}
      busy=true;idx=i;place(idx,true);mark();
      setTimeout(function(){if(idx>=n){idx=0;place(0,false);}busy=false;},1150);
    }
    function next(){go(idx+1);}
    function restart(){if(!motion)return;clearInterval(timer);timer=setInterval(next,5500);}
    place(0,false);mark();restart();
    var hero=document.getElementById('hero');
    if(hero){
      hero.addEventListener('mouseenter',function(){clearInterval(timer);});
      hero.addEventListener('mouseleave',restart);
      var x0=null;
      hero.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
      hero.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45){go(dx<0?idx+1:idx-1);restart();}},{passive:true});
    }
    document.addEventListener('visibilitychange',function(){if(document.hidden)clearInterval(timer);else restart();});
  }

  var tb=document.getElementById('rows');
  if(tb){
    var lines=[["Yarn, "+S.yarnKgPerPiece+" kg at US$"+S.yarnPricePerKg.toFixed(2)+"/kg",S.yarnKgPerPiece*S.yarnPricePerKg]].concat(S.otherCosts);
    var total=0;
    lines.forEach(function(l,idx){total+=l[1];var tr=document.createElement('tr');tr.style.setProperty('--i',idx);
      var a=document.createElement('td');a.textContent=l[0];
      var b=document.createElement('td');b.className='n';b.textContent=l[1].toFixed(2);
      tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);});
    var tr=document.createElement('tr');tr.className='total';tr.style.setProperty('--i',lines.length);
    var a=document.createElement('td');a.textContent=S.fobPort;
    var b=document.createElement('td');b.className='n';b.textContent=total.toFixed(2);
    tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);
    var totalCell=b,sheetEl=tb.closest('.sheet');
    var q=document.getElementById('qty'),ov=document.getElementById('ov');q.min=S.minQty;q.value=S.exampleQty;
    function fmtOv(x){return 'US$ '+Math.round(x).toLocaleString('en-US');}
    function ovu(){var n=Math.max(0,parseFloat(q.value)||0);ov.textContent=fmtOv(n*total);}
    q.addEventListener('input',ovu);
    ovu();
    function play(){sheetEl.classList.add('seen');countUp(totalCell,total,function(x){return x.toFixed(2);},350);countUp(ov,Math.max(0,parseFloat(q.value)||0)*total,fmtOv,350);}
    if(motion&&'IntersectionObserver' in window&&sheetEl){
      sheetEl.classList.add('arm');
      var io2=new IntersectionObserver(function(es){if(es[0].isIntersecting){play();io2.disconnect();}},{threshold:0.35});
      io2.observe(sheetEl);
    }
  }

  var first=document.getElementById('f-brand');
  if(first){
    var fq=document.getElementById('f-qty');fq.min=S.minQty;fq.value=S.exampleQty;
    var st=document.getElementById('st'),send=document.getElementById('send');
    function v(id){return document.getElementById(id).value.trim();}
    if(S.formEndpoint){send.hidden=false;}
    else{st.textContent='Online requests are not switched on yet. Please email '+S.email+'.';}
    send.addEventListener('click',function(){
      var email=v('f-email');
      if(!v('f-brand')||!v('f-name')||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||!(parseFloat(v('f-qty'))>0)){st.textContent='Please fill in brand, your name, a valid email and the quantity.';return;}
      if(document.getElementById('f-gotcha').value){return;}
      var d=new Date(),ref='7V-'+d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
      var payload={order_ref:ref,_subject:'New costing request '+ref+' from '+v('f-brand'),brand:v('f-brand'),contact_name:v('f-name'),email:email,style:v('f-style'),quantity_per_style:v('f-qty'),target_fob_usd:v('f-fob')||'-',delivery_needed_by:v('f-date')||'-',fibre_and_certification:v('f-fibre')||'-',notes:v('f-notes')||'-'};
      send.disabled=true;st.textContent='Sending...';
      fetch(S.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){if(!r.ok)throw new Error('bad');
          var rc=S.emailjsServiceId&&S.emailjsTemplateId&&S.emailjsPublicKey;
          if(rc){try{fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:S.emailjsServiceId,template_id:S.emailjsTemplateId,user_id:S.emailjsPublicKey,template_params:{to_email:email,to_name:payload.contact_name,order_ref:ref,brand:payload.brand,style:payload.style,quantity:payload.quantity_per_style,target_fob:payload.target_fob_usd,delivery:payload.delivery_needed_by,fibre:payload.fibre_and_certification,notes:payload.notes,submitted:d.toUTCString(),reply_window:S.costingTime,company:S.brand,support_email:S.email}})}).then(function(x){return x.text().then(function(t){if(!x.ok){var m=document.getElementById('st');m.textContent=m.textContent.replace(/ A receipt is on its way to [^ ]+\./,'')+' Receipt not sent ('+x.status+': '+t.slice(0,140)+').';}});}).catch(function(e){var m=document.getElementById('st');m.textContent+=' Receipt not sent (network: '+(e&&e.message||'blocked')+').';});}catch(e){}}
          st.textContent='Sent. Your reference is '+ref+'.'+(rc?' A receipt is on its way to '+email+'.':'')+' Expect a reply by email within '+S.costingTime+'.';
          ['f-brand','f-name','f-email','f-fob','f-date','f-fibre','f-notes'].forEach(function(id){document.getElementById(id).value='';});
          send.disabled=false;})
        .catch(function(){st.textContent='Could not send. Please email '+S.email+' instead.';send.disabled=false;});
    });
  }

  /* Vein lines under the hero, drawn progressively as the page scrolls */
  (function(){
    var hero=document.getElementById('hero'),main=document.querySelector('main');
    if(!main)return;
    var NS='http://www.w3.org/2000/svg',svg,paths=[],H=0,W=0,top=0,raf=0;
    function rng(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
    function pt(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}
    function smooth(pts){var d='M'+pt(pts[0]);for(var i=1;i<pts.length-1;i++){var m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];d+=' Q'+pt(pts[i])+' '+pt(m);}
      return d+' L'+pt(pts[pts.length-1]);}
    function walk(r,x,y,ang,len,drift){var pts=[[x,y]],a=ang,step=44,n=Math.max(3,Math.round(len/step));
      for(var i=0;i<n;i++){a+=(r()-.5)*drift;a=Math.max(.35,Math.min(Math.PI-.35,a));x+=Math.cos(a)*step;y+=Math.sin(a)*step;pts.push([x,y]);}
      return pts;}
    function add(d,w,op,y0,y1){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('class','vn');
      p.style.strokeWidth=w;p.style.opacity=op;svg.appendChild(p);paths.push({p:p,y0:y0,y1:Math.max(y1,y0+1),len:0});}
    function branchOut(r,pts,depth,w,op){
      for(var i=2;i<pts.length-1;i+=1+Math.floor(r()*3)){
        if(r()<.55)continue;var side=r()<.5?-1:1,base=Math.PI/2+side*(.5+r()*.6);
        var b=walk(r,pts[i][0],pts[i][1],base,110+r()*220,.9);
        add(smooth(b),w,op,b[0][1],b[b.length-1][1]);
        if(depth>0&&r()<.7)branchOut(r,b,depth-1,w*.7,op*.9);}
    }
    function build(){
      if(svg&&svg.parentNode)svg.parentNode.removeChild(svg);
      paths=[];W=main.clientWidth;top=hero?hero.offsetTop+hero.offsetHeight:0;H=main.clientHeight-top;
      if(H<200)return;
      svg=document.createElementNS(NS,'svg');svg.setAttribute('class','vein-bg');svg.setAttribute('aria-hidden','true');
      svg.setAttribute('width',W);svg.setAttribute('height',H);svg.style.top=top+'px';
      var r=rng(7),n=W<700?3:6;
      for(var i=0;i<n;i++){
        var x=W*(i+.5)/n+(r()-.5)*W/n*.6,t=walk(r,x,0,Math.PI/2+(r()-.5)*.3,H+40,.7);
        add(smooth(t),1.9,.2,0,t[t.length-1][1]);
        branchOut(r,t,2,1.2,.15);
      }
      main.insertBefore(svg,main.firstChild);
      paths.forEach(function(o){o.len=o.p.getTotalLength();o.p.style.strokeDasharray=o.len;});
      update();
    }
    function update(){raf=0;if(!svg)return;
      var py=(window.scrollY||window.pageYOffset)+window.innerHeight*.92-(main.getBoundingClientRect().top+(window.scrollY||window.pageYOffset))-top;
      paths.forEach(function(o){var f=motion?(py-o.y0)/(o.y1-o.y0):1;f=f<0?0:f>1?1:f;o.p.style.strokeDashoffset=o.len*(1-f);});
    }
    function sched(){if(!raf)raf=requestAnimationFrame(update);}
    var lastW=0,to;
    function init(){build();lastW=window.innerWidth;}
    window.addEventListener('scroll',sched,{passive:true});
    window.addEventListener('resize',function(){clearTimeout(to);to=setTimeout(function(){if(window.innerWidth!==lastW)init();else{build();}},200);});
    window.addEventListener('load',init);
    setTimeout(init,300);
  })();
})();
