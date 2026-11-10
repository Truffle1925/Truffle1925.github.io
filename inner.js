'use strict';
(() => {
 const control=document.querySelector('#motion-control');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let saved=false;try{saved=localStorage.getItem('northstar-motion')==='paused'}catch{}
 let paused=saved||preference.matches,frame=0,time=0,last=0;
 const animations=new Set();
 const layers=[...document.querySelectorAll('[data-drift]')];
 const feather=document.querySelector('.hero-feather');
 function position(){document.querySelector('.reading-progress').style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))})`}
 function render(){layers.forEach((el,i)=>el.style.transform=`translate3d(${paused?0:Math.sin(time*.12+i)*14}px,${paused?0:Math.sin(time*.15+i)*10}px,0)`);if(feather)feather.style.transform=`translateY(${paused?0:Math.sin(time*.4)*7}px) rotate(${paused?0:Math.sin(time*.2)*2}deg)`;position()}
 function tick(now){if(paused||document.hidden){frame=0;return}if(now-last>32){time+=Math.min(now-last,70)/1000;last=now;render()}frame=requestAnimationFrame(tick)}
 function mode(){control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Resume motion':'Pause motion');control.querySelector('span').textContent=paused?'▷':'Ⅱ';control.querySelector('.motion-label').textContent=paused?'MOTION OFF':'MOTION ON';document.documentElement.style.scrollBehavior=paused?'auto':'';for(const a of animations)if(paused)a.finish();if(paused){cancelAnimationFrame(frame);frame=0;render()}else if(!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
 control.addEventListener('click',()=>{paused=!paused;saved=paused;try{localStorage.setItem('northstar-motion',paused?'paused':'running')}catch{}mode()});
 preference.addEventListener('change',()=>{paused=saved||preference.matches;mode()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else mode()});
 addEventListener('scroll',position,{passive:true});addEventListener('resize',position,{passive:true});
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);if(!paused&&entry.target.animate){const a=entry.target.animate([{opacity:.25,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.7,.2,1)'});animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a))}}),{threshold:.1});document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el))}
 const menu=document.querySelector('#navigation');const toggle=document.querySelector('.navbar-toggler');
 document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{if(menu.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(menu).hide()}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('show')){bootstrap.Collapse.getOrCreateInstance(menu).hide();toggle.focus()}});
 const dialog=document.querySelector('.image-dialog');let opener;
 if(dialog){document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{opener=button;dialog.querySelector('img').src=button.dataset.lightbox;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('#image-caption').textContent=button.dataset.caption;dialog.showModal()}));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()})}
 document.querySelector('#year').textContent=new Date().getFullYear();mode();
})();
