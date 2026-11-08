import Link from "next/link";
import {SiteNav} from "../../components/ui/SiteNav";
import {learningPaths} from "../../data/learning-paths";
import {catalogue} from "../../data/catalogue";
import {getLessons} from "../../data/lessons";
export const metadata={title:"Learning Paths | Engineering Universe"};
export default function LearnPage(){const names=new Map(catalogue.map(c=>[c.id,c.name]));return <main className="eu-page"><SiteNav/><h1>Learning paths</h1><p>Follow guided sequences through related engineering concepts.</p><div className="eu-card-grid">{learningPaths.map(p=><section className="eu-panel" key={p.id}><small>{p.level} · {p.conceptIds.length} concepts</small><h2><Link href={`/learn/${p.id}`}>{p.title}</Link></h2><p><strong>{getLessons(p.id).length} published lessons</strong></p><p>{p.description}</p><ol>{p.conceptIds.map(id=><li key={id}><Link href={`/concepts/${id}`}>{names.get(id)||id}</Link></li>)}</ol><Link href={`/learn/${p.id}`}>{getLessons(p.id).length?"Start learning →":"View path →"}</Link></section>)}</div></main>}
