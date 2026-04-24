// Cursor
  const cur = document.getElementById('custom-cursor');
  document.addEventListener('mousemove', e => { cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px'; });
  document.addEventListener('mouseover', e => { if(e.target.closest('a,button,input,textarea')) cur.classList.add('hover'); });
  document.addEventListener('mouseout',  e => { if(e.target.closest('a,button,input,textarea')) cur.classList.remove('hover'); });

  // Particles
  const cv=document.getElementById('particles-bg'),cx=cv.getContext('2d');
  let W,H;
  function rs(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
  rs();window.addEventListener('resize',rs);
  const pts=Array.from({length:50},()=>mp(true));
  function mp(s){return{x:Math.random()*(W||800),y:s?Math.random()*(H||600):(H||600)+10,r:1+Math.random()*2.1,a:.12+Math.random()*.4,sy:-(0.22+Math.random()*.5),sx:(Math.random()-.5)*.25,wb:Math.random()*Math.PI*2,ws:.005+Math.random()*.015};}
  function dp(){
    cx.clearRect(0,0,W,H);
    pts.forEach((p,i)=>{
      p.wb+=p.ws;p.x+=p.sx+Math.sin(p.wb)*.3;p.y+=p.sy;
      if(p.y<-10)pts[i]=mp(false);
      const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2);
      g.addColorStop(0,`rgba(245,210,80,${p.a})`);g.addColorStop(.5,`rgba(184,149,42,${p.a*.6})`);g.addColorStop(1,'rgba(184,149,42,0)');
      cx.beginPath();cx.arc(p.x,p.y,p.r*2,0,Math.PI*2);cx.fillStyle=g;cx.fill();
    });
    requestAnimationFrame(dp);
  }
  dp();

  // Reveal on scroll
  const obs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting)en.target.classList.add('vis');});},{threshold:.10});
  document.querySelectorAll('.rv,.rl,.rr').forEach(el=>obs.observe(el));
  setTimeout(()=>{ document.querySelectorAll('.hero .rv,.hero .rr').forEach(el=>el.classList.add('vis')); },80);