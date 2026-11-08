import Link from "next/link";
import {notFound} from "next/navigation";
import {catalogue,knowledgeCatalogue} from "../../../data/catalogue";
import {KnowledgeGraphService} from "../../../core/knowledge/graph";
import {SiteNav} from "../../../components/ui/SiteNav";
import {Panel} from "../../../components/ui/Panel";
const service=new KnowledgeGraphService(knowledgeCatalogue);
export function generateStaticParams(){return catalogue.map(c=>({id:c.id}))}
export default async function ConceptPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const concept=service.get(id);if(!concept)notFound();
 const related=service.neighbors(id);
 return <main className="eu-page"><SiteNav/><small>{concept.domain} · {concept.kind}</small><h1>{concept.name}</h1><p>{concept.description}</p><Panel title="Overview"><p>{concept.summary}</p><p>This page is a structured foundation. Detailed protocol explanations, diagrams and authoritative references will be added during content review.</p></Panel><Panel title="Connected concepts">{related.length?<div className="eu-link-grid">{related.map(c=><Link key={c.id} href={`/concepts/${c.id}`}>{c.name} →</Link>)}</div>:<p>Relationships are being curated for this topic.</p>}</Panel><Link href="/explore">← Browse all concepts</Link></main>
}
