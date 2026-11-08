export interface LearningPath {id:string;title:string;description:string;level:"Beginner"|"Intermediate"|"Advanced";conceptIds:string[]}
export const learningPaths:LearningPath[]=[
{id:"web-request",title:"From URL to Web Page",description:"Understand every layer involved in loading a website.",level:"Beginner",conceptIds:["dns","ipv4","routing","tcp","tls","https","browser-rendering"]},
{id:"networking",title:"Networking Essentials",description:"From addresses and subnets to routing and transport.",level:"Beginner",conceptIds:["ethernet","mac-address","ipv4","cidr","subnets","routing","dns","tcp","udp"]},
{id:"identity",title:"Identity and API Security",description:"Authentication, authorization, OAuth and defensive controls.",level:"Intermediate",conceptIds:["authentication","authorization","tls","oauth-2-0","openid-connect","json-web-tokens","rbac","csrf"]},
{id:"cloud",title:"Cloud Infrastructure",description:"Build a mental model of virtual networks, compute and scaling.",level:"Intermediate",conceptIds:["virtual-machines","vpc","subnets","route-tables","network-security-groups","load-balancers","autoscaling"]},
{id:"delivery",title:"From Git to Production",description:"Follow code through containers, CI/CD and Kubernetes.",level:"Intermediate",conceptIds:["git","build-pipelines","ci-cd","docker","kubernetes","kubernetes-deployments","ingress","rollback"]},
{id:"resilience",title:"Reliable Distributed Systems",description:"Reason about consistency, failures and message delivery.",level:"Advanced",conceptIds:["replication","consistency","retries","idempotency","message-queues","transactional-outbox","saga-pattern","circuit-breakers"]}
];
