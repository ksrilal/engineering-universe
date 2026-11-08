import {SiteNav} from "../../../components/ui/SiteNav";
import {HttpRequestLab} from "../../../components/simulation/HttpRequestLab";
export const metadata={title:"HTTP Request 3D Lab | Engineering Universe"};
export default function HttpRequestPage(){return <main className="eu-page eu-lab-page"><SiteNav/><h1>Inside an HTTP request</h1><p>Click through the complete journey: button → browser → DNS → gateway → server → response → DOM. Rotate the 3D scene and inspect each message.</p><HttpRequestLab/></main>}
