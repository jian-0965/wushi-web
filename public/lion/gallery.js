const stations = [
  {word:'扎',name:'竹篾立骨',material:'竹篾 · 细绳',image:'/lion/gallery-zha.webp',detail:'手艺人弯竹成弧，扎出额、眼、鼻、颌的承重骨架。一根根竹篾交错，决定狮头的体态与轻重。',observe:'先看眼圈和额头：空透的竹骨，已经定下狮子的神情。'},
  {word:'扑',name:'层层裱纸',material:'纸料 · 浆糊 · 毛刷',image:'/lion/gallery-pu.webp',detail:'纸张裱贴在竹骨之上，逐层形成可以上色的狮头外壳。纸层厚薄要兼顾坚固与舞动时的重量。',observe:'留意露出的竹篾：纸胚正一点点包裹原本空透的骨架。'},
  {word:'写',name:'落笔写狮',material:'画笔 · 朱红 · 石青 · 金彩',image:'/lion/gallery-xie.webp',detail:'师傅在纸胚上勾眉眼、写纹样。醒狮制作里，彩绘常称“写狮”；配色和纹路塑造不同的狮貌。',observe:'眉、眼、额纹已显现，仍能看见尚未安装饰件的边缘。'},
  {word:'装',name:'装饰成狮',material:'绒毛 · 绒球 · 额饰',image:'/lion/gallery-zhuang.webp',detail:'最后装上绒毛、绒球、额饰等部件，让眉眼更鲜活。一只醒狮从可见的竹骨走向可舞的完整形象。',observe:'从骨架走到成品，再回望四道工序里每一次“添形”。'}
];

let entered=false, station=0, preloaded=false;

function preload(){if(preloaded)return;preloaded=true;stations.forEach(x=>{const img=new Image();img.src=x.image;});}

function theater(){const x=stations[station],next=stations[station+1];return `<div class="gallery-theater" data-station="${station}">
  <div class="gallery-bar"><span>狮遇 / 匠作展馆</span><span>第 0${station+1} 站 / 04</span>${button('退出展馆 ×','gallery-exit','gallery-exit')}</div>
  <div class="gallery-viewport" id="gallery-viewport" tabindex="0" role="region" aria-label="3D 匠作展馆，第 ${station+1} 站：${x.name}。按 W、上箭头或右箭头向前，按 S、下箭头或左箭头后退。">
    <div class="gallery-room" aria-hidden="true"><div class="gallery-ceiling"></div><div class="gallery-floor"></div><div class="gallery-left-wall"></div><div class="gallery-right-wall"></div><div class="gallery-back-wall"></div><div class="gallery-left-light"></div><div class="gallery-right-light"></div><div class="gallery-path"></div></div>
    <div class="gallery-artwork" key="${station}"><span class="gallery-artwork-top">醒狮匠作 · 工序影像</span><img src="${x.image}" alt="生成影像：手艺人进行${x.name}工序" fetchpriority="high"><span class="gallery-artwork-bottom">0${station+1}　${x.word} / ${x.name}</span></div>
    <div class="gallery-foreground" aria-hidden="true"><i></i><i></i></div>
    <span class="gallery-space-mark" aria-hidden="true">匠<br>作</span>
    <div class="gallery-depth" aria-hidden="true">${stations.map((_,i)=>`<i class="${i===station?'current':''}"></i>`).join('')}</div>
  </div>
  <div class="gallery-console"><div class="gallery-caption" aria-live="polite"><span>0${station+1} / 04　${x.material}</span><h3>${x.word} <small>${x.name}</small></h3><p>${x.detail}</p><em>观察点　${x.observe}</em></div><div class="gallery-controls">${button('← 往回走','gallery-prev','gallery-control',station===0?'disabled':'')}${button(next?`向前走 · ${next.word} →`:'回到起点 ↺',next?'gallery-next':'gallery-reset','gallery-control primary')}</div></div>
  <div class="gallery-route" aria-label="展馆路线">${stations.map((s,i)=>button(`<span>0${i+1}</span><b>${s.word}</b><small>${s.name}</small>`,'gallery-jump',i===station?'active':'',`data-gallery-index="${i}" aria-current="${i===station?'step':'false'}"`)).join('')}</div>
  <p class="gallery-key-hint">W / ↑ / → 前进　·　S / ↓ / ← 后退　·　画面内滚轮或滑动也可行走</p>
</div>`;}

function button(label,action,cls='',extra=''){return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;}

export function galleryMarkup(){return `<section id="craft-gallery" class="craft-gallery" aria-labelledby="gallery-title"><div class="gallery-heading"><span>CRAFT GALLERY / 3D EXHIBITION</span><h2 id="gallery-title">走进匠人的工坊</h2><p>沿着展线向前，从一副竹篾骨架，见证一只醒狮的诞生。</p></div><div id="gallery-root">${entered?theater():`<div class="gallery-entrance"><img src="/lion/gallery-zha.webp" alt="匠人在工坊扎制醒狮竹篾骨架" loading="lazy"><div class="gallery-doorway"><span>01 — 04 / 扎 · 扑 · 写 · 装</span><h3>一步一工序<br>一步见狮形</h3><p>四站沉浸式工艺展线</p>${button('进入 3D 展馆　↗','gallery-enter','gallery-enter-button')}</div></div>`}</div><p class="gallery-disclaimer">展馆中的匠人场景为 AI 生成的工艺示意影像；具体材料、做法因作坊与师承而异。</p></section>`;}

function update(focus=true){const root=document.querySelector('#gallery-root');if(!root)return;root.innerHTML=entered?theater():`<div class="gallery-entrance"><img src="/lion/gallery-zha.webp" alt="匠人在工坊扎制醒狮竹篾骨架" loading="lazy"><div class="gallery-doorway"><span>01 — 04 / 扎 · 扑 · 写 · 装</span><h3>一步一工序<br>一步见狮形</h3><p>四站沉浸式工艺展线</p>${button('进入 3D 展馆　↗','gallery-enter','gallery-enter-button')}</div></div>`;
 if(focus&&entered)document.querySelector('#gallery-viewport')?.focus({preventScroll:true});
}

export function galleryAction(action,element){if(action==='gallery-enter'){entered=true;station=0;preload();update();document.querySelector('#craft-gallery')?.scrollIntoView({behavior:'smooth',block:'start'});return true;}
 if(action==='gallery-exit'){entered=false;update(false);document.querySelector('.gallery-enter-button')?.focus({preventScroll:true});return true;}
 if(!entered)return false;
 const previous=station;
 if(action==='gallery-next')station=Math.min(3,station+1);
 else if(action==='gallery-prev')station=Math.max(0,station-1);
 else if(action==='gallery-reset')station=0;
 else if(action==='gallery-jump')station=Math.max(0,Math.min(3,Number(element?.dataset.galleryIndex)||0));
 else return false;
 if(previous!==station)update();return true;
}

export function initGallery(){const section=document.querySelector('#craft-gallery');if(!section)return()=>{};
 let wheelAt=0,startY=0;
 const wheel=e=>{if(!e.target.closest('#gallery-viewport')||Math.abs(e.deltaY)<12)return;const now=Date.now();if(now-wheelAt<520){e.preventDefault();return;}const action=e.deltaY>0?'gallery-next':'gallery-prev';if(station===3&&e.deltaY>0||station===0&&e.deltaY<0)return;e.preventDefault();wheelAt=now;galleryAction(action);};
 const touchStart=e=>{if(e.target.closest('#gallery-viewport'))startY=e.touches[0]?.clientY||0;};
 const touchEnd=e=>{if(!e.target.closest('#gallery-viewport')||!startY)return;const diff=startY-(e.changedTouches[0]?.clientY||0);startY=0;if(Math.abs(diff)>55)galleryAction(diff>0?'gallery-next':'gallery-prev');};
 const key=e=>{if(!document.querySelector('#gallery-viewport')||!document.activeElement?.closest('#craft-gallery'))return;if(e.target.closest('button,input,textarea'))return;const k=e.key.toLowerCase();if(['w','arrowup','arrowright'].includes(k)){e.preventDefault();galleryAction('gallery-next');}else if(['s','arrowdown','arrowleft'].includes(k)){e.preventDefault();galleryAction('gallery-prev');}};
 section.addEventListener('wheel',wheel,{passive:false});section.addEventListener('touchstart',touchStart,{passive:true});section.addEventListener('touchend',touchEnd,{passive:true});window.addEventListener('keydown',key);
 return()=>{section.removeEventListener('wheel',wheel);section.removeEventListener('touchstart',touchStart);section.removeEventListener('touchend',touchEnd);window.removeEventListener('keydown',key);};
}
