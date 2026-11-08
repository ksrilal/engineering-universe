/** Pure IP calculations; all IPv4 arithmetic uses unsigned 32-bit integers. */
export function parseIPv4(input:string):number|null{
 const parts=input.trim().split(".");
 if(parts.length!==4||parts.some(p=>!/^(0|[1-9]\d{0,2})$/.test(p)||Number(p)>255))return null;
 return parts.reduce((n,p)=>((n*256)+Number(p))>>>0,0);
}
export function formatIPv4(value:number){return [24,16,8,0].map(shift=>(value>>>shift)&255).join(".")}
export function maskIPv4(prefix:number){return prefix===0?0:(0xffffffff<<(32-prefix))>>>0}
export function analyzeIPv4(address:string,prefix:number){
 const ip=parseIPv4(address);
 if(ip===null||!Number.isInteger(prefix)||prefix<0||prefix>32)return null;
 const mask=maskIPv4(prefix),network=(ip&mask)>>>0,hostMask=(~mask)>>>0,broadcast=(network|hostMask)>>>0;
 const total=2**(32-prefix);
 const usable=prefix===32?1:prefix===31?2:Math.max(0,total-2);
 const first=prefix>=31?network:network+1,last=prefix>=31?broadcast:broadcast-1;
 const bits=(v:number)=>Array.from({length:32},(_,i)=>((v>>>(31-i))&1).toString()).join("");
 return {ip,prefix,mask,network,broadcast,hostMask,total,usable,first,last,
 address:formatIPv4(ip),maskText:formatIPv4(mask),networkText:formatIPv4(network),broadcastText:formatIPv4(broadcast),
 firstText:formatIPv4(first),lastText:formatIPv4(last),hostId:(ip&hostMask)>>>0,
 binaryIp:bits(ip),binaryMask:bits(mask),binaryNetwork:bits(network),binaryBroadcast:bits(broadcast)};
}
export function parseIPv6(input:string):bigint|null{
 const value=input.trim().toLowerCase();
 if(!value||value.includes("%")||value.includes("."))return null;
 if((value.match(/::/g)||[]).length>1)return null;
 const halves=value.split("::");
 if(halves.length>2)return null;
 const read=(part:string)=>part===""?[]:part.split(":");
 const left=read(halves[0]),right=read(halves[1]||"");
 const all=[...left,...right];
 if(all.some(p=>!/^[0-9a-f]{1,4}$/.test(p)))return null;
 if(halves.length===1&&all.length!==8)return null;
 if(halves.length===2&&all.length>=8)return null;
 const groups=halves.length===2?[...left,...Array(8-all.length).fill("0"),...right]:all;
 return groups.reduce((n,p)=>(n<<16n)|BigInt(parseInt(p,16)),0n);
}
export function formatIPv6(value:bigint){
 const groups=Array.from({length:8},(_,i)=>Number((value>>BigInt((7-i)*16))&65535n));
 let bestStart=-1,bestLength=0;
 for(let i=0;i<8;){if(groups[i]!==0){i++;continue}let j=i;while(j<8&&groups[j]===0)j++;if(j-i>bestLength&&j-i>=2){bestStart=i;bestLength=j-i}i=j}
 const hex=groups.map(x=>x.toString(16));
 if(bestStart<0)return hex.join(":");
 const before=hex.slice(0,bestStart).join(":"),after=hex.slice(bestStart+bestLength).join(":");
 return before+"::"+after;
}
export function analyzeIPv6(address:string,prefix:number){
 const ip=parseIPv6(address);
 if(ip===null||!Number.isInteger(prefix)||prefix<0||prefix>128)return null;
 const full=(1n<<128n)-1n;
 const mask=prefix===0?0n:(full<<BigInt(128-prefix))&full;
 const network=ip&mask,interfaceId=ip&(~mask&full);
 return {address:formatIPv6(ip),prefix,network:formatIPv6(network),interfaceId:interfaceId.toString(16),networkBits:prefix,hostBits:128-prefix,
 binaryIp:ip.toString(2).padStart(128,"0"),binaryMask:mask.toString(2).padStart(128,"0"),addressCount:(1n<<BigInt(128-prefix)).toString()};
}
