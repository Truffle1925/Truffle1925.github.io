'use strict';
(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const button=document.querySelector('#motion-control');
 let optedOut=false;
 try{optedOut=localStorage.getItem('northstar-motion')==='paused'}catch{}
 let paused=optedOut||reduced.matches;
 let frame=0,lastTime=0,elapsed=0,previousTime=0,visible=true;
 const animations=new Set();
 const progress=document.querySelector('.reading-progress');
 const hero=document.querySelector('.hero');
 const orbits=document.querySelector('.hero-orbits');
 const rotor=document.querySelector('.orbit-rotor');
 const star=document.querySelector('.hero-star');
 const sun=document.querySelector('.sun-disc');
 const globe=document.querySelector('.globe-rotor');
 const blueprint=document.querySelector('.blueprint-rotor');
 const topoModules=[...document.querySelectorAll('.module-topo img,.rail-topo img')];
 const parallax=[...document.querySelectorAll('[data-parallax]')];
 const chapters=[...document.querySelectorAll('[data-chapter]')];
 const chapterLinks=[...document.querySelectorAll('.chart-navigation a')];
 let chapter=0,journey=0,targetX=0,targetY=0,pointerX=0,pointerY=0;
 const chart=document.querySelector('#navigation-chart');
 const ctx=chart.getContext('2d');
 const contour=document.querySelector('#contour-field');
 const contourCtx=contour.getContext('2d');
 const topology=new Image();
 const specimenImage=document.querySelector('.field-botanical>img');
 const specimenCaption=document.querySelector('#specimen-caption');
 const specimens=[{src:'assets/teton-flora.jpg',alt:'Silver lupine photographed in Grand Teton National Park',caption:'FIG. 02<br>SILVER LUPINE<br><i>A field study</i>'},{src:'assets/teton-fauna.jpg',alt:'Bull elk standing in dried grass in Grand Teton National Park',caption:'FIG. 03<br>BULL ELK<br><i>A field study</i>'}];
 let specimenIndex=0;
 document.querySelector('#specimen-next').addEventListener('click',()=>{
  specimenIndex=(specimenIndex+1)%specimens.length;
  const next=specimens[specimenIndex];specimenImage.src=next.src;specimenImage.alt=next.alt;specimenCaption.innerHTML=next.caption;
  if(!paused&&specimenImage.animate){const a=specimenImage.animate([{opacity:.15},{opacity:.9}],{duration:500,easing:'ease-out'});animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a))}
 });
 topology.src='assets/GrandTopo.png';
 const scenes=new Map([[hero,true],[chart,true],[contour,true],[sun,true],[globe,true],[blueprint,true]]);
 let chartSize={w:0,h:0},contourSize={w:0,h:0};

 function sizeCanvas(canvas){
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
  const context=canvas.getContext('2d');context.setTransform(dpr,0,0,dpr,0,0);
  return{w:rect.width,h:rect.height};
 }
 function resize(){chartSize=sizeCanvas(chart);contourSize=sizeCanvas(contour);if(paused)render(0)}
 function mode(){
  root.style.scrollBehavior=paused?'auto':'';
  document.body.classList.toggle('motion-paused',paused);
  button.setAttribute('aria-pressed',String(paused));
  button.setAttribute('aria-label',paused?'Resume motion':'Pause motion');
  button.querySelector('span').textContent=paused?'▷':'Ⅱ';
  button.querySelector('.motion-label').textContent=paused?'MOTION OFF':'MOTION ON';
  for(const animation of animations){paused?animation.finish():animation.play()}
  if(paused){cancelAnimationFrame(frame);frame=0;render(0)}else start();
 }
 button.addEventListener('click',()=>{
  paused=!paused;optedOut=paused;
  try{localStorage.setItem('northstar-motion',paused?'paused':'running')}catch{}
  mode();
 });
 reduced.addEventListener('change',()=>{paused=reduced.matches||optedOut;mode()});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else{cancelAnimationFrame(frame);frame=0;previousTime=0}});

 // Motion is applied in JavaScript; content stays visible if scripting is unavailable.
 function reveal(element,index=0){
  if(paused||!element.animate)return;
  const a=element.animate([{opacity:.2,transform:'translate3d(0,38px,0)',clipPath:'inset(0 0 10% 0)'},{opacity:1,transform:'translate3d(0,0,0)',clipPath:'inset(0)'}],{duration:800,delay:(index%3)*90,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
  animations.add(a);a.finished.then(()=>{animations.delete(a);a.cancel()}).catch(()=>animations.delete(a));
 }
 const revealElements=[...document.querySelectorAll('[data-reveal]')];
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){reveal(entry.target,revealElements.indexOf(entry.target));observer.unobserve(entry.target)}})},{threshold:.12});
  revealElements.forEach(el=>observer.observe(el));
  const sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>scenes.set(e.target,e.isIntersecting)),{rootMargin:'100px'});
  for(const el of scenes.keys())if(el)sceneObserver.observe(el);
 }
 if(!paused)document.querySelectorAll('.headline-line').forEach((line,index)=>{
  if(!line.animate)return;
  const a=line.animate([{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'translateY(0)'}],{duration:900,delay:120+index*120,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
  animations.add(a);a.finished.then(()=>{animations.delete(a);a.cancel()}).catch(()=>animations.delete(a));
 });
 hero.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||paused)return;const r=hero.getBoundingClientRect();targetX=(event.clientX-r.left)/r.width-.5;targetY=(event.clientY-r.top)/r.height-.5},{passive:true});
 hero.addEventListener('pointerleave',()=>{targetX=targetY=0},{passive:true});

 function updateReading(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  progress.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`;
  const anchor=innerWidth<768?Math.min(innerHeight*.64,430):innerHeight*.5;
  let selected=0;
  chapters.forEach((el,i)=>{if(el.getBoundingClientRect().top<anchor)selected=i});
  const rect=document.querySelector('.story-chapters').getBoundingClientRect();
  journey=Math.max(0,Math.min(1,(anchor-rect.top)/Math.max(1,rect.height-innerHeight*.4)));
  if(selected!==chapter){chapter=selected;chapterLinks.forEach((link,i)=>{if(i===chapter)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current')});document.querySelector('#chart-index').textContent=`0${chapter+1} / 03`}
  document.querySelector('#chart-bearing').textContent=`BEARING ${String(Math.round(45+journey*270)).padStart(3,'0')}°`;
 }

 function drawChart(t){
  const{w,h}=chartSize;if(!w||!h)return;
  ctx.clearRect(0,0,w,h);
  const compact=innerWidth<768,cx=compact?w*.25:w*.5,cy=compact?h*.48:h*.4;
  const radius=compact?Math.min(w*.19,90):Math.min(w*.38,h*.3);
  ctx.strokeStyle='rgba(244,237,224,.28)';ctx.lineWidth=.7;
  // A small celestial projection, deliberately geometric rather than a geographic map.
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,radius*i/4,0,Math.PI*2);ctx.stroke()}
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;const major=i%4===0;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*radius,cy+Math.sin(a)*radius);ctx.lineTo(cx+Math.cos(a)*(radius+(major?9:4)),cy+Math.sin(a)*(radius+(major?9:4)));ctx.stroke()}
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.025+journey*.7);
  ctx.strokeStyle='rgba(244,237,224,.18)';ctx.setLineDash([2,6]);ctx.beginPath();ctx.ellipse(0,0,radius*.46,radius*1.12,Math.PI*.2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(-radius*1.2,0);ctx.lineTo(radius*1.2,0);ctx.moveTo(0,-radius*1.2);ctx.lineTo(0,radius*1.2);ctx.stroke();ctx.restore();
  const angle=-Math.PI/2+(journey*.8+t*.012);
  ctx.fillStyle='#d9ff2e';ctx.beginPath();ctx.arc(cx+Math.cos(angle)*radius,cy+Math.sin(angle)*radius,3.5,0,Math.PI*2);ctx.fill();
  if(!compact){
   ctx.font='9px Courier New';ctx.fillStyle='rgba(244,237,224,.6)';ctx.textAlign='center';
   [['N',0,-radius-20],['E',radius+23,0],['S',0,radius+23],['W',-radius-23,0]].forEach(([s,x,y])=>ctx.fillText(s,cx+x,cy+y));
   // The voyage advances with normal page scrolling, without capturing the scroll input.
   ctx.strokeStyle='#d9ff2e';ctx.lineWidth=1.4;ctx.setLineDash([3,5]);ctx.beginPath();
   const points=110,amount=Math.max(.05,journey);
   for(let i=0;i<points*amount;i++){const p=i/points;const x=w*.12+p*w*.75,y=h*.8-Math.sin(p*Math.PI*1.7)*28-p*48;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
   ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle='rgba(244,237,224,.5)';ctx.textAlign='left';ctx.font='8px Courier New';ctx.fillText('THE ROUTE IS STILL BEING DRAWN.',w*.12,h*.86);
  }
 }
 function drawContours(t){
  const{w,h}=contourSize;if(!w||!h||!topology.complete||!topology.naturalWidth)return;
  contourCtx.clearRect(0,0,w,h);contourCtx.save();
  const ih=h*4,iw=ih*topology.naturalWidth/topology.naturalHeight;
  const drift=paused?0:Math.sin(t*.09)*20;
  for(let x=-iw;x<w+iw;x+=iw*.8)contourCtx.drawImage(topology,x+drift,-h*1.6,iw,ih);
  contourCtx.globalCompositeOperation='source-in';contourCtx.fillStyle='#d9ff2e';contourCtx.fillRect(0,0,w,h);contourCtx.restore();
 }
 function render(t){
  updateReading();
  const now=paused?0:t;
  pointerX+=(targetX-pointerX)*.045;pointerY+=(targetY-pointerY)*.045;
  if(scenes.get(hero)||paused){
   orbits.style.transform=`translate3d(${paused?0:pointerX*17}px,${paused?0:pointerY*14}px,0)`;
   rotor.style.transform=`rotate(${now*3}deg)`;
   star.style.opacity=String(paused?1:.8+Math.sin(now*.8)*.2);
  }
  for(const image of parallax){const r=image.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;const shift=paused?0:Math.max(-45,Math.min(45,(innerHeight*.4-r.top)*Number(image.dataset.parallax)));image.style.transform=`translate3d(0,${shift}px,0)`}
  if(scenes.get(sun)||paused)sun.style.transform=`translate3d(${Math.sin(now*.3)*7}px,${Math.sin(now*.45)*6}px,0)`;
  if(scenes.get(globe)||paused)globe.style.transform=`rotate(${Math.sin(now*.12)*5}deg)`;
  if(scenes.get(blueprint)||paused)blueprint.style.transform=`rotate(${now*5}deg)`;
  topoModules.forEach((el,i)=>el.style.transform=`translate3d(${-8+Math.sin(now*.11+i)*8}px,${-10+Math.cos(now*.13+i)*10}px,0)`);
  if(scenes.get(chart)||paused)drawChart(now);
  if(scenes.get(contour)||paused)drawContours(now);
 }
 function tick(time){
  if(paused||!visible){frame=0;return}
  if(time-lastTime>32){if(previousTime)elapsed+=Math.min(time-previousTime,70)/1000;previousTime=time;lastTime=time;render(elapsed)}
  frame=requestAnimationFrame(tick);
 }
 function start(){if(!frame&&!paused&&visible){previousTime=0;frame=requestAnimationFrame(tick)}}
 // Paused motion still updates the reading position and story state on scroll.
 let scrollFrame=0;
 addEventListener('scroll',()=>{if(!paused||scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{render(0);scrollFrame=0})},{passive:true});
 addEventListener('resize',resize,{passive:true});
 topology.addEventListener('load',()=>drawContours(paused?0:elapsed));
 document.querySelectorAll('#navigation a').forEach(link=>link.addEventListener('click',()=>{const nav=document.querySelector('#navigation');if(window.bootstrap&&nav.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(nav).hide()}));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){const nav=document.querySelector('#navigation');if(window.bootstrap&&nav.classList.contains('show')){bootstrap.Collapse.getOrCreateInstance(nav).hide();document.querySelector('.navbar-toggler').focus()}}});
 document.querySelector('#year').textContent=new Date().getFullYear();
 resize();mode();
})();
