// A single continuous route: scroll controls camera distance, not scene replacement.
const stations=[
 {word:'扎',name:'竹篾立骨',material:'竹篾 · 细绳',image:'/lion/gallery-zha.webp',detail:'手艺人弯竹成弧，扎出额、眼、鼻、颌的承重骨架。空透的竹篾已定下狮子的体态。',observe:'看眼圈与额头的弧线。'},
 {word:'扑',name:'层层裱纸',material:'纸料 · 浆糊 · 毛刷',image:'/lion/gallery-pu.webp',detail:'纸张逐层裱在竹骨上，形成轻而坚实的纸胚。骨架从轮廓变成可以落笔的狮头。',observe:'看纸张如何包裹仍然可见的竹篾。'},
 {word:'写',name:'落笔写狮',material:'画笔 · 朱红 · 石青 · 金彩',image:'/lion/gallery-xie.webp',detail:'师傅沿着眉眼落笔，写出脸谱纹样。颜色与笔势，让同一副纸胚有了不同神情。',observe:'看尚未安装绒毛的彩绘眉眼。'},
 {word:'装',name:'装饰成狮',material:'绒毛 · 绒球 · 额饰',image:'/lion/gallery-zhuang.webp',detail:'绒毛、绒球和额饰最后归位。一只醒狮从竹骨、纸胚、彩绘走向完整形象。',observe:'回望四道工序，看看狮头如何一步步添形。'}
];
const stepDepth=1050;
let entered=false,active=0,teardown=null,preloaded=false;
const button=(label,action,cls='',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;

function entrance(){return `<div class="gallery-entrance"><img src="/lion/gallery-zha.webp" alt="匠人在工坊扎制醒狮竹篾骨架" loading="lazy"><div class="gallery-doorway"><span>01 — 04 / 扎 · 扑 · 写 · 装</span><h3>循工序前行<br>见醒狮成形</h3><p>向前滚动，镜头穿行于匠作展线。</p>${button('进入工艺展线　↗','gallery-enter','gallery-enter-button')}</div></div>`;}

function world(){return `<div class="walk-track" id="walk-track"><div class="walk-sticky" id="gallery-viewport" tabindex="0" role="region" aria-label="醒狮制作连续展线。向下滚动前进，向上滚动后退。">
  <div class="walk-scene" aria-hidden="true"><div class="walk-world" id="walk-world">
    <div class="walk-plane walk-floor"></div><div class="walk-plane walk-ceiling"></div><div class="walk-plane walk-wall walk-wall-left"></div><div class="walk-plane walk-wall walk-wall-right"></div>
    ${stations.map((s,i)=>`<div class="walk-bay" style="--bay-z:${-i*stepDepth-560}px"><i></i><i></i><i></i></div><figure class="walk-exhibit ${i%2?'is-left':'is-right'}" style="--x:${i%2?-345:345}px;--z:${-i*stepDepth-670}px;--angle:${i%2?12:-12}deg"><span>0${i+1} / 狮头匠作</span><img src="${s.image}" alt=""><figcaption>${s.word} · ${s.name}</figcaption></figure><div class="walk-floor-mark" style="--z:${-i*stepDepth-430}px">0${i+1}</div>`).join('')}
  </div></div><div class="walk-vignette" aria-hidden="true"></div><img class="walk-reduced-image" src="${stations[active].image}" alt="手艺人制作狮头的工序影像">
  <div class="walk-chrome"><div class="walk-top"><span>狮遇 / 一只狮头的诞生</span><span>连续展线 · 0<span id="walk-count">${active+1}</span> / 04</span>${button('退出 ×','gallery-exit','walk-exit')}</div><div class="walk-caption ${active%2?'on-right':''}" id="walk-caption" aria-live="polite"><small id="walk-material">${stations[active].material}</small><h3><b id="walk-word">${stations[active].word}</b><span id="walk-name">${stations[active].name}</span></h3><p id="walk-detail">${stations[active].detail}</p><em id="walk-observe">${stations[active].observe}</em></div><div class="walk-bottom"><div class="walk-progress"><i id="walk-progress"></i></div><div class="walk-route" aria-label="工序路线">${stations.map((s,i)=>button(`<span>0${i+1}</span><b>${s.word}</b>`,'gallery-jump',i===active?'active':'',`data-gallery-index="${i}" aria-current="${i===active?'step':'false'}"`)).join('')}</div><span class="walk-hint">SCROLL TO WALK　↓</span></div></div>
 </div></div><div class="walk-after"><p>从竹骨到狮魂，四道工序在一条展线上相连。</p><div>${button('← 回看上一道','gallery-prev','walk-step',active===0?'disabled':'')}${button('走向下一道 →','gallery-next','walk-step primary',active===3?'disabled':'')}</div></div>`;}

export function galleryMarkup(){return `<section id="craft-gallery" class="craft-gallery" aria-labelledby="gallery-title"><div class="gallery-heading"><span>CRAFT GALLERY / CONTINUOUS WALKTHROUGH</span><h2 id="gallery-title">走进匠人的工坊</h2><p>沿一条展线前行，从竹篾骨架看见醒狮一点点成形。</p></div><div id="gallery-root">${entered?world():entrance()}</div><p class="gallery-disclaimer">匠人场景为 AI 生成的工艺示意影像；具体材料和做法因作坊与师承而异。</p></section>`;}

function preload(){if(preloaded)return;preloaded=true;stations.forEach(s=>{const img=new Image();img.src=s.image;});}
function routeTo(i){const track=document.querySelector('#walk-track'),stage=document.querySelector('#gallery-viewport');if(!track||!stage)return;const max=track.offsetHeight-stage.offsetHeight;const top=track.getBoundingClientRect().top+scrollY;scrollTo({top:top+Math.max(0,Math.min(3,i))/3*max,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function setActive(i){if(i===active)return;active=i;const s=stations[i],root=document.querySelector('#gallery-root');if(!root)return;
 root.querySelector('#walk-count').textContent=String(i+1);root.querySelector('#walk-material').textContent=s.material;root.querySelector('#walk-word').textContent=s.word;root.querySelector('#walk-name').textContent=s.name;root.querySelector('#walk-detail').textContent=s.detail;root.querySelector('#walk-observe').textContent=s.observe;root.querySelector('#walk-caption').classList.toggle('on-right',i%2===1);
 root.querySelector('.walk-reduced-image').src=s.image;root.querySelector('.walk-reduced-image').alt=`手艺人进行${s.name}工序`;
 root.querySelectorAll('.walk-route button').forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-current',n===i?'step':'false');});
 root.querySelector('[data-action="gallery-prev"]').disabled=i===0;root.querySelector('[data-action="gallery-next"]').disabled=i===3;
}

export function galleryAction(action,element){const root=document.querySelector('#gallery-root');if(!root)return false;
 if(action==='gallery-enter'){entered=true;active=0;preload();root.innerHTML=world();requestAnimationFrame(()=>{const stage=document.querySelector('#gallery-viewport');stage?.focus({preventScroll:true});routeTo(0);teardown?.refresh();});return true;}
 if(action==='gallery-exit'){document.querySelector('.gallery-heading')?.scrollIntoView({behavior:'instant',block:'start'});entered=false;root.innerHTML=entrance();root.querySelector('button')?.focus({preventScroll:true});return true;}
 if(!entered)return false;
 if(action==='gallery-jump')routeTo(Number(element?.dataset.galleryIndex)||0);
 else if(action==='gallery-next')routeTo(active+1);
 else if(action==='gallery-prev')routeTo(active-1);
 else return false;
 return true;
}

export function initGallery(){let raf=0,current=0,target=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const tick=()=>{raf=0;const world=document.querySelector('#walk-world');if(!world)return;current+=((target-current)*(reduced?1:.19));if(Math.abs(target-current)<.3)current=target;
 const phase=current/stepDepth,yaw=-8*Math.cos(phase*Math.PI);world.style.transform=`rotateY(${yaw.toFixed(2)}deg) translateZ(${current.toFixed(1)}px)`;
 world.querySelectorAll('.walk-exhibit').forEach((ex,i)=>{const distance=i*stepDepth+670-current;ex.style.opacity=String(Math.max(0,Math.min(1,(distance-70)/230)));});
 if(current!==target)raf=requestAnimationFrame(tick);
 };
 const refresh=()=>{const track=document.querySelector('#walk-track'),stage=document.querySelector('#gallery-viewport');if(!track||!stage)return;const top=track.getBoundingClientRect().top+scrollY,max=Math.max(1,track.offsetHeight-stage.offsetHeight),p=Math.max(0,Math.min(1,(scrollY-top)/max));target=p*stepDepth*3;const bar=document.querySelector('#walk-progress');if(bar)bar.style.transform=`scaleX(${p})`;setActive(Math.min(3,Math.round(p*3)));if(!raf)raf=requestAnimationFrame(tick);};
 const key=e=>{if(!entered||!document.activeElement?.closest('#craft-gallery')||e.target.closest('button,input,textarea'))return;const k=e.key.toLowerCase();if(['w','arrowdown','arrowright'].includes(k)){e.preventDefault();routeTo(active+1);}else if(['s','arrowup','arrowleft'].includes(k)){e.preventDefault();routeTo(active-1);}};
 addEventListener('scroll',refresh,{passive:true});addEventListener('resize',refresh,{passive:true});addEventListener('keydown',key);teardown={refresh};refresh();
 return()=>{removeEventListener('scroll',refresh);removeEventListener('resize',refresh);removeEventListener('keydown',key);cancelAnimationFrame(raf);teardown=null;};
}
