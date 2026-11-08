export const DOMAINS = ["Networking","Security","DevOps","Software","Cloud","Distributed Systems"] as const;
export type Domain = typeof DOMAINS[number];
export type ConceptId = string;
export type ConceptKind = "principle"|"protocol"|"technology"|"product"|"pattern";
export type RelationshipType = "PREREQUISITE_OF"|"USES"|"SECURED_BY"|"RUNS_OVER"|"PART_OF"|"ALTERNATIVE_TO"|"IMPLEMENTED_BY"|"APPEARS_IN"|"RELATED_TO";
export interface Concept { id:ConceptId; name:string; domain:Domain; kind:ConceptKind; summary:string; description:string; tags:string[]; references?:{title:string;url:string}[] }
export interface Relationship { id:string; source:ConceptId; target:ConceptId; type:RelationshipType; description?:string }
export interface KnowledgeGraph { concepts:Concept[]; relationships:Relationship[] }
