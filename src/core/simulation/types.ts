export type SimulationEventType = "message"|"state-change"|"delay"|"failure"|"annotation";
export type SimulationActor = {id:string;label:string;kind:"client"|"server"|"network"|"service"|"database"|"user"};
export type SimulationEvent = {id:string;atMs:number;type:SimulationEventType;from?:string;to?:string;label:string;description:string;state?:Record<string,string|number|boolean>};
export type SimulationDefinition = {id:string;title:string;summary:string;conceptIds:string[];actors:SimulationActor[];events:SimulationEvent[];durationMs:number};
export type SimulationSnapshot = {elapsedMs:number;index:number;events:SimulationEvent[];state:Record<string,string|number|boolean>;complete:boolean};
