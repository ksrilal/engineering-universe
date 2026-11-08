import Link from "next/link";
import {SiteNav} from "../../components/ui/SiteNav";
import {learningPaths} from "../../data/learning-paths";
import {catalogue} from "../../data/catalogue";
export const metadata={title:"Learning Paths | Engineering Universe"};
export default function LearnPage(){const names=new Map(catalogue.map(c=>[c.id,c.name]));return <main className="eu-page"><SiteNav/><h1>Learning paths</h1><p>Follow guided sequences through related engineering concepts.</p><div className="eu-card-grid">{learningPaths.map(p=><section className="eu-panel" key={p.id}><small>{p.level} · {p.conceptIds.length} concepts</small><h2>{p.title}</h2><p>{p.description}</p><ol>{p.conceptIds.map(id=><li key={id}><Link href={`/concepts/${id}`}>{names.get(id)||id}</Link></li>)}</ol></section>)}</div></main>}
