import {catalogue} from "../../data/catalogue";
import type {Domain} from "../knowledge/types";
export type ScenarioStage={title:string;description:string;from:number;to:number;signal:string;metric:number;kind:"message"|"process"|"response";checks?:string[];fields?:[string,string][];failureReason?:string};
export type ConceptScenario={id:string;title:string;domain:Domain;summary:string;actors:string[];stages:ScenarioStage[];limitations:string;icons?:string[]};
type Template={actors:string[];stages:ScenarioStage[];limitations:string;icons?:string[]};
const templates:Record<Domain,Template>={
Networking:{actors:["Client","Gateway","Network","Destination"],stages:[
{title:"Create message",description:"The client prepares data and protocol metadata for communication.",from:0,to:1,signal:"Application data",metric:120,kind:"message"},
{title:"Forward traffic",description:"The gateway forwards traffic according to its forwarding and policy rules.",from:1,to:2,signal:"Network transfer",metric:450,kind:"message"},
{title:"Reach destination",description:"The destination receives and processes the incoming traffic.",from:2,to:3,signal:"Incoming data",metric:450,kind:"process"},
{title:"Return response",description:"A response or acknowledgement may travel back, depending on the protocol.",from:3,to:0,signal:"Response",metric:800,kind:"response"}],limitations:"Conceptual communication model; exact protocol handshakes, headers, packetization and paths vary. This does not represent a packet capture."},
Security:{actors:["User","Application","Identity / Policy","Protected resource"],stages:[
{title:"Initiate access",description:"The user requests an operation through the application.",from:0,to:1,signal:"Access request",metric:100,kind:"message"},
{title:"Evaluate control",description:"The application consults the relevant security mechanism or policy.",from:1,to:2,signal:"Security check",metric:180,kind:"process"},
{title:"Apply decision",description:"A valid decision or cryptographic result determines the next action.",from:2,to:1,signal:"Decision",metric:90,kind:"response"},
{title:"Access resource",description:"Only permitted operations should proceed to the protected resource.",from:1,to:3,signal:"Authorized operation",metric:400,kind:"message"}],limitations:"Generic defensive security flow; mechanisms differ substantially among authentication, encryption, identity and attack topics."},
Software:{actors:["User interface","Application API","Business logic","Data store"],stages:[
{title:"User action",description:"An input or event triggers application work.",from:0,to:1,signal:"Request",metric:180,kind:"message"},
{title:"Validate and execute",description:"The application validates input and applies business rules.",from:1,to:2,signal:"Command",metric:260,kind:"process"},
{title:"Read or write",description:"Business logic interacts with persistence when needed.",from:2,to:3,signal:"Query / update",metric:550,kind:"message"},
{title:"Return result",description:"The application delivers the result for presentation.",from:3,to:0,signal:"Result",metric:350,kind:"response"}],limitations:"Generic application request model; not every software concept uses a database or synchronous API."},
Cloud:{actors:["Client","Edge / gateway","Cloud service","Storage / compute"],stages:[
{title:"Enter cloud",description:"A request enters a cloud-hosted environment.",from:0,to:1,signal:"Inbound traffic",metric:120,kind:"message"},
{title:"Apply routing",description:"Networking and security policies determine the allowed route.",from:1,to:2,signal:"Routed request",metric:240,kind:"message"},
{title:"Use resources",description:"A service uses allocated compute, networking or storage resources.",from:2,to:3,signal:"Resource operation",metric:600,kind:"process"},
{title:"Deliver result",description:"The result returns to the requester through the service path.",from:3,to:0,signal:"Response",metric:500,kind:"response"}],limitations:"Cloud architecture illustration, not an AWS or Azure resource configuration or provider-specific implementation."},
DevOps:{actors:["Developer","CI pipeline","Artifact registry","Runtime platform"],stages:[
{title:"Submit change",description:"A developer commits or submits a change to source control.",from:0,to:1,signal:"Commit",metric:80,kind:"message"},
{title:"Build and test",description:"Automation validates and packages the change.",from:1,to:2,signal:"Build artifact",metric:800,kind:"process"},
{title:"Deploy artifact",description:"A deployment process updates the runtime platform.",from:2,to:3,signal:"Release",metric:480,kind:"message"},
{title:"Report status",description:"Health signals and release outcomes are observed.",from:3,to:0,signal:"Telemetry",metric:140,kind:"response"}],limitations:"Simplified software delivery pipeline; many DevOps concepts are not deployment stages."},
"Distributed Systems":{actors:["Producer","Broker / gateway","Worker / service","State store"],stages:[
{title:"Produce work",description:"A producer creates a request, command or event.",from:0,to:1,signal:"Message",metric:150,kind:"message"},
{title:"Distribute",description:"An intermediary routes or buffers work for downstream processing.",from:1,to:2,signal:"Delivery",metric:240,kind:"message"},
{title:"Persist outcome",description:"The consumer processes work and may update persistent state.",from:2,to:3,signal:"State update",metric:500,kind:"process"},
{title:"Acknowledge",description:"The system reports an outcome or acknowledgement according to its delivery semantics.",from:2,to:0,signal:"Ack / result",metric:90,kind:"response"}],limitations:"Generic distributed-system illustration; delivery guarantees, consistency and failure handling depend on the chosen architecture."}
};
const inspection:Record<Domain,{icons:string[];checks:string[][];fields:[string,string][]}>={
  "Networking": {
    "icons": [
      "💻",
      "📡",
      "🌐",
      "🖥️"
    ],
    "checks": [
      [
        "Application data is serialized",
        "Destination address and port selected",
        "Transport protocol selected"
      ],
      [
        "Destination IP checked against route table",
        "Next-hop address resolved on local link",
        "TTL / hop limit considered"
      ],
      [
        "Forwarding decision made per hop",
        "Policy and interface availability checked",
        "IP packet forwarded, not decrypted HTTP"
      ],
      [
        "Transport delivers data to receiving application",
        "Reply may use a different return path",
        "Delivery is protocol-dependent"
      ]
    ],
    "fields": [
      [
        "Payload",
        "Application bytes"
      ],
      [
        "Destination",
        "IP address / port"
      ],
      [
        "Header",
        "IP + transport"
      ],
      [
        "Result",
        "Application delivery"
      ]
    ]
  },
  "Security": {
    "icons": [
      "👤",
      "🧩",
      "🛡️",
      "🔐"
    ],
    "checks": [
      [
        "Requested action identified",
        "Identity context collected"
      ],
      [
        "Credentials or policy inputs validated",
        "Least-privilege rules evaluated",
        "Audit event recorded where appropriate"
      ],
      [
        "Allow / deny decision issued",
        "Decision integrity checked"
      ],
      [
        "Authorization enforced at resource",
        "Denied requests must not execute"
      ]
    ],
    "fields": [
      [
        "Principal",
        "User / service"
      ],
      [
        "Action",
        "Requested operation"
      ],
      [
        "Decision",
        "Allow or deny"
      ],
      [
        "Resource",
        "Protected endpoint"
      ]
    ]
  },
  "Software": {
    "icons": [
      "👤",
      "🌐",
      "⚙️",
      "🗄️"
    ],
    "checks": [
      [
        "User input collected",
        "Client-side validation is advisory"
      ],
      [
        "Server validates inputs",
        "Authentication / authorization applied",
        "Request correlation recorded"
      ],
      [
        "Business invariants checked",
        "Operation executes or rejects"
      ],
      [
        "Query or mutation runs",
        "Transaction and errors handled"
      ]
    ],
    "fields": [
      [
        "Request",
        "UI event"
      ],
      [
        "Endpoint",
        "API route"
      ],
      [
        "Operation",
        "Business command"
      ],
      [
        "Persistence",
        "Read / write"
      ]
    ]
  },
  "Cloud": {
    "icons": [
      "👤",
      "🛡️",
      "☁️",
      "🗄️"
    ],
    "checks": [
      [
        "Destination service identified",
        "Client credentials attached if needed"
      ],
      [
        "Routing and firewall rules evaluated",
        "TLS termination point identified"
      ],
      [
        "Service identity and access checked",
        "Compute health and capacity checked"
      ],
      [
        "Storage permissions validated",
        "Availability and response monitored"
      ]
    ],
    "fields": [
      [
        "Client",
        "Request"
      ],
      [
        "Edge",
        "Route / policy"
      ],
      [
        "Service",
        "Compute"
      ],
      [
        "Resource",
        "Storage"
      ]
    ]
  },
  "DevOps": {
    "icons": [
      "👩‍💻",
      "🧪",
      "📦",
      "🚀"
    ],
    "checks": [
      [
        "Commit SHA and branch identified",
        "Change review policy applied"
      ],
      [
        "Dependencies restored",
        "Tests and security scans run",
        "Build status checked"
      ],
      [
        "Artifact digest / signature recorded",
        "Registry access verified"
      ],
      [
        "Deployment health checked",
        "Rollback criteria evaluated",
        "Telemetry collected"
      ]
    ],
    "fields": [
      [
        "Source",
        "Git commit"
      ],
      [
        "CI",
        "Tests / build"
      ],
      [
        "Artifact",
        "Versioned image"
      ],
      [
        "Runtime",
        "Release status"
      ]
    ]
  },
  "Distributed Systems": {
    "icons": [
      "👤",
      "📨",
      "⚙️",
      "🗄️"
    ],
    "checks": [
      [
        "Message ID generated",
        "Schema validated"
      ],
      [
        "Route or topic selected",
        "Durability and backpressure checked"
      ],
      [
        "Idempotency key checked",
        "Handler executes with error policy"
      ],
      [
        "State commit verified",
        "Ack timing and redelivery policy considered"
      ]
    ],
    "fields": [
      [
        "Producer",
        "Message ID"
      ],
      [
        "Broker",
        "Queue / topic"
      ],
      [
        "Consumer",
        "Handler"
      ],
      [
        "Store",
        "Commit"
      ]
    ]
  }
};
export const conceptScenarios:ConceptScenario[]=catalogue.map(c=>{const template=templates[c.domain];const config=inspection[c.domain];return{id:c.id,title:c.name,domain:c.domain,summary:c.summary,actors:template.actors,icons:config.icons,stages:template.stages.map((stage,i)=>({...stage,checks:config.checks[i],fields:[["Signal",stage.signal],["Component",template.actors[stage.to]],["Context",config.fields[i][1]],["State",stage.kind]],failureReason:"The receiving component rejects or cannot complete this stage; inspect its checks and recovery policy."})),limitations:template.limitations}});
export function getConceptScenario(id:string){return conceptScenarios.find(s=>s.id===id)}
