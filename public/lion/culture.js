const instruments=[
 {icon:'鼓',name:'牛皮大鼓',role:'主令 · 起势与情绪',teaser:'厚重鼓声，掌控醒狮的步伐与情绪。',text:'醒狮大鼓多用牛皮鼓面、实木鼓身，传统演出常见直径一尺八。鼓手以手腕发力，敲鼓心与鼓边形成不同音色，控制狮子的步伐、进退与情绪。'},
 {icon:'锣',name:'高边铜锣',role:'呼应 · 起势与收势',teaser:'开阔锣声，落在仪式起势与高潮。',text:'铜锣音色开阔厚重，常在点睛、采青、拜礼等关键节点响起，烘托仪式高潮。行规讲究鼓先起，锣与钹不能抢在鼓前发声。'},
 {icon:'钹',name:'铜钹',role:'衬托 · 承接与填拍',teaser:'清亮钹声，承接节奏、补足留白。',text:'铜钹清亮通透，穿插在鼓点间隙，承接鼓声、呼应铜锣，填补节奏留白，让鼓乐热闹而有层次。'}
];
const rhythms=[
 ['三星鼓','基础鼓法','悠闲巡游 · 慢慢探看','节奏简洁沉稳，是入门基础鼓谱。常配合狮子缓步巡场、四处探看、慢慢搜寻青物。'],
 ['五星鼓','又称梅花鼓','嬉戏玩耍 · 灵动试探','节奏错落婉转、起伏更多，适合表现狮子嬉戏、玩耍与试探时柔和灵动的状态。'],
 ['七星鼓','经典鼓法','行狮采青 · 张弛有度','南狮流传最广的经典鼓法。民间相传与北斗七星有关，清末冯庚长结合“狮型猫步”改良，常作为采青套路的节奏基底。'],
 ['擂鼓','功能鼓段','由疏渐密 · 推高紧张感','滚奏由慢逐步加速，常用于遇疑、受惊、破阵、准备扑击和采青高潮。'],
 ['震鼓','功能鼓段','压抑顿挫 · 警惕生疑','敲击时配合轻按鼓面，让鼓声短促、含蓄，表现狮子的迟疑、警惕和疑惑。'],
 ['抛狮鼓','功能鼓段','急促轻快 · 兴奋腾跃','对应狮子兴奋跳跃、扑腾、登高，是高桩表演里常见的鼓点。'],
 ['三拜鼓','礼仪鼓段','短促干脆 · 行礼致意','用于拜门、拜神、向观众致意等礼仪动作，节奏明快、落点清楚。'],
 ['急急风','功能鼓段','连续密鼓 · 惊险刺激','以极快的连续密鼓营造紧张气氛，多配合高桩腾跃等惊险动作。']
];
const story=[
 ['起狮','开场起狮鼓','狮子睁眼、起势、拜礼，宣布表演开始。'],
 ['行狮','巡场寻青','转入行狮鼓，游走四周、嗅探寻找青物。'],
 ['遇疑','震鼓与擂鼓','面对障碍或陌生事物，鼓点表现警惕、惊疑与试探。'],
 ['见青','抛狮鼓','发现青物后，节奏转为轻快，狮子上前扒探、把玩。'],
 ['采青','锣鼓齐鸣','采青成功，锣、钹与鼓点一同推向高潮。'],
 ['收狮','平缓谢礼','鼓点渐缓，狮子吐青、谢礼、收势，完成仪式闭环。']
];
const emotionMarkup=['喜','怒','哀','乐','动','静','惊','疑'].map(x=>'<i>'+x+'</i>').join('');
const instrumentMarkup=instruments.map((x,i)=>'<article class="culture-card instrument-card" tabindex="0" style="--card-order:'+i+'"><span class="culture-symbol">'+x.icon+'</span><small>'+x.role+'</small><h4>'+x.name+'</h4><p class="culture-teaser">'+x.teaser+'</p><p class="culture-detail">'+x.text+'</p><span class="hover-cue">悬停听它的分工 <b>↗</b></span></article>').join('');
const rhythmMarkup=rhythms.map((x,i)=>'<article class="culture-card rhythm-card '+(i<3?'rhythm-foundation':'')+'" tabindex="0"><div class="rhythm-card-top"><small>0'+(i+1)+'</small><span>'+x[1]+'</span></div><h4>'+x[0]+'</h4><b>'+x[2]+'</b><p class="culture-detail">'+x[3]+'</p><span class="hover-cue">悬停了解 <b>↗</b></span></article>').join('');
const storyMarkup=story.map((x,i)=>'<article class="score-step" tabindex="0"><span class="score-index">0'+(i+1)+'</span><span class="score-node" aria-hidden="true"></span><small>'+x[1]+'</small><h4>'+x[0]+'</h4><p>'+x[2]+'</p></article>').join('');
export function drumCultureMarkup(){return `<section class="drum-culture" aria-labelledby="drum-culture-title">
 <div class="culture-overline"><span>THE LANGUAGE OF LION DRUMS</span><span>SCROLL · HOVER TO EXPLORE</span></div>
 <div class="culture-opening"><div><span class="culture-kicker">岭南醒狮 · 听鼓识狮</span><h2 id="drum-culture-title">锣鼓，是南派醒狮的灵魂</h2></div><p>岭南民间常说“无鼓不成狮”。醒狮没有固定台词，神态、步伐与起落都依从鼓点变化；鼓手以轻重缓急指挥全场，用鼓声讲完一段故事。</p></div>
 <div class="culture-command"><div class="command-seal">无鼓<br>不成狮</div><div class="command-copy"><span>鼓手 · 全场总指挥</span><p>一鼓令狮醒，一拍引狮行。鼓乐传递醒狮的八种神态：</p><div class="emotion-row">${emotionMarkup}</div></div><div class="command-note">鼓随狮变<br>狮随鼓动</div></div>
 <section class="culture-block" aria-labelledby="instrument-title"><div class="culture-section-title"><span>01 / THE ENSEMBLE</span><div><h3 id="instrument-title">三件乐器，一套秩序</h3><p>鼓起为先，锣钹相应；各司其职，也彼此留白。</p></div></div><div class="instrument-cards">${instrumentMarkup}</div></section>
 <section class="culture-block" aria-labelledby="rhythm-title"><div class="culture-section-title"><span>02 / RHYTHM VOCABULARY</span><div><h3 id="rhythm-title">八种鼓法，八种狮意</h3><p>三星、五星、七星构成常见基础鼓法；功能鼓段随场景转换。</p></div></div><div class="rhythm-cards">${rhythmMarkup}</div><p class="culture-footnote">佛山、南海一带流传的鼓法体系成熟，各地狮馆与村落也有本地变体，素有“各处乡村各处例”之说。</p></section>
 <section class="culture-block caiqing-block" aria-labelledby="caiqing-drum-title"><div class="culture-section-title"><span>03 / A STORY IN BEATS</span><div><h3 id="caiqing-drum-title">一段采青，鼓乐讲完一场故事</h3><p>从唤醒到谢礼，鼓点推动狮子一步步走完整套仪式。</p></div></div><div class="caiqing-score">${storyMarkup}</div></section>
 <section class="culture-closing"><div><span>04 / THE DRUMMER</span><h3>鼓手不只背鼓谱，<br>更要“眼不离狮”。</h3></div><div class="closing-copy"><p>传统狮艺中，鼓手常兼修南派武术，以四平马、子午马稳住身形。演出时观察狮头动作，临场调整节奏和力度；与狮头、狮尾长期磨合，甚至能用鼓点接住动作变化，形成无需言语的默契。</p><p>醒狮锣鼓也是祈福与传承的声音。年节、祠堂庆典、商铺开张时，鼓声寄托驱邪纳福、兴旺顺遂的愿望；这份听觉技艺随岭南华人走向东南亚与海外，成为共同的文化记忆。</p></div></section>
 <p class="culture-ending">鼓声落下，狮意仍在。<span>END OF THE RHYTHM</span></p>
 </section>`}
export function initDrumCulture(){const items=document.querySelectorAll('.instrument-card,.rhythm-card,.score-step');if(!items.length)return;if(!('IntersectionObserver'in window)){items.forEach(x=>x.classList.add('in-view'));return;}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.12});items.forEach(x=>observer.observe(x));}
