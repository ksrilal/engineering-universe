import Link from "next/link";
import {SimulationLibrary} from "../../components/simulation/SimulationLibrary";
import {simulations} from "../../core/simulation/library";
import {SiteNav} from "../../components/ui/SiteNav";
export const metadata={title:"Simulations | Engineering Universe"};
export default function SimulationsPage(){return <main className="eu-page"><SiteNav/><h1>Interactive simulations</h1><p>Step through deterministic, illustrative engineering scenarios. Timings are not measured network timings.</p><section className="eu-panel"><h2>IP Addressing &amp; Subnetting Lab</h2><p>Calculate IPv4 and IPv6 network prefixes, visualize binary network/host bits, explore broadcast and test same-subnet routing.</p><Link href="/simulations/ip-addressing">Launch IP subnetting lab →</Link></section><section className="eu-panel"><h2>Featured: HTTP Request 3D Lab</h2><p>Watch packets and protocol messages move through a 3D network with automatic playback, manual steps, an inspector and a message-size chart.</p><Link href="/simulations/http-request">Launch interactive lab →</Link></section><SimulationLibrary definitions={simulations}/></main>}
