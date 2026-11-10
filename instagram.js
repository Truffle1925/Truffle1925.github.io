'use strict';
(() => {
 const slots=[...document.querySelectorAll('[data-instagram-slot]')];
 const configured=[];
 for(const [i,post]of (window.NORTHSTAR_INSTAGRAM_POSTS||[]).entries()){
  if(!slots[i]||!post?.url)continue;
  let url;try{url=new URL(post.url)}catch{continue}
  if(url.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(url.hostname)||!/^\/(p|reel)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname))continue;
  url.hostname='www.instagram.com';url.search='';url.hash='';
  const slot=slots[i];slot.classList.add('is-configured');slot.replaceChildren();
  const fallback=document.createElement('a');fallback.className='instagram-fallback';fallback.href=url.href;fallback.target='_blank';fallback.rel='noopener';fallback.textContent=post.title||'View this Thunderbird post on Instagram ↗';slot.append(fallback);
  configured.push({slot,url:url.href,title:post.title||'Thunderbird update'});
 }
 if(!configured.length)return;
 const consent=document.querySelector('.instagram-consent');consent.hidden=false;
 document.querySelector('#load-instagram').addEventListener('click',event=>{
  event.currentTarget.disabled=true;
  for(const{slot,url,title}of configured){const block=document.createElement('blockquote');block.className='instagram-media';block.setAttribute('data-instgrm-permalink',url);block.setAttribute('data-instgrm-version','14');const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=title+' — view on Instagram ↗';block.append(a);slot.prepend(block)}
  const script=document.createElement('script');script.src='https://www.instagram.com/embed.js';script.async=true;script.onload=()=>{window.instgrm?.Embeds?.process();document.querySelector('#embed-status').textContent='If a post does not appear, use its Instagram link.'};script.onerror=()=>{document.querySelector('#embed-status').textContent='Instagram could not be loaded. The direct post links are still available.'};document.head.append(script);
  document.querySelector('#embed-status').textContent='Loading Instagram posts…';
 },{once:true});
})();
