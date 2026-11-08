import {ConceptExplorer} from "../../components/knowledge/ConceptExplorer";
import {SiteNav} from "../../components/ui/SiteNav";
import {catalogue} from "../../data/catalogue";
export const metadata={title:"Explore Concepts | Engineering Universe"};
export default function ExplorePage(){return <main className="eu-page"><SiteNav/><h1>Explore engineering concepts</h1><p>Browse {catalogue.length} connected concepts across six engineering disciplines.</p><ConceptExplorer/></main>}
