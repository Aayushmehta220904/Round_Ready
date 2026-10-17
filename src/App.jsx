import { useEffect, useMemo, useState } from "react";
import { starterQuestions } from "./data/questions";
import { clearAll, loadMachine, loadQuestions, saveMachine, saveQuestions } from "./utils/storage";

const icons = {
  overview:"M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  list:"M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01",
  chart:"M5 20V10 M12 20V4 M19 20v-7",
  plus:"M12 5v14 M5 12h14",
  search:"M21 21l-4.35-4.35 M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14",
  edit:"M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z",
  trash:"M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v5 M14 11v5",
  check:"M5 12l4 4L19 6",
  clock:"M12 7v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  circle:"M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18",
  arrow:"M5 12h14 M14 7l5 5-5 5",
  reset:"M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7",
  menu:"M4 7h16 M4 12h16 M4 17h16",
  x:"M6 6l12 12 M18 6 6 18",
  target:"M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18 M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8 M12 12h.01",
  code:"M8 9l-4 3 4 3 M16 9l4 3-4 3 M14 5l-4 14",
  trophy:"M8 3h8v4a4 4 0 0 1-8 0Z M6 5H3v1a4 4 0 0 0 4 4 M18 5h3v1a4 4 0 0 1-4 4 M12 11v5 M8 21h8 M9 16h6v5H9",
  spark:"M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z"
};
function Icon({name,size=18}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name]||icons.spark}/></svg>}

const nav=[["overview","Overview"],["questions","Question bank"],["progress","Progress"]];
const cats=["All","DSA","Git","Technical"], stats=["All","Pending","In Progress","Completed"], diffs=["All","Easy","Medium","Hard"];
const nextStatus={Pending:"In Progress","In Progress":"Completed",Completed:"Pending"};

function Ring({value}){const n=Math.round(value); return <div className="ring" style={{"--p":`${n*3.6}deg`}}><div><strong>{n}%</strong><span>complete</span></div></div>}

function Drawer({open,editing,onClose,onSave}){
  const empty={title:"",category:"DSA",difficulty:"Easy",status:"Pending",note:""};
  const [form,setForm]=useState(empty); const [error,setError]=useState("");
  useEffect(()=>{setForm(editing?{...editing}:empty);setError("")},[open,editing]);
  if(!open)return null;
  const submit=e=>{e.preventDefault(); if(!form.title.trim()||!form.note.trim()){setError("Title and reference/note are required.");return;} onSave({...form,title:form.title.trim(),note:form.note.trim()})};
  return <div className="backdrop" onMouseDown={onClose}><aside className="drawer" onMouseDown={e=>e.stopPropagation()}>
    <div className="drawer-head"><div><span>{editing?"EDIT PRACTICE ITEM":"NEW PRACTICE ITEM"}</span><h2>{editing?"Update question":"Add to this week"}</h2></div><button className="icon-btn" onClick={onClose}><Icon name="x"/></button></div>
    <form onSubmit={submit}>
      <label>Question title<input autoFocus value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Explain React reconciliation"/></label>
      <div className="form-two"><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>DSA</option><option>Git</option><option>Technical</option></select></label><label>Difficulty<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>Easy</option><option>Medium</option><option>Hard</option></select></label></div>
      <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
      <label>Reference / note<textarea rows="5" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="LeetCode number, scenario, or revision note"/></label>
      {error&&<div className="form-error">{error}</div>}
      <div className="drawer-actions"><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary">{editing?"Save changes":"Add question"}</button></div>
    </form>
  </aside></div>
}

export default function App(){
  const [questions,setQuestions]=useState(()=>loadQuestions(starterQuestions));
  const [machine,setMachine]=useState(loadMachine); const [view,setView]=useState("overview"); const [mobile,setMobile]=useState(false);
  const [search,setSearch]=useState(""); const [category,setCategory]=useState("All"); const [status,setStatus]=useState("All"); const [difficulty,setDifficulty]=useState("All");
  const [drawer,setDrawer]=useState(false); const [editing,setEditing]=useState(null); const [toast,setToast]=useState("");
  useEffect(()=>saveQuestions(questions),[questions]); useEffect(()=>saveMachine(machine),[machine]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2200);return()=>clearTimeout(t)},[toast]);
  const complete=questions.filter(q=>q.status==="Completed").length; const pct=questions.length?complete/questions.length*100:0;
  const dsaDone=questions.filter(q=>q.category==="DSA"&&q.status==="Completed").length; const interviewDone=questions.filter(q=>q.category!=="DSA"&&q.status==="Completed").length;
  const tracks=useMemo(()=>["DSA","Git","Technical"].map(name=>{const a=questions.filter(q=>q.category===name),d=a.filter(q=>q.status==="Completed").length;return{name,total:a.length,done:d,p:a.length?Math.round(d/a.length*100):0}}),[questions]);
  const filtered=useMemo(()=>{const n=search.trim().toLowerCase();return questions.filter(q=>(!n||`${q.title} ${q.note}`.toLowerCase().includes(n))&&(category==="All"||q.category===category)&&(status==="All"||q.status===status)&&(difficulty==="All"||q.difficulty===difficulty))},[questions,search,category,status,difficulty]);
  const focus=[...questions.filter(q=>q.status==="In Progress"),...questions.filter(q=>q.status==="Pending")].slice(0,4);
  const add=()=>{setEditing(null);setDrawer(true)}; const edit=q=>{setEditing(q);setDrawer(true)};
  const save=form=>{if(editing){setQuestions(v=>v.map(q=>q.id===editing.id?{...form,id:editing.id}:q));setToast("Question updated")}else{setQuestions(v=>[{...form,id:`custom-${Date.now()}`},...v]);setToast("Question added")}setDrawer(false);setEditing(null)};
  const del=q=>{if(window.confirm(`Delete “${q.title}”?`)){setQuestions(v=>v.filter(x=>x.id!==q.id));setToast("Question deleted")}};
  const advance=id=>setQuestions(v=>v.map(q=>q.id===id?{...q,status:nextStatus[q.status]}:q));
  const reset=()=>{if(window.confirm("Restore the original Sheet 01 data and reset progress?")){clearAll();setQuestions(starterQuestions);setMachine("Not Started");setSearch("");setCategory("All");setStatus("All");setDifficulty("All");setToast("Sheet 01 restored")}};

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark">R</div><div><strong>RoundReady</strong><span>Interview prep workspace</span></div></div>
      <div className="sprint"><span>ACTIVE SPRINT</span><strong>Sheet 01</strong><small>Weekly interview preparation</small></div>
      <nav>{nav.map(([id,label])=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}><Icon name={id==="overview"?"overview":id==="questions"?"list":"chart"}/><span>{label}</span></button>)}</nav>
      <button className="reset" onClick={reset}><Icon name="reset" size={16}/>Restore Sheet 01</button>
      <div className="profile"><div>AM</div><span><strong>Aayush Mehta</strong><small>Sheet 01</small></span></div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="menu" onClick={()=>setMobile(!mobile)}><Icon name="menu"/></button><div><span>WEEKLY INTERVIEW PREP</span><h1>{view==="overview"?"Your prep command center":view==="questions"?"Question bank":"Progress review"}</h1></div><button className="btn primary" onClick={add}><Icon name="plus" size={16}/>Add question</button></header>
      {mobile&&<div className="mobile-nav">{nav.map(([id,label])=><button key={id} onClick={()=>{setView(id);setMobile(false)}}>{label}</button>)}</div>}

      {view==="overview"&&<div className="stack">
        <section className="hero"><div><span className="kicker">SHEET 01 · INTERVIEW SPRINT</span><h2>Know exactly what to practice next.</h2><p>Track DSA, Git & GitHub, technical interview questions and the machine-coding round without turning your prep into another spreadsheet.</p><button className="link-btn" onClick={()=>setView("questions")}>Open question bank <Icon name="arrow" size={15}/></button></div><Ring value={pct}/></section>
        <section className="metrics"><article><span>Total questions</span><strong>{questions.length}</strong><small>Across all tracks</small></article><article><span>DSA complete</span><strong>{dsaDone}/5</strong><small>LeetCode practice</small></article><article><span>Interview answers</span><strong>{interviewDone}/10</strong><small>Git + technical</small></article><article><span>Machine coding</span><strong className="compact">{machine==="Completed"?"Done":machine==="In Progress"?"Active":"Pending"}</strong><small>Frontend task</small></article></section>
        <section className="overview-grid"><article className="panel"><div className="panel-head"><div><span>FOCUS QUEUE</span><h3>What to do next</h3></div><Icon name="target"/></div><div className="focus-list">{focus.length?focus.map((q,i)=><button key={q.id} onClick={()=>{setView("questions");setSearch(q.title)}}><em>{String(i+1).padStart(2,"0")}</em><span><strong>{q.title}</strong><small>{q.category} · {q.status}</small></span><Icon name="arrow" size={14}/></button>):<div className="done"><Icon name="trophy"/><strong>Everything complete.</strong><small>You are ready for the mock interview.</small></div>}</div></article>
        <article className="panel"><div className="panel-head"><div><span>TRACK PROGRESS</span><h3>Preparation by section</h3></div><Icon name="chart"/></div><div className="track-list">{tracks.map(t=><div key={t.name}><div><strong>{t.name}</strong><span>{t.done}/{t.total}</span></div><div className="bar"><i style={{width:`${t.p}%`}}/></div><small>{t.p}%</small></div>)}</div></article></section>
        <section className="machine"><div className="machine-icon"><Icon name="code"/></div><div><span>MACHINE CODING</span><h3>Interview Practice Tracker</h3><p>React · LocalStorage · Responsive UI</p></div><div className="segments">{["Not Started","In Progress","Completed"].map(x=><button className={machine===x?"selected":""} key={x} onClick={()=>setMachine(x)}>{x}</button>)}</div></section>
      </div>}

      {view==="questions"&&<div className="stack"><section className="page-title"><div><span>QUESTION BANK</span><h2>Your weekly practice queue</h2><p>Add, edit, delete, search and filter every practice item from one place.</p></div><b>{filtered.length} of {questions.length}</b></section>
        <section className="filters"><div className="search"><Icon name="search" size={16}/><input id="question-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search question or note..."/></div><div className="filter-selects"><select value={category} onChange={e=>setCategory(e.target.value)}>{cats.map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}>{stats.map(x=><option key={x}>{x}</option>)}</select><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>{diffs.map(x=><option key={x}>{x}</option>)}</select></div></section>
        <section className="table">{filtered.length?<><div className="thead"><span>Question</span><span>Track</span><span>Difficulty</span><span>Status</span><span></span></div>{filtered.map(q=><article className="row" key={q.id}><div className="qcopy"><strong>{q.title}</strong><span>{q.note}</span></div><span className={`pill ${q.category.toLowerCase()}`}>{q.category}</span><span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span><button className={`status ${q.status.toLowerCase().replace(" ","-")}`} onClick={()=>advance(q.id)}><Icon name={q.status==="Completed"?"check":q.status==="In Progress"?"clock":"circle"} size={13}/>{q.status}</button><div className="actions"><button className="icon-btn" onClick={()=>edit(q)}><Icon name="edit" size={15}/></button><button className="icon-btn danger" onClick={()=>del(q)}><Icon name="trash" size={15}/></button></div></article>)}</>:<div className="empty"><Icon name="search" size={24}/><h3>No questions found</h3><p>Change your search or filters and try again.</p></div>}</section>
      </div>}

      {view==="progress"&&<div className="stack"><section className="page-title"><div><span>PROGRESS</span><h2>See the week at a glance</h2><p>Every number here is derived from your actual stored question statuses.</p></div></section><section className="progress-grid"><article className="panel overall"><Ring value={pct}/><div><span>OVERALL COMPLETION</span><h3>{complete} of {questions.length} questions completed</h3><p>{questions.length-complete} practice items remain this week.</p></div></article><article className="panel"><div className="panel-head"><div><span>BY TRACK</span><h3>Section breakdown</h3></div><Icon name="chart"/></div><div className="progress-cards">{tracks.map(t=><div key={t.name}><span>{t.name}</span><strong>{t.p}%</strong><small>{t.done} completed · {t.total-t.done} remaining</small><div className="bar"><i style={{width:`${t.p}%`}}/></div></div>)}</div></article></section><section className="machine"><div className="machine-icon"><Icon name="code"/></div><div><span>MACHINE CODING</span><h3>Interview Practice Tracker</h3><p>Track your project separately from interview questions.</p></div><div className="segments">{["Not Started","In Progress","Completed"].map(x=><button className={machine===x?"selected":""} key={x} onClick={()=>setMachine(x)}>{x}</button>)}</div></section></div>}
      <footer><span>RoundReady · Sheet 01</span><span>Built by Aayush Mehta</span></footer>
    </main>
    <Drawer open={drawer} editing={editing} onClose={()=>{setDrawer(false);setEditing(null)}} onSave={save}/>
    {toast&&<div className="toast"><Icon name="check" size={15}/>{toast}</div>}
  </div>
}
