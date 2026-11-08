import type {SimulationDefinition,SimulationActor,SimulationEvent} from "./types";
import {websiteJourney} from "./examples";
function journey(id:string,title:string,summary:string,conceptIds:string[],actors:SimulationActor[],items:Omit<SimulationEvent,"id"|"atMs">[]):SimulationDefinition{
 const events=items.map((item,i)=>({...item,id:`${id}-${i+1}`,atMs:i*1000}));
 return {id,title,summary,conceptIds,actors,events,durationMs:Math.max(0,(events.length-1)*1000)};
}
export const oauthJourney=journey("oauth-login","OAuth / OIDC sign-in","Illustrative authorization-code flow with PKCE; an identity provider authenticates the user.",["oauth-2-0","openid-connect","authentication"],[{id:"browser",label:"Browser",kind:"client"},{id:"app",label:"Application",kind:"service"},{id:"idp",label:"Identity Provider",kind:"server"}],[
{type:"message",from:"app",to:"browser",label:"Start authorization",description:"Application generates state, nonce and PKCE verifier/challenge."},
{type:"message",from:"browser",to:"idp",label:"Authorization request",description:"Browser redirects to the identity provider with client, scope, state and code challenge."},
{type:"annotation",from:"idp",label:"User authenticates",description:"The identity provider authenticates the user and obtains required consent."},
{type:"message",from:"idp",to:"browser",label:"Authorization code",description:"Identity provider redirects back with a short-lived authorization code and state."},
{type:"message",from:"app",to:"idp",label:"Token exchange",description:"Backend redeems the code using the original PKCE verifier and validates the response."},
{type:"state-change",from:"app",label:"Create session",description:"Application validates ID token claims where applicable and establishes its own session.",state:{authenticated:true}}
]);
export const deliveryJourney=journey("delivery","From Git commit to Kubernetes","Illustrative release flow with a deployment health check and rollback option.",["git","ci-cd","docker","kubernetes"],[{id:"developer",label:"Developer",kind:"user"},{id:"ci",label:"CI Pipeline",kind:"service"},{id:"registry",label:"Image Registry",kind:"server"},{id:"cluster",label:"Kubernetes",kind:"service"}],[
{type:"message",from:"developer",to:"ci",label:"Push commit",description:"Source change triggers an automated pipeline."},
{type:"state-change",from:"ci",label:"Run checks",description:"Pipeline runs tests, type checks and security validation.",state:{testsPassed:true}},
{type:"message",from:"ci",to:"registry",label:"Publish image",description:"Build a versioned container image and publish it to a registry."},
{type:"message",from:"ci",to:"cluster",label:"Apply deployment",description:"Update the desired image and deployment configuration."},
{type:"state-change",from:"cluster",label:"Rollout and readiness",description:"Scheduler starts new pods and readiness probes gate traffic.",state:{ready:true}},
{type:"annotation",from:"cluster",label:"Monitor release",description:"Observe error rate and latency; rollback if the rollout fails."}
]);
export const queueJourney=journey("reliable-message","Reliable asynchronous message processing","Explore an at-least-once delivery workflow where consumers must be idempotent.",["message-queues","idempotency","transactional-outbox"],[{id:"api",label:"API",kind:"service"},{id:"db",label:"Database",kind:"database"},{id:"broker",label:"Broker",kind:"service"},{id:"worker",label:"Worker",kind:"service"}],[
{type:"message",from:"api",to:"db",label:"Commit business event",description:"Save business state and outbox record atomically."},
{type:"message",from:"db",to:"broker",label:"Publish outbox message",description:"Relay publishes a pending event to the broker."},
{type:"message",from:"broker",to:"worker",label:"Deliver message",description:"Worker receives the message; duplicates are possible."},
{type:"message",from:"worker",to:"db",label:"Deduplicate and process",description:"Worker records the message identifier and business effects transactionally."},
{type:"message",from:"worker",to:"broker",label:"Acknowledge",description:"Acknowledge after successful processing. Failed messages may be retried."}
]);
export const simulations=[websiteJourney,oauthJourney,deliveryJourney,queueJourney];
