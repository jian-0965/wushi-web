let context,interval=null,voices=[],run=0;
export async function enableAudio(){context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')await context.resume();return context;}
function tone(ctx,type,time,volume=.6){
 const gain=ctx.createGain();gain.connect(ctx.destination);gain.gain.setValueAtTime(.001,time);gain.gain.exponentialRampToValueAtTime(Math.max(.00001,volume),time+.005);gain.gain.exponentialRampToValueAtTime(.001,time+(type==='G'?1.4:type==='C'?.22:.46));
 const nodes=[];
 if(type==='C'){
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.25),ctx.sampleRate),a=buffer.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
  const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter();noise.buffer=buffer;filter.type='highpass';filter.frequency.value=5000;noise.connect(filter);filter.connect(gain);noise.start(time);noise.stop(time+.25);nodes.push(noise);
 }else{
  (type==='G'?[210,329,447,603]:[125,183]).forEach((freq,i)=>{const osc=ctx.createOscillator(),level=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,time);if(type==='D')osc.frequency.exponentialRampToValueAtTime(freq*.38,time+.22);level.gain.value=(type==='G'?.28:.5)/(i+1);osc.connect(level);level.connect(gain);osc.start(time);osc.stop(time+(type==='G'?1.45:.5));nodes.push(osc);});
 }
 nodes.forEach(n=>{if(ctx===context){voices.push(n);n.onended=()=>{voices=voices.filter(v=>v!==n);n.disconnect();};}});
 return nodes;
}
export async function hit(type,volume=.6){const ctx=await enableAudio();tone(ctx,type,ctx.currentTime,volume);}
export function stop(){run++;clearInterval(interval);interval=null;for(const n of voices){try{n.stop();}catch{}}voices=[];}
export async function playPattern(pattern,bpm,volume,onStep,onEnd,{loops=0}={}){
 stop();const ticket=run,ctx=await enableAudio();if(ticket!==run)return;let index=0,cycles=0,next=ctx.currentTime+.08;const step=60/bpm/2;
 interval=setInterval(()=>{if(ticket!==run)return;while(next<ctx.currentTime+.12){const n=index,cycle=cycles,at=next;if(pattern[n])tone(ctx,pattern[n],at,volume);setTimeout(()=>{if(ticket===run)onStep(n,cycle);},Math.max(0,(at-ctx.currentTime)*1000));index++;next+=step;if(index===pattern.length){index=0;cycles++;if(loops&&cycles>=loops){clearInterval(interval);interval=null;setTimeout(()=>{if(ticket===run)onEnd?.();},Math.max(0,(next-ctx.currentTime)*1000));return;}}}},25);
}
export function scoreRhythm(events,beats,bpm){
 const expected=beats.flatMap((type,i)=>type?[{type,time:i*60/bpm/2}]:[]),used=new Set();let matches=0,error=0;
 for(const e of events){let best=-1,d=.18;expected.forEach((x,i)=>{const delta=Math.abs(e.time-x.time);if(!used.has(i)&&e.type===x.type&&delta<d){best=i;d=delta;}});if(best>=0){used.add(best);matches++;error+=d;}}
 const total=Math.max(expected.length,events.length,1);return {score:Math.round(matches/total*100),matched:matches,missed:expected.length-matches,extra:events.length-matches,meanMs:matches?Math.round(error/matches*1000):null};
}
export async function rhythmWav(pattern,bpm){
 const rate=22050,length=pattern.length*60/bpm/2+1.5,ctx=new OfflineAudioContext(1,Math.ceil(rate*length),rate);
 pattern.forEach((type,i)=>{if(type)tone(ctx,type,i*60/bpm/2,.6);});const buffer=await ctx.startRendering(),samples=buffer.getChannelData(0),data=new ArrayBuffer(44+samples.length*2),view=new DataView(data);
 const write=(at,s)=>[...s].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0)));write(0,'RIFF');view.setUint32(4,36+samples.length*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,samples.length*2,true);samples.forEach((v,i)=>view.setInt16(44+i*2,Math.max(-1,Math.min(1,v))*32767,true));return new Blob([data],{type:'audio/wav'});
}
