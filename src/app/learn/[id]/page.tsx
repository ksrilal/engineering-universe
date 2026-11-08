import Link from "next/link";
import {notFound} from "next/navigation";
import {learningPaths} from "../../../data/learning-paths";
import {getLessons} from "../../../data/lessons";
import {LearningJourney} from "../../../components/learning/LearningJourney";
import {SiteNav} from "../../../components/ui/SiteNav";
export function generateStaticParams(){return learningPaths.map(p=>({id:p.id}))}
export default async function LearningPathPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const path=learningPaths.find(p=>p.id===id);if(!path)notFound();
 const lessons=getLessons(id);
 return <main className="eu-page"><SiteNav/><Link href="/learn">← All learning paths</Link><h1>{path.title}</h1><p>{path.description}</p><LearningJourney pathId={id} lessons={lessons}/></main>
}
