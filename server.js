import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {handleLionAPI} from './server/lion-agent.js';

const root=resolve(fileURLToPath(new URL('./public/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.wav':'audio/wav','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};

async function toRequest(req,origin){
 const chunks=[];let size=0;
 for await(const chunk of req){size+=chunk.length;if(size>1800000)throw Object.assign(new Error('too large'),{status:413});chunks.push(chunk);}
 const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(', '):value);
 const host=new URL(origin).hostname;
 if(process.env.NODE_ENV!=='production'&&(host==='localhost'||host==='127.0.0.1'))headers.set('oai-authenticated-user-id','local-development');
 const init={method:req.method,headers};
 if(req.method!=='GET'&&req.method!=='HEAD')init.body=Buffer.concat(chunks);
 return new Request(origin+req.url,init);
}
async function send(res,response){
 res.writeHead(response.status,Object.fromEntries(response.headers));
 res.end(Buffer.from(await response.arrayBuffer()));
}
createServer(async(req,res)=>{
 try{
  const origin='http://'+(req.headers.host||'localhost');
  const request=await toRequest(req,origin);
  const api=await handleLionAPI(request,process.env,fetch);
  if(api){await send(res,api);return;}
  const pathname=decodeURIComponent(new URL(request.url).pathname);
  const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  const path=resolve(root,relative);
  if(path!==root&&!path.startsWith(root+sep))throw Object.assign(new Error('forbidden'),{status:403});
  const body=await readFile(path);
  const headers={'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  const range=req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
  if(range){
   const start=range[1]?Number(range[1]):Math.max(0,body.length-Number(range[2]));
   const end=range[1]?(range[2]?Number(range[2]):body.length-1):body.length-1;
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=body.length||end<start){res.writeHead(416,{...headers,'Content-Range':`bytes */${body.length}`});res.end();return;}
   const last=Math.min(end,body.length-1);
   res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${last}/${body.length}`,'Content-Length':last-start+1});
   res.end(req.method==='HEAD'?undefined:body.subarray(start,last+1));return;
  }
  res.writeHead(200,{...headers,'Content-Length':body.length});
  res.end(req.method==='HEAD'?undefined:body);
 }catch(error){
  res.writeHead(error.status||((error.code==='ENOENT')?404:500),{'Content-Type':'text/plain; charset=utf-8'});
  res.end(error.code==='ENOENT'?'Not found':'Request failed');
 }
}).listen(Number(process.env.PORT||3000),()=>console.log('狮遇 running at http://localhost:'+(process.env.PORT||3000)));
