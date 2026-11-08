import type {SimulationDefinition} from "./types";
export const websiteJourney:SimulationDefinition={
 id:"website-load",title:"What happens when you open a website?",summary:"A conceptual HTTPS website-loading journey using HTTP/2 over TCP. HTTP/3 takes a different QUIC-based path.",
 conceptIds:["dns","tcp","tls","https","http"],
 actors:[{id:"browser",label:"Browser",kind:"client"},{id:"resolver",label:"DNS Resolver",kind:"network"},{id:"server",label:"Web Server",kind:"server"}],
 durationMs:7000,
 events:[
 {id:"url",atMs:0,type:"annotation",from:"browser",label:"Parse URL",description:"Browser parses the URL and determines the origin and security requirements."},
 {id:"dns",atMs:1000,type:"message",from:"browser",to:"resolver",label:"DNS lookup",description:"Resolve the hostname, using caches where available."},
 {id:"address",atMs:2000,type:"message",from:"resolver",to:"browser",label:"DNS answer",description:"Return applicable DNS records and an address to connect to."},
 {id:"tcp",atMs:3000,type:"message",from:"browser",to:"server",label:"TCP connection",description:"Establish a TCP connection for this illustrative HTTP/2 path."},
 {id:"tls",atMs:4000,type:"message",from:"browser",to:"server",label:"TLS handshake",description:"Negotiate encryption and validate the server identity."},
 {id:"request",atMs:5000,type:"message",from:"browser",to:"server",label:"HTTP request",description:"Send the HTTP request over the secured connection."},
 {id:"response",atMs:6000,type:"message",from:"server",to:"browser",label:"HTTP response",description:"Receive response headers and content."},
 {id:"render",atMs:7000,type:"state-change",from:"browser",label:"Render document",description:"Parse the response and begin rendering, potentially fetching more resources.",state:{rendered:true}}
 ]
};
