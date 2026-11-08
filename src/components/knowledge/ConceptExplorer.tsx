"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {catalogue,knowledgeCatalogue} from "../../data/catalogue";
import {KnowledgeGraphService} from "../../core/knowledge/graph";
import {DOMAINS} from "../../core/knowledge/types";
import type {Domain} from "../../core/knowledge/types";
const service=new KnowledgeGraphService(knowledgeCatalogue);
export function ConceptExplorer(){
 const [query,setQuery]=useState("");const [domain,setDomain]=useState<Domain|"All">("All");
 const results=useMemo(()=>{const list=query.trim()?service.search(query,300):catalogue;return list.filter(c=>domain==="All"||c.domain===domain)},[query,domain]);
 return <><div className="eu-filters"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search all concepts..." aria-label="Search concepts"/><select aria-label="Filter by domain" value={domain} onChange={e=>setDomain(e.target.value as Domain|"All")}><option value="All">All domains</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select></div><p>{results.length} concepts found</p><div className="eu-card-grid">{results.map(c=><Link key={c.id} href={`/concepts/${c.id}`} className="eu-concept-card"><small>{c.domain}</small><h2>{c.name}</h2><p>{c.summary}</p></Link>)}</div></>
}
