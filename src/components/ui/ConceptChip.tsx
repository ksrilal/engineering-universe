import type {Concept} from "../../core/knowledge/types";
export function ConceptChip({concept,onClick}:{concept:Pick<Concept,"id"|"name"|"domain">;onClick?:(id:string)=>void}){return <button type="button" className="eu-chip" onClick={()=>onClick?.(concept.id)}>{concept.name}<small>{concept.domain}</small></button>}
