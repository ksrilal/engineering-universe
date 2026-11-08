import {SimulationLibrary} from "../../components/simulation/SimulationLibrary";
import {simulations} from "../../core/simulation/library";
import {SiteNav} from "../../components/ui/SiteNav";
export const metadata={title:"Simulations | Engineering Universe"};
export default function SimulationsPage(){return <main className="eu-page"><SiteNav/><h1>Interactive simulations</h1><p>Step through deterministic, illustrative engineering scenarios. Timings are not measured network timings.</p><SimulationLibrary definitions={simulations}/></main>}
