import Link from "next/link";
import {notFound} from "next/navigation";
import {conceptScenarios,getConceptScenario} from "../../../../core/simulation/concept-scenarios";
import {ConceptSimulation} from "../../../../components/simulation/ConceptSimulation";
import {SiteNav} from "../../../../components/ui/SiteNav";
export function generateStaticParams(){return conceptScenarios.map(c=>({id:c.id}))}
export default async function ConceptSimulationPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const scenario=getConceptScenario(id);if(!scenario)notFound();
 return <main className="eu-page eu-lab-page"><SiteNav/><Link href={`/concepts/${id}`}>← {scenario.title} concept</Link><h1>{scenario.title} — interactive flow</h1><p>{scenario.summary}</p><p>This is a reusable domain-level visualization template. Topic-specific protocol behavior and detailed failure cases require separate authored simulations.</p><ConceptSimulation scenario={scenario}/></main>
}
