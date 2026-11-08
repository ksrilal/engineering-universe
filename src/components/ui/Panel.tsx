import type {ReactNode} from "react";
export function Panel({title,children,className=""}:{title?:string;children:ReactNode;className?:string}){return <section className={"eu-panel "+className}>{title&&<h2>{title}</h2>}{children}</section>}
