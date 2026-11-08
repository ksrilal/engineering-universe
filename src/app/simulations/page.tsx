import {SimulationTimeline} from "../../components/simulation/SimulationTimeline";
import {websiteJourney} from "../../core/simulation/examples";
export const metadata={title:"Simulations | Engineering Universe"};
export default function SimulationsPage(){return <main className="eu-page"><a href="/">← Back to Universe</a><h1>Interactive simulations</h1><SimulationTimeline definition={websiteJourney}/></main>}
