import {SiteNav} from "../../../components/ui/SiteNav";
import {IPLab} from "../../../components/simulation/IPLab";
export const metadata={title:"IPv4 and IPv6 Subnet Lab | Engineering Universe"};
export default function IPAddressingPage(){return <main className="eu-page eu-lab-page"><SiteNav/><h1>IP Addressing &amp; Subnetting Lab</h1><p>Discover how an address is divided into network and host bits. Change IPv4/IPv6 addresses and prefix lengths to see network boundaries, subnet masks, broadcast behavior and packet routing update instantly.</p><IPLab/></main>}
