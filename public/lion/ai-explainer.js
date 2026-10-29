import {sources,regions,craftSteps,rhythms} from './data.js';

const contexts={
  home:{title:'作品说明',question:'请用简洁、准确的语言介绍岭南醒狮的文化特点，以及这个网页可以体验什么。',suggestions:['醒狮和舞狮有什么区别？','六色英雄狮的寓意是什么？']},
  history:{title:'历史简介',question:'请根据可核验资料，简要讲解岭南醒狮的历史脉络；有争议的早期年代请说明不确定性。',suggestions:['南狮和北狮有什么区别？','佛山醒狮有什么特点？']},
  craft:{title:'制作工艺',question:'请讲解岭南醒狮狮头制作的扎、扑、写、装四个步骤，以及各步常见材料。',suggestions:['竹篾骨架有什么作用？','写狮为什么叫“写”？']},
  drums:{title:'鼓点播放器',question:'请讲解醒狮表演中鼓、锣、钹的配合，以及鼓点如何引导狮子的动作；本站鼓点是教学创作，不要称作传统定谱。',suggestions:['鼓点怎么指挥醒狮？','鼓、锣、钹各有什么作用？']},
  agent:{title:'多模态智能体',question:'请介绍醒狮狮头的脸谱寓意和常见制作工艺，并说明不同流派可能有差异。',suggestions:['狮头脸谱有什么寓意？','哪些结论不能只凭照片判断？']}
};
const filmQuestions={
  '竹篾立骨':'请讲解醒狮狮头制作中“扎”这一步：竹篾骨架如何形成轮廓，有什么作用？',
  '裱纸成形':'请讲解醒狮狮头制作中“扑”这一步：为什么要在竹骨上裱纸，常见材料和作用是什么？',
  '落笔传神':'请讲解醒狮狮头制作中“写”这一步：纹样、颜色和脸谱寓意如何关联？不同流派请保留差异。',
  '饰件归位':'请讲解醒狮狮头制作中“装”这一步：绒毛、五官等饰件如何让狮头更传神？'
};
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const craftScene=(step,where)=>({title:`${where} · ${step.word} · ${step.name}`,question:`请讲解眼前的“${step.word} · ${step.name}”工序：${step.detail} 结合可核验资料说明材料、作用及流派差异。`,suggestions:[`“${step.word}”这一步用到什么材料？`,'四道工序如何衔接？'],scene:{kind:'craft',id:step.id}});
const isVisible=node=>{if(!node)return false;const r=node.getBoundingClientRect();return r.bottom>innerHeight*.18&&r.top<innerHeight*.85;};
function visibleRegion(){
  const archive=document.getElementById('regional-lions');if(!isVisible(archive))return null;
  const cards=[...archive.querySelectorAll('.region-card')].filter(isVisible);
  const card=cards.find(x=>x.open)||cards.find(x=>x.matches(':focus-within,:hover'))||cards.sort((a,b)=>Math.abs(a.getBoundingClientRect().top+a.offsetHeight/2-innerHeight*.5)-Math.abs(b.getBoundingClientRect().top+b.offsetHeight/2-innerHeight*.5))[0];
  return regions.find(x=>`region-${x.id}`===card?.id)||null;
}
const current=()=>{
  if(document.body.classList.contains('film-page')){
    const stage=document.getElementById('film-stage')?.textContent||'竹篾立骨';
    const index=Math.max(0,['竹篾立骨','裱纸成形','落笔传神','饰件归位'].indexOf(stage));
    return {...craftScene(craftSteps[index],'影像工坊'),question:filmQuestions[stage]||contexts.craft.question};
  }
  const key=location.hash.slice(1);
  const base=contexts[key]||contexts.home;
  const legend=document.getElementById('lion-dialog');
  if(key==='home'&&legend?.open){const name=legend.querySelector('#legend-dialog-title')?.textContent;return {...base,title:`六色英雄狮 · ${name}`,question:`请根据公开资料介绍${name}的常见色彩寓意，并说明不同狮队的差异。`,suggestions:['人物狮的配色有统一标准吗？','脸谱颜色能确定狮头来历吗？']};}
  if(key==='history'){
    const region=visibleRegion();
    if(region)return {title:`各地流派 · ${region.name}`,question:`请讲解当前展示的${region.name}：${region.quick} 结合公开资料介绍造型与文化特点，并说明展示配图不能确定具体产地或师承。`,suggestions:[`${region.name}有什么特点？`,'南狮和北狮有什么区别？'],scene:{kind:'regions',id:region.id}};
  }
  if(key==='craft'){
    const gallery=document.getElementById('walk-track');
    if(isVisible(gallery)){const word=document.getElementById('walk-word')?.textContent,step=craftSteps.find(x=>x.word===word);if(step)return craftScene(step,'3D 工坊');}
    const word=document.querySelector('.craft-tabs [data-action="craft"].selected b')?.textContent;
    const step=craftSteps.find(x=>x.word===word);if(step)return craftScene(step,'制作工艺');
  }
  if(key==='drums'){const selected=document.querySelector('.drum-patterns .pattern-chip.selected b')?.textContent;const rhythm=rhythms.find(x=>x.name===selected);if(rhythm)return {...base,title:`鼓点互动 · ${rhythm.name}`,question:`请讲解当前的“${rhythm.name}”原创合成教学节奏如何让用户感受醒狮动作；不要把它说成传统狮队的固定鼓谱。`,scene:{kind:'drums',id:rhythm.id}};}
  return base;
};

export function initAIExplainer(){
  if(document.getElementById('ai-explainer'))return;
  const root=el('aside','ai-explainer');root.id='ai-explainer';root.setAttribute('aria-label','智能非遗讲解');
  const trigger=el('button','ai-explainer-trigger');trigger.type='button';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','ai-explainer-panel');trigger.setAttribute('aria-label','打开智能讲解');trigger.innerHTML='<span class="ai-explainer-seal" aria-hidden="true">狮</span><span>智能讲解</span><span aria-hidden="true">✦</span>';
  const panel=el('section','ai-explainer-panel');panel.id='ai-explainer-panel';panel.hidden=true;
  const head=el('div','ai-explainer-head');const identity=el('div','ai-explainer-identity');identity.append(el('small','', '非遗舞狮 · 随行讲解'),el('strong','', '狮遇 · 随行讲解'));
  const close=el('button','ai-explainer-close','×');close.type='button';close.setAttribute('aria-label','关闭智能讲解');head.append(identity,close);
  const body=el('div','ai-explainer-body');const context=el('div','ai-explainer-context');
  const intro=el('p','ai-explainer-intro','正在参观哪一页，我就从哪一页开始讲。也可以问我任何醒狮问题。');
  const quick=el('div','ai-explainer-quick');const messages=el('div','ai-explainer-messages');messages.setAttribute('role','log');messages.setAttribute('aria-live','polite');
  body.append(context,intro,quick,messages);
  const form=el('form','ai-explainer-form');const input=el('textarea','');input.rows=2;input.maxLength=1600;input.placeholder='问我醒狮的故事…';input.setAttribute('aria-label','输入醒狮讲解问题');
  const send=el('button','ai-explainer-send','发送 ↗');send.type='submit';form.append(input,send);
  const foot=el('p','ai-explainer-foot','回答附资料来源 · AI 内容请结合原始资料判断');
  panel.append(head,body,form,foot);root.append(trigger,panel);document.body.append(root);
  let history=[],busy=false,controller=null;
  const refresh=()=>{
    const info=current();context.textContent=`当前场景 / ${info.title}`;
    quick.replaceChildren();
    const explain=el('button','ai-explainer-pill ai-explainer-primary','讲解当前画面 ↗');explain.type='button';explain.addEventListener('click',()=>{const scene=current();ask(scene.question,`讲解：${scene.title}`,scene.scene);});quick.append(explain);
    for(const question of info.suggestions){const button=el('button','ai-explainer-pill',question);button.type='button';button.addEventListener('click',()=>ask(question,question,current().scene));quick.append(button);}
  };
  const open=()=>{panel.hidden=false;trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-label','关闭智能讲解');refresh();input.focus();};
  const shut=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','打开智能讲解');window.speechSynthesis?.cancel();trigger.focus();};
  trigger.addEventListener('click',()=>panel.hidden?open():shut());close.addEventListener('click',shut);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)shut();});
  addEventListener('hashchange',()=>{if(!panel.hidden)refresh();});
  const syncContext=()=>{if(!panel.hidden&&context.textContent!==`当前场景 / ${current().title}`)refresh();};
  let queued=false;const scheduleSync=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncContext();});};
  addEventListener('scroll',scheduleSync,{passive:true});
  document.addEventListener('click',scheduleSync);
  document.addEventListener('focusin',scheduleSync);
  document.addEventListener('pointerover',event=>{if(event.target.closest('.region-card,.legend-card'))scheduleSync();});
  const bubble=(text,who)=>{const item=el('article',`ai-explainer-message ${who}`);item.textContent=text;messages.append(item);messages.scrollTop=messages.scrollHeight;return item;};
  async function ask(question,label=question,scene=current().scene){
    if(busy||!question.trim())return;
    bubble(label,'visitor');input.value='';
    const pending=bubble('正在检索资料并整理讲解…','guide loading');busy=true;send.disabled=true;controller=new AbortController();
    const timer=setTimeout(()=>controller?.abort(),55000);
    try{
      const response=await fetch('/api/lion-agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,scene,history:history.slice(-4)}),signal:controller.signal});
      const data=await response.json();
      if(!response.ok||typeof data.answer!=='string'||!Array.isArray(data.documents))throw Error(data.message||'讲解暂时无法完成，请稍后重试。');
      pending.classList.remove('loading');pending.replaceChildren();
      pending.append(el('small','ai-explainer-origin',data.source==='ai'?'AI 讲解 · 资料增强':'资料摘述 · AI 本次未完成'));
      if(data.notice)pending.append(el('p','ai-explainer-notice',data.notice));
      pending.append(el('p','',data.answer));
      if(data.observations?.length){const facts=el('div','ai-explainer-evidence');facts.append(el('b','','观察依据'));for(const item of data.observations)facts.append(el('span','',item));pending.append(facts);}
      if(data.uncertainty?.length){const caveat=el('div','ai-explainer-caveat');caveat.append(el('b','','仍需核实'));for(const item of data.uncertainty)caveat.append(el('span','',item));pending.append(caveat);}
      if(scene?.kind==='regions')pending.append(el('p','ai-explainer-boundary','展示配图为文化影像，不能据此确认狮头的产地、师承或真伪。'));
      const refs=el('div','ai-explainer-sources');
      for(const doc of data.documents.slice(0,4)){
        const source=sources[doc.source];if(!source)continue;
        const entry=el('details','ai-source-entry');entry.append(el('summary','',doc.title||source.name),el('p','',doc.text||''));if(doc.scope)entry.append(el('small','',`适用范围：${doc.scope}`));const link=el('a','',`原始资料 · ${source.name} ↗`);link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';entry.append(link);refs.append(entry);
      }
      if(refs.children.length)pending.append(refs);
      if(Array.isArray(data.trace)){const steps=data.trace.filter(x=>['plan','search_heritage','get_region','get_craft_step','get_rhythm','validate','fallback'].includes(x.tool));const details=el('details','ai-explainer-trace');details.append(el('summary','','本次讲解依据 · '+steps.length+' 步'));const list=el('ol','');for(const step of steps){const item=el('li','');item.append(el('b','',({plan:'识别提问',search_heritage:'资料检索',get_region:'流派工具',get_craft_step:'工艺工具',get_rhythm:'鼓点工具',validate:'结果校验',fallback:'资料兜底'})[step.tool]),el('span','',step.detail));list.append(item);}details.append(list);pending.append(details);}
      const voice=el('button','ai-explainer-voice','▷ 朗读讲解');voice.type='button';voice.addEventListener('click',()=>{
        if(!window.speechSynthesis){voice.textContent='此浏览器不支持朗读';return;}
        if(speechSynthesis.speaking){speechSynthesis.cancel();return;}
        const utterance=new SpeechSynthesisUtterance(data.answer);utterance.lang='zh-CN';utterance.rate=.94;speechSynthesis.speak(utterance);
      });pending.append(voice);
      history.push({question,answer:data.answer});history=history.slice(-8);
    }catch(error){pending.classList.remove('loading');pending.textContent=error.name==='AbortError'?'等待超时，请重试。':error.message;}
    finally{clearTimeout(timer);controller=null;busy=false;send.disabled=false;messages.scrollTop=messages.scrollHeight;}
  }
  form.addEventListener('submit',event=>{event.preventDefault();ask(input.value.trim());});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();form.requestSubmit();}});
  refresh();
}
