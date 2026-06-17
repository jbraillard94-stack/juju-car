/* ===== JujuCar — script partagé "Velours valaisan" ===== */

// header on scroll
const header=document.getElementById('header');
if(header){
  const onScroll=()=>header.classList.toggle('scrolled',window.scrollY>30);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
}

// reveal on scroll + staggered children
const io=new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){
      const sibs=[...e.target.parentElement.querySelectorAll(':scope > .reveal')];
      const idx=sibs.indexOf(e.target);
      e.target.style.transitionDelay=(idx>0?idx*0.09:0)+'s';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:.16,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// count-up stats
const countIO=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=+el.dataset.count;
    let cur=0,step=Math.max(1,Math.round(target/40));
    const tick=()=>{cur=Math.min(target,cur+step);
      el.firstChild.nodeValue=cur;
      if(cur<target)requestAnimationFrame(tick);};
    el.insertBefore(document.createTextNode('0'),el.firstChild);
    tick();countIO.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('.trust-num').forEach(el=>countIO.observe(el));

// mobile drawer
const burger=document.getElementById('burger'),drawer=document.getElementById('drawer');
if(burger&&drawer){
  const setDrawer=(open)=>{
    burger.classList.toggle('open',open);
    drawer.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open);
    drawer.setAttribute('aria-hidden',!open);
    document.body.style.overflow=open?'hidden':'';
  };
  burger.addEventListener('click',()=>setDrawer(!drawer.classList.contains('open')));
  drawer.querySelectorAll('[data-close]').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setDrawer(false);});
}

// choice buttons (multi-select pills)
function toggleChoice(btn){btn.classList.toggle('active');}

// achat : choisir une voie (know / discover)
function achatStep(s){
  document.querySelectorAll('[data-achat]').forEach(el=>{el.style.display='none';});
  const t=document.querySelector('[data-achat="'+s+'"]');
  if(t){t.style.display='block';window.scrollTo({top:0,behavior:'smooth'});}
}

// formulaires -> Formspree (un seul endpoint, comme l'ancien site)
const FORMSPREE='https://formspree.io/f/mvzyvebp';
document.querySelectorAll('form.jc-form').forEach(f=>{
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const hp=f.querySelector('[name="website"]');
    if(hp&&hp.value)return; // honeypot
    const email=f.querySelector('input[type="email"]');
    if(!email||!email.value.trim()){
      if(email){email.focus();email.reportValidity();}else f.reportValidity();
      return;
    }
    if(!f.checkValidity()){f.reportValidity();return;}
    const data={type:f.dataset.type||'Contact'};
    f.querySelectorAll('input,select,textarea').forEach(el=>{
      if(!el.name||el.name==='website')return;
      data[el.name]=el.value;
    });
    f.querySelectorAll('.choice-group').forEach(g=>{
      const key=g.dataset.key||'choix';
      data[key]=[...g.querySelectorAll('.choice-btn.active')].map(b=>b.textContent.trim()).join(', ');
    });
    const btn=f.querySelector('[type="submit"]');
    const old=btn.innerHTML;btn.disabled=true;btn.innerHTML='Envoi en cours…';
    fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(data)})
      .then(r=>{
        if(r.ok){
          const ok=f.parentElement.querySelector('.form-ok');
          if(ok){f.style.display='none';ok.classList.add('show');ok.scrollIntoView({behavior:'smooth',block:'center'});}
          else alert('✅ Votre demande a bien été envoyée ! Nous vous répondons sous 24 h.');
        }else{alert('⚠️ Une erreur est survenue. Réessayez ou écrivez à contact@juju-car.ch.');}
        btn.disabled=false;btn.innerHTML=old;
      })
      .catch(()=>{alert('⚠️ Erreur réseau. Réessayez ou écrivez à contact@juju-car.ch.');btn.disabled=false;btn.innerHTML=old;});
  });
});

// année du footer
document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear();});
