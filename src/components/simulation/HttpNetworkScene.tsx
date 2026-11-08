"use client";
import {useEffect,useRef} from "react";
import {httpActors,httpSteps} from "../../data/http-request-scenario";
export function HttpNetworkScene({stepIndex,progress}:{stepIndex:number;progress:number}){
 const mount=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  (async()=>{
   const THREE=await import("three");
   const {OrbitControls}=await import("three/examples/jsm/controls/OrbitControls.js");
   if(disposed||!mount.current)return;
   const el=mount.current;
   const scene=new THREE.Scene();
   const camera=new THREE.PerspectiveCamera(45,1,.1,1500);camera.position.set(0,70,490);
   const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0x070d1b,0);
   el.appendChild(renderer.domElement);
   const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=250;controls.maxDistance=850;
   const meshes=new Map<string,InstanceType<typeof THREE.Vector3>>();
   const disposables:{dispose:()=>void}[]=[];
   const label=(value:string)=>{
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;
    const ctx=canvas.getContext("2d");if(ctx){ctx.font="bold 28px Arial";ctx.fillStyle="#e7f3ff";ctx.textAlign="center";ctx.fillText(value,256,52,500)}
    const texture=new THREE.CanvasTexture(canvas);disposables.push(texture);
    const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});disposables.push(material);
    const sprite=new THREE.Sprite(material);sprite.scale.set(110,21,1);return sprite;
   };
   httpActors.forEach((a,i)=>{
    const pos=new THREE.Vector3(a.x,a.y,a.z);meshes.set(a.id,pos);
    const geometry=new THREE.IcosahedronGeometry(11,1);const material=new THREE.MeshBasicMaterial({color:[0x67e8f9,0x38bdf8,0xa78bfa,0xfbbf24,0x34d399][i]});
    disposables.push(geometry,material);
    const node=new THREE.Mesh(geometry,material);node.position.copy(pos);scene.add(node);
    const text=label(a.label);text.position.copy(pos).add(new THREE.Vector3(0,-27,0));scene.add(text);
   });
   const connections:[string,string][]=[["user","browser"],["browser","resolver"],["browser","router"],["router","server"],["browser","server"]];
   connections.forEach(([from,to])=>{
    const geometry=new THREE.BufferGeometry().setFromPoints([meshes.get(from)!,meshes.get(to)!]);
    const material=new THREE.LineBasicMaterial({color:0x54749b,transparent:true,opacity:.6});
    disposables.push(geometry,material);scene.add(new THREE.Line(geometry,material));
   });
   const packetGeometry=new THREE.SphereGeometry(5,16,12);
   const packetMaterial=new THREE.MeshBasicMaterial({color:0xffffff});
   disposables.push(packetGeometry,packetMaterial);
   const packet=new THREE.Mesh(packetGeometry,packetMaterial);scene.add(packet);
   const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
   const observer=new ResizeObserver(resize);observer.observe(el);resize();
   let frame=0;
   const animate=()=>{controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(animate)};
   animate();
   const update=(index:number,t:number)=>{
    const step=httpSteps[index];const a=step&&meshes.get(step.from),b=step&&meshes.get(step.to);
    packet.visible=!!a&&!!b;
    if(a&&b){packet.position.lerpVectors(a,b,Math.max(0,Math.min(1,t)));packet.position.z+=Math.sin(t*Math.PI)*12}
   };
   // Read latest values without rebuilding the WebGL scene.
   update(stepRef.current,progressRef.current);
   const refresh=()=>update(stepRef.current,progressRef.current);
   const tick=()=>{refresh();if(!disposed)refreshFrame=requestAnimationFrame(tick)};
   let refreshFrame=requestAnimationFrame(tick);
   cleanup=()=>{cancelAnimationFrame(frame);cancelAnimationFrame(refreshFrame);observer.disconnect();controls.dispose();disposables.forEach(d=>d.dispose());renderer.dispose();renderer.domElement.remove()};
  })().catch(err=>console.error("3D network scene initialization failed",err));
  return()=>{disposed=true;cleanup()};
 },[]);
 const stepRef=useRef(stepIndex),progressRef=useRef(progress);
 stepRef.current=stepIndex;progressRef.current=progress;
 return <div ref={mount} className="eu-network-scene" role="img" aria-label="Interactive 3D network diagram with animated transfer between user, browser, DNS resolver, gateway and web server"/>;
}
