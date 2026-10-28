// Original parametric WebGL sculpture. Every visible craft object has volume:
// no photographs, image planes, textures, remote 3D library, or video.
const TAU=Math.PI*2;
const P={wood:'#4b2c20',woodLight:'#8e5b39',bamboo:'#c59a57',paper:'#e7d6b5',paperShade:'#aa8e68',red:'#a92325',redLight:'#d64d37',gold:'#dcaa54',blue:'#315f69',ink:'#1c1a1a',white:'#fff0d5',skin:'#b98262',cloth:'#343b3b',fur:'#e7c579',stone:'#281f1b'};
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);}
const sub=(a,b)=>a.map((v,i)=>v-b[i]),add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,k)=>a.map(v=>v*k);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const k=Math.hypot(...a)||1;return a.map(v=>v/k);};
class Mesh{
 constructor(){this.data=[];}
 vertex(p,n,c){this.data.push(...p,...n,...rgb(c));}
 tri(a,b,c,col){const n=norm(cross(sub(b,a),sub(c,a)));this.vertex(a,n,col);this.vertex(b,n,col);this.vertex(c,n,col);}
 quad(a,b,c,d,col){this.tri(a,b,c,col);this.tri(a,c,d,col);}
 box(x,y,z,w,h,d,col){const a=x-w/2,b=x+w/2,l=y-h/2,r=y+h/2,f=z+d/2,k=z-d/2;this.quad([a,l,f],[b,l,f],[b,r,f],[a,r,f],col);this.quad([b,l,k],[a,l,k],[a,r,k],[b,r,k],col);this.quad([a,l,k],[a,l,f],[a,r,f],[a,r,k],col);this.quad([b,l,f],[b,l,k],[b,r,k],[b,r,f],col);this.quad([a,r,f],[b,r,f],[b,r,k],[a,r,k],col);this.quad([a,l,k],[b,l,k],[b,l,f],[a,l,f],col);}
 ball(x,y,z,rx,ry,rz,col,steps=14,rings=9){for(let j=0;j<rings;j++){let a=j*Math.PI/rings,b=(j+1)*Math.PI/rings;for(let i=0;i<steps;i++){let u=i*TAU/steps,v=(i+1)*TAU/steps;const pos=(t,s)=>[x+rx*Math.sin(t)*Math.cos(s),y+ry*Math.cos(t),z+rz*Math.sin(t)*Math.sin(s)];const vtx=p=>norm([(p[0]-x)/rx**2,(p[1]-y)/ry**2,(p[2]-z)/rz**2]);const A=pos(a,u),B=pos(a,v),C=pos(b,v),D=pos(b,u);for(const q of [[A,B,C],[A,C,D]])for(const p of q)this.vertex(p,vtx(p),col);}}}
 rod(a,b,r,col,sides=8){let axis=norm(sub(b,a)),other=Math.abs(axis[1])<.85?[0,1,0]:[1,0,0],u=norm(cross(axis,other)),v=norm(cross(axis,u));for(let i=0;i<sides;i++){let t=i*TAU/sides,s=(i+1)*TAU/sides;let q=(p,angle)=>add(p,add(mul(u,Math.cos(angle)*r),mul(v,Math.sin(angle)*r)));this.quad(q(a,t),q(a,s),q(b,s),q(b,t),col);}}
 line(points,r,col){for(let i=1;i<points.length;i++)this.rod(points[i-1],points[i],r,col);}
 loop(x,y,z,rx,ry,r,col,segments=30){const pts=[];for(let i=0;i<=segments;i++){let t=i*TAU/segments;pts.push([x+Math.cos(t)*rx,y+Math.sin(t)*ry,z]);}this.line(pts,r,col);}
}
function lion(m,stage,x,z){
 const y=1.88,front=z+.62;const X=v=>x+v,Y=v=>y+v,Z=v=>z+v;
 // The bamboo cage remains visible in the first station and through the paper at the second.
 if(stage===0){for(const depth of [-.55,0,.5]){m.loop(x,y,z+depth,.82,.71,.027,P.bamboo);m.loop(x,y-.47,z+depth,.68,.3,.023,P.bamboo);}
  for(let k=0;k<13;k++){let t=k*TAU/13;let a=[X(.8*Math.cos(t)),Y(.69*Math.sin(t)),Z(-.56)],b=[X(.83*Math.cos(t+.08)),Y(.72*Math.sin(t+.08)),Z(.54)];m.rod(a,b,.023,P.bamboo);if(k%2===0)m.rod(a,[X(.82*Math.cos(t+1.25)),Y(.71*Math.sin(t+1.25)),Z(.52)],.013,P.woodLight);}
  m.loop(x-.42,y+.06,front,.29,.33,.038,P.bamboo);m.loop(x+.42,y+.06,front,.29,.33,.038,P.bamboo);m.ball(x,y-.42,front+.08,.5,.22,.18,P.woodLight);
 }else{
  m.ball(x,y,z,.92,.82,.72,stage===1?P.paperShade:stage===2?P.paper:P.red,24,14);
  m.ball(x,y+.06,z+.16,.86,.77,.62,stage===1?P.paper:stage===2?P.paper:P.redLight,24,14);
  m.ball(x,y-.58,z+.33,.73,.25,.45,stage===1?P.paperShade:stage===2?P.paper:P.ink,20,9);
  m.ball(x,y-.44,z+.62,.67,.21,.27,stage===1?P.paper:stage===2?P.paper:P.red,20,9);
  for(const sign of [-1,1]){
   m.ball(X(sign*.45),Y(.09),Z(.58),.32,.34,.21,stage===1?P.paperShade:stage===2?P.red:P.gold,16,10);
   m.ball(X(sign*.45),Y(.09),Z(.74),.235,.24,.105,stage===1?P.paper:stage===2?P.white:P.white,16,9);
   if(stage>=2){m.ball(X(sign*.43),Y(.08),Z(.835),.125,.15,.075,P.ink,14,8);m.ball(X(sign*.46-.035),Y(.13),Z(.905),.045,.055,.024,P.white,10,7);}
  }
  m.ball(x,Y(-.26),Z(.81),.29,.23,.18,stage===1?P.paperShade:stage===2?P.red:P.gold,16,10);
  if(stage>=2){
   m.loop(x,y+.02,z+.55,.79,.7,.036,P.red,36);
   m.line([[X(-.78),Y(.33),Z(.46)],[X(-.46),Y(.46),Z(.68)],[x,Y(.35),Z(.69)],[X(.46),Y(.46),Z(.68)],[X(.78),Y(.33),Z(.46)]],.055,P.gold);
   m.line([[X(-.7),Y(-.3),Z(.55)],[X(-.32),Y(-.12),Z(.82)],[x,Y(-.2),Z(.84)],[X(.32),Y(-.12),Z(.82)],[X(.7),Y(-.3),Z(.55)]],.038,P.blue);
   for(const sign of [-1,1])for(let i=0;i<3;i++){let q=sign*(.22+i*.2);m.line([[X(q),Y(.66),Z(.46)],[X(q*1.13),Y(.49),Z(.66)],[X(q*.9),Y(.41),Z(.74)]],.025,P.gold);}
  }
  if(stage===3){
   for(let i=0;i<32;i++){let a=i*TAU/32;let px=Math.cos(a)*.89,py=Math.sin(a)*.77;let q=[X(px),Y(py),Z(.16)],p=[X(px*1.15),Y(py*1.14),Z(.22)];m.rod(q,p,.048,i%3?P.fur:P.gold);}
   for(let sign of [-1,1]){m.ball(X(sign*.78),Y(.45),Z(.36),.21,.26,.22,P.fur,13,8);m.ball(X(sign*.72),Y(.48),Z(.57),.13,.14,.13,P.red,12,8);
    for(let k=0;k<4;k++)m.line([[X(sign*.35),Y(-.41),Z(.82)],[X(sign*(.56+k*.13)),Y(-.45-k*.065),Z(.85)]],.017,P.fur);}
   m.ball(x,Y(.82),Z(.15),.28,.3,.28,P.gold,15,10);
   m.ball(x,Y(.83),Z(.39),.12,.13,.06,P.red,12,8);
   m.ball(x,Y(.72),Z(.63),.11,.11,.09,P.white,12,8);
   m.loop(x,Y(.63),Z(.69),.18,.15,.025,P.gold,24);
  }
 }
}
function artisan(m,x,z){const head=[x,2.47,z-.35],chest=[x,1.8,z-.35];m.ball(...head,.24,.29,.23,P.skin,13,9);m.ball(x,2.65,z-.39,.24,.14,.22,P.ink,12,7);m.ball(x,1.9,z-.35,.35,.5,.23,P.cloth,14,9);m.box(x,1.74,z-.09,.49,.59,.06,P.paperShade);m.rod([x-.15,1.55,z-.35],[x-.21,.82,z-.3],.115,P.cloth);m.rod([x+.15,1.55,z-.35],[x+.18,.82,z-.3],.115,P.cloth);m.box(x-.22,.78,z-.18,.3,.13,.39,P.ink);m.box(x+.19,.78,z-.18,.3,.13,.39,P.ink);m.ball(x-.23,2.48,z-.13,.025,.035,.016,P.ink,8,6);m.ball(x+.13,2.48,z-.13,.025,.035,.016,P.ink,8,6);}
function workingArms(m,t){for(let i=0;i<4;i++){let z=-4-14*i,modelX=i%2?1.15:-1.15,x=-modelX*.8,dir=Math.sign(modelX-x),pulse=Math.sin(t*2.6+i*1.7)*.12;
 const shoulder=[x+dir*.27,2.11,z-.21],elbow=[x+dir*.54,1.86+pulse,z+.1],hand=[modelX-dir*.55,2.02+pulse,z+.48];
 m.rod(shoulder,elbow,.12,P.cloth);m.rod(elbow,hand,.09,P.cloth);m.ball(...hand,.105,.11,.105,P.skin,10,7);
 const far=[x-dir*.23,2.03,z-.2],rest=[x-dir*.42,1.55,z+.13];m.rod(far,rest,.105,P.cloth);m.ball(...rest,.095,.1,.09,P.skin,10,7);
 if(i===1||i===2){m.rod(hand,[hand[0]+dir*.20,hand[1]-.31,z+.7],.025,i===1?P.bamboo:P.woodLight);if(i===1)m.ball(hand[0]+dir*.20,hand[1]-.32,z+.7,.095,.045,.04,P.paper);}
 if(i===0)m.rod(hand,[hand[0]+dir*.24,hand[1]-.22,z+.48],.025,P.bamboo);
 }}
function workshop(m){
 m.box(0,-.16,-22,9.6,.32,82,P.stone);m.box(0,4.25,-22,9.6,.32,82,P.wood);
 for(let x of [-4.7,4.7])m.box(x,2.0,-22,.22,4.2,82,P.wood);
 for(let z=2;z>-66;z-=2){m.box(0,.018,z,8.8,.016,.024,P.woodLight);if(z%4===2){m.box(-3.9,3.85,z,.15,.7,.16,P.gold);m.box(3.9,3.85,z,.15,.7,.16,P.gold);}}
 for(let x=-3.8;x<=3.8;x+=1.25)m.box(x,.02,-22,.018,.022,80,P.woodLight);
 for(let i=0;i<4;i++){const z=-4-14*i,modelX=i%2?1.15:-1.15,craftX=-modelX*.8;
  m.box(0,3.8,z+4,9.4,.24,.3,P.red);for(const x of [-4.15,4.15]){m.box(x,2.0,z+4,.25,4,.27,P.red);m.box(x,2.85,z+4,.32,.06,.35,P.gold);}
  for(const x of [-3.6,3.6]){m.box(x,2.3,z-.3,.16,2.8,.22,P.woodLight);m.box(x,3.65,z-.3,.7,.14,.25,P.gold);m.box(x,1.02,z-.3,.7,.12,.25,P.gold);}
  m.box(0,3.25,z-.3,7.2,.15,.25,P.woodLight);
  m.rod([0,3.9,z-.1],[0,3.37,z-.1],.03,P.gold);
  m.ball(0,3.26,z-.1,.22,.2,.22,P.gold,13,9);m.ball(0,3.11,z-.1,.23,.1,.23,P.red,13,7);
  m.box(modelX,1.12,z,.2,1.85,.2,P.wood);m.box(modelX,1.05,z,2.25,.16,1.75,P.woodLight);
  m.box(modelX,.28,z,2.5,.28,2.1,P.wood);lion(m,i,modelX,z);artisan(m,craftX,z-.32);
  m.box(craftX+Math.sign(modelX)*.2,1.06,z+.75,.58,.10,.67,P.woodLight);
  m.ball(craftX+Math.sign(modelX)*.3,1.19,z+.8,.16,.11,.16,i===2?P.red:P.paper,12,8);
  // Small physical tools and materials around the worktable.
  for(let k=0;k<5;k++)m.rod([modelX-1+k*.27,1.13,z-.5],[modelX-.9+k*.27,1.13,z+.2],.017,i===0?P.bamboo:P.paperShade);
 }
}
const VS=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;uniform vec3 uEye;uniform vec3 uRight;uniform vec3 uUp;uniform vec3 uForward;uniform float uAspect;varying vec3 vColor;varying float vFog;void main(){vec3 p=aPosition-uEye;float x=dot(p,uRight),y=dot(p,uUp),depth=dot(p,uForward);float near=0.08,far=85.0;gl_Position=vec4(x*1.55/uAspect,y*1.55,depth*(far+near)/(far-near)-2.0*far*near/(far-near),depth);vec3 n=normalize(aNormal);float diffuse=max(dot(n,normalize(vec3(-.48,.83,.68))),0.0);float rim=max(dot(n,normalize(vec3(.7,.5,-.4))),0.0);float illum=.40+.50*diffuse+.12*rim;vColor=aColor*illum;vFog=clamp((depth-17.0)/46.0,0.0,.88);}`;
const FS=`precision mediump float;varying vec3 vColor;varying float vFog;void main(){vec3 c=pow(vColor,vec3(.82));gl_FragColor=vec4(mix(c,vec3(.083,.045,.039),vFog),1.0);}`;
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
function makeProgram(gl){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
// The same mesh can be projected by Canvas 2D when browser GPU access is disabled.
// It remains a rotatable 3D sculpture, with depth sorting and perspective.
function softwareWorld(canvas,{preview}){
 const ctx=canvas.getContext('2d');if(!ctx)return {setProgress(){},turn(){},dispose(){}};
 const mesh=new Mesh();workshop(mesh);const geometry=new Float32Array(mesh.data);const triangles=[];
 for(let i=0;i<geometry.length;i+=27){const x=(geometry[i]+geometry[i+9]+geometry[i+18])/3,z=(geometry[i+2]+geometry[i+11]+geometry[i+20])/3;triangles.push([i,x,z]);}
 let target=0,current=0,yaw=0,targetYaw=0,frame=0,disposed=false,drag=null,last=0;
 function draw(now){if(disposed)return;frame=requestAnimationFrame(draw);if(now-last<50)return;last=now;current+=(target-current)*.22;yaw+=(targetYaw-yaw)*.22;
  const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.floor(rect.width*ratio)),h=Math.max(1,Math.floor(rect.height*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  ctx.fillStyle='#160e0b';ctx.fillRect(0,0,w,h);
  const angle=yaw+(preview?.20:Math.sin(current*3*Math.PI)*.022),co=Math.cos(angle),si=Math.sin(angle),eyeZ=preview?-40.5:1-current*42,eyeY=preview?2.1:1.9,focal=h*.78;
  const project=i=>{let dx=geometry[i],dy=geometry[i+1]-eyeY,dz=geometry[i+2]-eyeZ,depth=dx*si-dz*co;if(depth<.12)return null;return [w/2+(dx*co+dz*si)*focal/depth,h/2-dy*focal/depth,depth];};
  const visible=[];for(const [i,x,z] of triangles){const depth=x*si-(z-eyeZ)*co;if(depth<.1||depth>24)continue;const a=project(i),b=project(i+9),c=project(i+18);if(!a||!b||!c)continue;if(Math.max(a[0],b[0],c[0])<0||Math.min(a[0],b[0],c[0])>w||Math.max(a[1],b[1],c[1])<0||Math.min(a[1],b[1],c[1])>h)continue;
   const light=Math.max(.25,Math.min(1.1,.44+.48*(geometry[i+4]*.82+geometry[i+5]*.68)));const fog=Math.max(0,Math.min(.72,(depth-9)/24));
   let c0=Math.round((geometry[i+6]*light*(1-fog)+.083*fog)*255),c1=Math.round((geometry[i+7]*light*(1-fog)+.045*fog)*255),c2=Math.round((geometry[i+8]*light*(1-fog)+.039*fog)*255);
   visible.push([depth,a,b,c,`rgb(${c0},${c1},${c2})`]);}
  visible.sort((a,b)=>b[0]-a[0]);for(const [,a,b,c,col] of visible){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.closePath();ctx.fillStyle=col;ctx.fill();}
  // Animate the craftspeople with the same volumetric sleeve and hand meshes.
  const arms=new Mesh();workingArms(arms,matchMedia('(prefers-reduced-motion: reduce)').matches?0:now/1000);const A=arms.data;const handFaces=[];for(let i=0;i<A.length;i+=27){const p=[A[i],A[i+1],A[i+2]],q=[A[i+9],A[i+10],A[i+11]],r=[A[i+18],A[i+19],A[i+20]];const z=((p[0]+q[0]+r[0])/3)*si-((p[2]+q[2]+r[2])/3-eyeZ)*co;if(z<.1||z>20)continue;const cv=P.cloth,skin=P.skin;const col=(A[i+6]>.45&&A[i+7]>.3)?skin:cv;handFaces.push([z,p,q,r,col]);}
  handFaces.sort((a,b)=>b[0]-a[0]);for(const [,a,b,c,col] of handFaces){const pp=p=>{let dz=p[2]-eyeZ,depth=p[0]*si-dz*co;return [w/2+(p[0]*co+dz*si)*focal/depth,h/2-(p[1]-eyeY)*focal/depth];};let u=pp(a),v=pp(b),t=pp(c);ctx.beginPath();ctx.moveTo(...u);ctx.lineTo(...v);ctx.lineTo(...t);ctx.closePath();ctx.fillStyle=col;ctx.fill();}
 }
 const down=e=>{drag={x:e.clientX,yaw:targetYaw};canvas.setPointerCapture(e.pointerId);},move=e=>{if(drag)targetYaw=Math.max(-.55,Math.min(.55,drag.yaw+(e.clientX-drag.x)/Math.max(320,canvas.clientWidth)*1.3));},up=()=>{drag=null;};
 if(!preview){canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);}
 frame=requestAnimationFrame(draw);return {setProgress(v){target=Math.max(0,Math.min(1,v));},turn(v){targetYaw=Math.max(-.55,Math.min(.55,targetYaw+v));},dispose(){disposed=true;cancelAnimationFrame(frame);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);}};
}
export function createCraftWorld(canvas,{preview=false}={}){
 if(!canvas)return {setProgress(){},turn(){},dispose(){}};
 const gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'default'});
 if(!gl)return softwareWorld(canvas,{preview});
 let program,buffer,movingBuffer,count;try{program=makeProgram(gl);const mesh=new Mesh();workshop(mesh);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.data),gl.STATIC_DRAW);movingBuffer=gl.createBuffer();count=mesh.data.length/9;}catch(err){canvas.insertAdjacentHTML('afterend','<p class="gallery-webgl-fallback" role="status">3D 场景初始化失败，请刷新后重试。</p>');return {setProgress(){},turn(){},dispose(){}};}
 gl.useProgram(program);const attribs=[['aPosition',3,0],['aNormal',3,12],['aColor',3,24]].map(([name,size,offset])=>[gl.getAttribLocation(program,name),size,offset]);function bind(buf){gl.bindBuffer(gl.ARRAY_BUFFER,buf);for(const [loc,size,offset] of attribs){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,36,offset);}}
 const uniform=name=>gl.getUniformLocation(program,name),eyeU=uniform('uEye'),rightU=uniform('uRight'),upU=uniform('uUp'),forwardU=uniform('uForward'),aspectU=uniform('uAspect');
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
 let target=0,current=0,yaw=0,targetYaw=0,frame=0,disposed=false,lastWidth=0,lastHeight=0,drag=null;
 function render(){if(disposed)return;frame=requestAnimationFrame(render);current+=(target-current)*.095;targetYaw=Math.max(-.55,Math.min(.55,targetYaw));yaw+=(targetYaw-yaw)*.12;
  const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));if(w!==lastWidth||h!==lastHeight){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);lastWidth=w;lastHeight=h;}
  gl.clearColor(.083,.045,.039,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const angle=yaw+(preview?.20:Math.sin(current*3*Math.PI)*.022),forward=[Math.sin(angle),0,-Math.cos(angle)],right=[Math.cos(angle),0,Math.sin(angle)];
  gl.uniform3fv(eyeU,new Float32Array([0,preview?2.1:1.9,preview?-40.5:1.0-current*42]));
  gl.uniform3fv(forwardU,new Float32Array(forward));gl.uniform3fv(rightU,new Float32Array(right));gl.uniform3fv(upU,new Float32Array([0,1,0]));gl.uniform1f(aspectU,w/h);bind(buffer);gl.drawArrays(gl.TRIANGLES,0,count);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const moving=new Mesh();workingArms(moving,performance.now()/1000);bind(movingBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(moving.data),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,moving.data.length/9);}else{const moving=new Mesh();workingArms(moving,0);bind(movingBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(moving.data),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,moving.data.length/9);}
 }
 const down=e=>{drag={x:e.clientX,yaw:targetYaw};canvas.setPointerCapture(e.pointerId);};const move=e=>{if(drag)targetYaw=drag.yaw+(e.clientX-drag.x)/Math.max(320,canvas.clientWidth)*1.3;};const up=()=>{drag=null;};
 if(!preview){canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);}
 document.addEventListener('visibilitychange',visibility);function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame)render();}
 render();
 return {setProgress(v){target=Math.max(0,Math.min(1,v));},turn(v){targetYaw+=v;},dispose(){disposed=true;cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);gl.deleteBuffer(buffer);gl.deleteBuffer(movingBuffer);gl.deleteProgram(program);}};
}
