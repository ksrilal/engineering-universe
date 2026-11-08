"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import type {Lesson} from "../../data/lessons";
export function LearningJourney({pathId,lessons}:{pathId:string;lessons:Lesson[]}){
 const key="eu-learning-"+pathId;
 const [completed,setCompleted]=useState<string[]>([]);
 const [selected,setSelected]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(key);if(raw){const data:unknown=JSON.parse(raw);if(Array.isArray(data))setCompleted(data.filter((x):x is string=>typeof x==="string"&&lessons.some(l=>l.id===x)))}}catch{}setLoaded(true)},[key,lessons]);
 const lesson=lessons[selected];
 if(!lesson)return <p>No lessons published for this path yet.</p>;
 const mark=()=>{if(answer!==lesson.quiz.correct)return;const next=[...new Set([...completed,lesson.id])];setCompleted(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}};
 const navigate=(i:number)=>{setSelected(i);setAnswer(null)};
 return <div className="eu-learning-layout"><aside className="eu-lesson-sidebar"><h2>Lessons</h2><p aria-live="polite">{loaded?completed.length:"—"} / {lessons.length} completed</p><progress value={completed.length} max={lessons.length} style={{width:"100%"}}/>{lessons.map((l,i)=><button key={l.id} type="button" aria-current={i===selected?"step":undefined} className={i===selected?"eu-lesson-selected":""} onClick={()=>navigate(i)}>{completed.includes(l.id)?"✓ ":""}{l.title}</button>)}</aside><article className="eu-panel eu-lesson-content"><small>Lesson {selected+1} of {lessons.length}</small><h2>{lesson.title}</h2><p><strong>Learning objective:</strong> {lesson.objective}</p>{lesson.explanation.map((p,i)=><p key={i}>{p}</p>)}<section><h3>Try it</h3><p>{lesson.example}</p><h3>Common misconception</h3><p>{lesson.pitfall}</p><h3>Practice</h3><p>{lesson.exercise}</p></section><section className="eu-quiz"><h3>Knowledge check</h3><p>{lesson.quiz.prompt}</p><fieldset><legend>Choose one answer</legend>{lesson.quiz.choices.map((choice,i)=><label key={i}><input type="radio" name={lesson.id} checked={answer===i} onChange={()=>setAnswer(i)}/>{choice}</label>)}</fieldset>{answer!==null&&<p role="status">{answer===lesson.quiz.correct?"Correct. ":"Not quite. "}{lesson.quiz.explanation}</p>}<button disabled={answer!==lesson.quiz.correct} onClick={mark}>{completed.includes(lesson.id)?"Completed ✓":"Mark lesson complete"}</button></section><div className="eu-lesson-actions"><button disabled={selected===0} onClick={()=>navigate(selected-1)}>← Previous</button>{selected<lessons.length-1?<button onClick={()=>navigate(selected+1)}>Next lesson →</button>:<Link href="/simulations">Explore simulation →</Link>}</div></article></div>
}
