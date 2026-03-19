import { useState, useEffect, useRef } from "react";

// ─── STORAGE ──────────────────────────────────────────────────────────────
async function load(key) {
  try {
    const r = await window.storage.get(key);
    if (!r || r.value === undefined || r.value === null) return null;
    return JSON.parse(r.value);
  } catch(e) { return null; }
}
async function save(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value));
    return true;
  } catch(e) {
    console.error("Storage save failed:", key, e);
    return true; // still update UI optimistically
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────────
function getToday() { return new Date().toISOString().split("T")[0]; }
function getWeekKey() { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); return d.toISOString().split("T")[0]; }
function formatDate(s) { if (!s) return "—"; try { return new Date(s+"T12:00:00").toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"}); } catch { return s; } }
function daysSince(s) { if (!s) return null; return Math.floor((Date.now()-new Date(s+"T12:00:00"))/(1000*60*60*24)); }

// ─── COLORS ───────────────────────────────────────────────────────────────
const C = {
  orange:"#f05a1a", orangeDim:"rgba(240,90,26,0.12)", orangeBorder:"rgba(240,90,26,0.28)",
  blue:"#3a9de8", blueDim:"rgba(58,157,232,0.12)", blueBorder:"rgba(58,157,232,0.28)",
  green:"#3ecf82", greenDim:"rgba(62,207,130,0.12)", greenBorder:"rgba(62,207,130,0.28)",
  purple:"#9d6ef5", purpleDim:"rgba(157,110,245,0.12)", purpleBorder:"rgba(157,110,245,0.28)",
  yellow:"#f5a623", yellowDim:"rgba(245,166,35,0.12)", yellowBorder:"rgba(245,166,35,0.28)",
  red:"#e84040", redDim:"rgba(232,64,64,0.12)", redBorder:"rgba(232,64,64,0.28)",
  bg:"#0d0d0d", surface:"#141414", card:"#161616", border:"#1e1e1e",
  muted:"#555", light:"#888", white:"#f2ede4",
};

// ─── SHARED UI ────────────────────────────────────────────────────────────
function SectionHead({ label, color=C.orange }) {
  return (
    <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color,marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
      {label}<div style={{flex:1,height:1,background:C.border}}/>
    </div>
  );
}
function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px",marginBottom:10,cursor:onClick?"pointer":undefined,...style}}>
      {children}
    </div>
  );
}
function Inp({ label, value, onChange, placeholder, type="text", multiline }) {
  const s = {background:"#1a1a1a",border:"1px solid #252525",borderRadius:6,color:C.white,fontSize:14,padding:"9px 12px",width:"100%",outline:"none",fontFamily:"inherit",resize:multiline?"vertical":"none",boxSizing:"border-box"};
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:11,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</div>}
      {multiline
        ? <textarea rows={3} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>
        : <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
    </div>
  );
}
function Btn({ label, onClick, color=C.orange, small, variant }) {
  return (
    <button onClick={onClick} style={{padding:small?"7px 14px":"12px 20px",background:variant==="saved"?"rgba(62,207,130,0.15)":color+"1e",border:`1px solid ${variant==="saved"?"rgba(62,207,130,0.4)":color+"55"}`,borderRadius:6,color:variant==="saved"?C.green:color,fontSize:small?11:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s"}}>
      {variant==="saved"?"✓ Saved":label}
    </button>
  );
}
function Badge({ label, color }) {
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:color+"22",color,border:`1px solid ${color}44`,letterSpacing:"0.06em"}}>{label}</span>;
}
function BackBtn({ onBack }) {
  return <button onClick={onBack} style={{background:"none",border:"none",color:C.orange,fontSize:13,fontWeight:600,cursor:"pointer",padding:"0 0 16px",letterSpacing:"0.05em"}}>← Back</button>;
}
function SubTabs({ tabs, active, onChange, color=C.orange }) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:20,background:C.surface,borderRadius:8,padding:4,border:`1px solid ${C.border}`}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,padding:"8px",background:active===t.id?color+"1e":"transparent",border:`1px solid ${active===t.id?color+"44":"transparent"}`,borderRadius:6,color:active===t.id?color:C.muted,fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
function useSaveIndicator() {
  const [state, setState] = useState("idle");
  const show = (ok=true) => { setState(ok?"saved":"error"); setTimeout(()=>setState("idle"),2000); };
  return [state, show];
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({ onNav }) {
  const today = getToday();
  const weekKey = getWeekKey();
  const [streaks, setStreaks] = useState(null);
  const [weekPipeline, setWeekPipeline] = useState({});
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(()=>{
    (async()=>{
      const [s,w,c,p] = await Promise.all([load("streaks"),load(`week:${weekKey}`),load("clients"),load("partners")]);
      setStreaks(s||{});
      setWeekPipeline((w&&w.totals)||{});
      setClients(c||[]);
      setPartners(p||[]);
    })();
  },[]);

  if (streaks===null) return <div style={{padding:40,textAlign:"center",color:C.muted}}>Loading...</div>;

  const streakItems = [
    {id:"bible",label:"Bible",icon:"📖",color:C.purple},
    {id:"book",label:"Book",icon:"📚",color:C.blue},
    {id:"podcast",label:"Podcast",icon:"🎧",color:C.green},
  ];
  const pipelineItems = [
    {id:"ig_convos",label:"IG Convos",target:3,color:C.orange},
    {id:"bb_convos",label:"Bumble Biz",target:3,color:C.yellow},
    {id:"drop_messages",label:"Drop Msgs",target:7,color:C.blue},
  ];

  const followUps = clients.filter(c=>c.followUpDate&&c.followUpDate>=today).sort((a,b)=>a.followUpDate.localeCompare(b.followUpDate)).slice(0,3);
  const overdueFollowUps = clients.filter(c=>c.followUpDate&&c.followUpDate<today);
  const partnersDue = partners.filter(p=>p.lastTouchbase&&daysSince(p.lastTouchbase)>14).slice(0,3);

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>{today}</div>
        <div style={{fontSize:26,fontWeight:800}}>Good morning, Austin.</div>
      </div>

      <SectionHead label="Today's Growth" color={C.purple}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
        {streakItems.map(s=>{
          const streak = streaks[s.id]?.streak||0;
          const done = streaks[s.id]?.lastDate===today;
          return (
            <div key={s.id} onClick={()=>onNav("growth")} style={{background:done?s.color+"1a":C.card,border:`1px solid ${done?s.color+"44":C.border}`,borderRadius:8,padding:"14px 12px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
              <div style={{fontSize:22,fontWeight:800,color:done?s.color:C.muted,lineHeight:1}}>{streak}</div>
              <div style={{fontSize:10,color:done?s.color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3}}>{done?"✓ Done":"Not yet"}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <SectionHead label="This Week — Pipeline" color={C.orange}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
        {pipelineItems.map(p=>{
          const val=weekPipeline[p.id]||0;
          const pct=Math.min(100,Math.round((val/p.target)*100));
          const sc=pct>=100?C.green:pct>=60?C.yellow:C.red;
          return (
            <div key={p.id} onClick={()=>onNav("pipeline")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 12px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:24,fontWeight:800,color:sc,lineHeight:1}}>{val}</div>
              <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3}}>/ {p.target}</div>
              <div style={{fontSize:10,color:C.light,marginTop:4}}>{p.label}</div>
              <div style={{marginTop:8,background:"#1a1a1a",borderRadius:3,height:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:sc,borderRadius:3}}/>
              </div>
            </div>
          );
        })}
      </div>

      {(overdueFollowUps.length>0||followUps.length>0)&&(
        <>
          <SectionHead label="Client Follow-Ups" color={C.blue}/>
          {overdueFollowUps.length>0&&(
            <Card style={{borderColor:C.redBorder,background:C.redDim}} onClick={()=>onNav("clients")}>
              <div style={{fontSize:13,color:C.red,fontWeight:600}}>⚠ {overdueFollowUps.length} overdue</div>
              <div style={{fontSize:12,color:C.light,marginTop:2}}>{overdueFollowUps.map(c=>c.name).join(", ")}</div>
            </Card>
          )}
          {followUps.map(c=>(
            <Card key={c.id} onClick={()=>onNav("clients")} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{c.name}</div><div style={{fontSize:12,color:C.muted}}>{formatDate(c.followUpDate)}</div></div>
              <Badge label="Due Soon" color={C.blue}/>
            </Card>
          ))}
        </>
      )}

      {partnersDue.length>0&&(
        <>
          <SectionHead label="Partner Touchbases Overdue" color={C.green}/>
          {partnersDue.map(p=>(
            <Card key={p.id} onClick={()=>onNav("partners")} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{p.name}</div><div style={{fontSize:12,color:C.muted}}>{daysSince(p.lastTouchbase)}d since last touchbase</div></div>
              <Badge label="Overdue" color={C.red}/>
            </Card>
          ))}
        </>
      )}

      <SectionHead label="Quick Access" color={C.muted}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{id:"growth",label:"Growth Log",icon:"🌱"},{id:"pipeline",label:"Pipeline",icon:"🔥"},{id:"clients",label:"Clients",icon:"🤝"},{id:"partners",label:"Partners",icon:"⚡"},{id:"content",label:"Content",icon:"🎬"},{id:"links",label:"Other Apps",icon:"🔗"}].map(n=>(
          <div key={n.id} onClick={()=>onNav(n.id)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:13,fontWeight:600}}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH LOG
// ═══════════════════════════════════════════════════════════════════════════
function GrowthLog() {
  const today = getToday();
  const [tab, setTab] = useState("today");
  const [streaks, setStreaks] = useState(null);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({type:"bible",title:"",notes:"",date:today});
  const [saveState, showSave] = useSaveIndicator();

  useEffect(()=>{
    (async()=>{
      const [s,e] = await Promise.all([load("streaks"),load("growth-entries")]);
      setStreaks(s||{});
      setEntries(e||[]);
    })();
  },[]);

  const markDone = async (id) => {
    // Read current streaks, update the one item, save and update state
    const current = (await load("streaks")) || {};
    const item = current[id] || {streak:0,lastDate:null};
    if (item.lastDate===today) return; // already done
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const yKey = yesterday.toISOString().split("T")[0];
    const newStreak = item.lastDate===yKey ? item.streak+1 : 1;
    const updated = {...current, [id]:{streak:newStreak,lastDate:today}};
    await save("streaks", updated);
    setStreaks(updated);
  };

  const saveEntry = async () => {
    if (!form.title.trim()&&!form.notes.trim()) return;
    const newEntry = {...form, id:Date.now().toString(), date:form.date||today};
    const updated = [...entries, newEntry];
    await save("growth-entries", updated);
    setEntries(updated);
    setForm({type:"bible",title:"",notes:"",date:today});
    showSave();
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(x=>x.id!==id);
    await save("growth-entries", updated);
    setEntries(updated);
  };

  if (streaks===null) return <div style={{padding:40,textAlign:"center",color:C.muted}}>Loading...</div>;

  const streakItems = [
    {id:"bible",label:"Bible Reading",icon:"📖",color:C.purple},
    {id:"book",label:"Book Reading",icon:"📚",color:C.blue},
    {id:"podcast",label:"Podcast",icon:"🎧",color:C.green},
  ];
  const typeColors = {bible:C.purple,book:C.blue,podcast:C.green,event:C.orange};
  const typeLabels = {bible:"📖 Bible",book:"📚 Book",podcast:"🎧 Podcast",event:"📋 Event"};

  return (
    <div>
      <SubTabs tabs={[{id:"today",label:"Today"},{id:"log",label:"Add Entry"},{id:"history",label:"History"}]} active={tab} onChange={setTab} color={C.purple}/>

      {tab==="today"&&(
        <div>
          <SectionHead label="Today's Streaks" color={C.purple}/>
          {streakItems.map(s=>{
            const done = streaks[s.id]?.lastDate===today;
            const streak = streaks[s.id]?.streak||0;
            return (
              <Card key={s.id} onClick={done?undefined:()=>markDone(s.id)} style={{display:"flex",alignItems:"center",gap:16,borderColor:done?s.color+"44":C.border,background:done?s.color+"0d":C.card,cursor:done?"default":"pointer"}}>
                <span style={{fontSize:28}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14}}>{s.label}</div>
                  <div style={{fontSize:13,color:done?s.color:C.muted}}>{streak} day streak{done?" ✓":""}</div>
                </div>
                {done
                  ? <Badge label="Done Today" color={s.color}/>
                  : <span style={{fontSize:12,fontWeight:700,color:s.color,background:s.color+"22",border:`1px solid ${s.color}44`,padding:"8px 14px",borderRadius:6,letterSpacing:"0.08em",textTransform:"uppercase",pointerEvents:"none"}}>Mark Done</span>}
              </Card>
            );
          })}
        </div>
      )}

      {tab==="log"&&(
        <div>
          <SectionHead label="Add Entry" color={C.purple}/>
          <Card>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.1em"}}>Type</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(typeLabels).map(([k,v])=>(
                  <button key={k} onClick={()=>setForm(f=>({...f,type:k}))} style={{padding:"5px 10px",background:form.type===k?typeColors[k]+"22":"#1a1a1a",border:`1px solid ${form.type===k?typeColors[k]+"55":"#252525"}`,borderRadius:6,color:form.type===k?typeColors[k]:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{v}</button>
                ))}
              </div>
            </div>
            <Inp label="Title / Topic" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="What did you read / hear / attend?"/>
            <Inp label="Key Takeaway / Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="What stood out? What will you apply?" multiline/>
            <Inp label="Date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
            <Btn label="Save Entry" onClick={saveEntry} color={C.purple} variant={saveState==="saved"?"saved":undefined}/>
          </Card>
        </div>
      )}

      {tab==="history"&&(
        <div>
          <SectionHead label="Growth History" color={C.purple}/>
          {entries.length===0&&<div style={{textAlign:"center",color:C.muted,padding:40,fontSize:14}}>No entries yet.</div>}
          {[...entries].reverse().map(e=>(
            <Card key={e.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Badge label={typeLabels[e.type]||e.type} color={typeColors[e.type]||C.muted}/>
                  <span style={{fontSize:12,color:C.muted}}>{formatDate(e.date)}</span>
                </div>
                <button onClick={()=>deleteEntry(e.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
              </div>
              {e.title&&<div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{e.title}</div>}
              {e.notes&&<div style={{fontSize:13,color:C.light,lineHeight:1.6}}>{e.notes}</div>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE
// ═══════════════════════════════════════════════════════════════════════════
function Pipeline() {
  const today = getToday();
  const weekKey = getWeekKey();
  const [tab, setTab] = useState("daily");
  const [dailyLog, setDailyLog] = useState(null);
  const [weekTotals, setWeekTotals] = useState({});
  const [saveState, showSave] = useSaveIndicator();

  const METRICS = [
    {id:"ig_convos",label:"IG Convos Started",icon:"📸",color:C.orange,target:3},
    {id:"bb_convos",label:"Bumble Biz Convos",icon:"🐝",color:C.yellow,target:3},
    {id:"drop_messages",label:"Drop Messages Sent",icon:"📩",color:C.blue,target:7},
    {id:"vetting_meetings",label:"Vetting Meetings",icon:"🤝",color:C.green,outcome:true},
    {id:"new_partners",label:"New Partners Added",icon:"⚡",color:C.purple,outcome:true},
  ];

  useEffect(()=>{
    (async()=>{
      const [d,w] = await Promise.all([load(`daily:${today}`),load(`week:${weekKey}`)]);
      setDailyLog(d||{});
      setWeekTotals((w&&w.totals)||{});
    })();
  },[]);

  const inc = (id) => setDailyLog(p=>({...p,[id]:(p[id]||0)+1}));
  const dec = (id) => setDailyLog(p=>({...p,[id]:Math.max(0,(p[id]||0)-1)}));
  const setVal = (id,v) => setDailyLog(p=>({...p,[id]:Math.max(0,parseInt(v)||0)}));

  const savePipeline = async () => {
    await save(`daily:${today}`, dailyLog);
    // Recalc weekly totals
    const ws = new Date(weekKey);
    let wt = {};
    for (let i=0;i<7;i++) {
      const d2 = new Date(ws); d2.setDate(d2.getDate()+i);
      const dk = d2.toISOString().split("T")[0];
      const dl = dk===today ? dailyLog : ((await load(`daily:${dk}`))||{});
      METRICS.forEach(m=>{ wt[m.id]=(wt[m.id]||0)+(dl[m.id]||0); });
    }
    await save(`week:${weekKey}`, {totals:wt,weekStart:weekKey});
    // Weekly history
    const hist = (await load("week-history"))||[];
    await save("week-history", [...hist.filter(h=>h.weekStart!==weekKey),{weekStart:weekKey,totals:wt}].slice(-52));
    setWeekTotals(wt);
    showSave();
  };

  if (dailyLog===null) return <div style={{padding:40,textAlign:"center",color:C.muted}}>Loading...</div>;

  return (
    <div>
      <SubTabs tabs={[{id:"daily",label:"Today"},{id:"week",label:"This Week"}]} active={tab} onChange={setTab} color={C.orange}/>

      {tab==="daily"&&(
        <div>
          <SectionHead label={`Today — ${today}`} color={C.orange}/>
          {METRICS.map(m=>(
            <Card key={m.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{m.icon} {m.label}</div>
                  <div style={{fontSize:11,color:C.muted,fontStyle:m.outcome?"italic":undefined}}>{m.outcome?"Outcome — log when it happens":`Weekly target: ${m.target}`}</div>
                </div>
                <div style={{fontSize:26,fontWeight:800,color:m.color}}>{dailyLog[m.id]||0}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>dec(m.id)} style={{width:44,height:44,background:"#1a1a1a",border:"1px solid #252525",borderRadius:6,color:C.light,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <input type="number" inputMode="numeric" value={dailyLog[m.id]||""} placeholder="0" onChange={e=>setVal(m.id,e.target.value)} style={{flex:1,background:"#1a1a1a",border:"1px solid #252525",borderRadius:6,color:C.white,fontSize:18,fontWeight:700,padding:"10px",outline:"none",fontFamily:"inherit",textAlign:"center"}}/>
                <button onClick={()=>inc(m.id)} style={{width:44,height:44,background:m.color+"22",border:`1px solid ${m.color}44`,borderRadius:6,color:m.color,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </Card>
          ))}
          <Btn label="Save Today" onClick={savePipeline} variant={saveState==="saved"?"saved":undefined}/>
        </div>
      )}

      {tab==="week"&&(
        <div>
          <SectionHead label="This Week" color={C.orange}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[{id:"ig_convos",label:"Instagram",icon:"📸",color:C.orange,target:3},{id:"bb_convos",label:"Bumble Biz",icon:"🐝",color:C.yellow,target:3}].map(p=>{
              const val=weekTotals[p.id]||0; const pct=Math.min(100,Math.round((val/p.target)*100)); const sc=pct>=100?C.green:pct>=60?C.yellow:C.red;
              return (
                <Card key={p.id} style={{textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{p.icon}</div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{p.label}</div>
                  <div style={{fontSize:28,fontWeight:700,color:sc,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>of {p.target}</div>
                  <div style={{marginTop:8,background:"#1a1a1a",borderRadius:3,height:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:sc,borderRadius:3}}/></div>
                </Card>
              );
            })}
          </div>
          {METRICS.map(m=>{
            const val=weekTotals[m.id]||0; const pct=m.outcome?null:Math.min(100,Math.round((val/m.target)*100)); const sc=pct!==null?(pct>=100?C.green:pct>=60?C.yellow:C.red):m.color;
            return (
              <Card key={m.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:m.outcome?0:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span>{m.icon}</span><span style={{fontSize:14,fontWeight:500}}>{m.label}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13,color:C.muted}}>{val}{!m.outcome?` / ${m.target}`:""}</span>
                    <Badge label={m.outcome?"Outcome":`${pct}%`} color={sc}/>
                  </div>
                </div>
                {!m.outcome&&<div style={{background:"#1a1a1a",borderRadius:3,height:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:sc,borderRadius:3}}/></div>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════════════════════
function Clients() {
  const today = getToday();
  const [clients, setClients] = useState(null);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const emptyForm = {name:"",phone:"",email:"",samples:"",notes:"",followUpDate:"",reachOutDate:today};
  const [form, setForm] = useState(emptyForm);
  const [saveState, showSave] = useSaveIndicator();

  useEffect(()=>{ load("clients").then(c=>setClients(c||[])); },[]);

  const saveClient = async () => {
    if (!form.name.trim()) return;
    const updated = selected
      ? clients.map(c=>c.id===selected.id?{...form,id:selected.id}:c)
      : [...clients,{...form,id:Date.now().toString()}];
    await save("clients", updated);
    setClients(updated); showSave(); setView("list"); setSelected(null); setForm(emptyForm);
  };

  const del = async (id) => {
    const updated = clients.filter(c=>c.id!==id);
    await save("clients",updated);
    setClients(updated); setView("list"); setSelected(null);
  };

  const openEdit = (c) => { setSelected(c); setForm({...emptyForm,...c}); setView("form"); };

  if (clients===null) return <div style={{padding:40,textAlign:"center",color:C.muted}}>Loading...</div>;

  if (view==="form") return (
    <div>
      <BackBtn onBack={()=>{setView("list");setSelected(null);setForm(emptyForm);}}/>
      <SectionHead label={selected?"Edit Client":"New Client"} color={C.blue}/>
      <Card>
        <Inp label="Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Full name"/>
        <Inp label="Phone" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="Phone number"/>
        <Inp label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="Email address"/>
        <Inp label="Reach Out Date" value={form.reachOutDate} onChange={v=>setForm(f=>({...f,reachOutDate:v}))} type="date"/>
        <Inp label="Samples Given" value={form.samples} onChange={v=>setForm(f=>({...f,samples:v}))} placeholder="e.g. Protein shake — Sept 2025" multiline/>
        <Inp label="Follow-Up Date" value={form.followUpDate} onChange={v=>setForm(f=>({...f,followUpDate:v}))} type="date"/>
        <Inp label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Context, observations..." multiline/>
        <div style={{display:"flex",gap:8}}>
          <Btn label="Save Client" onClick={saveClient} color={C.blue} variant={saveState==="saved"?"saved":undefined}/>
          {selected&&<Btn label="Delete" onClick={()=>del(selected.id)} color={C.red} small/>}
        </div>
      </Card>
    </div>
  );

  const sorted = [...clients].sort((a,b)=>{
    const aO=a.followUpDate&&a.followUpDate<today; const bO=b.followUpDate&&b.followUpDate<today;
    if (aO&&!bO) return -1; if (!aO&&bO) return 1;
    return (a.followUpDate||"z").localeCompare(b.followUpDate||"z");
  });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SectionHead label={`Clients (${clients.length})`} color={C.blue}/>
        <Btn label="+ Add" onClick={()=>{setSelected(null);setForm(emptyForm);setView("form");}} color={C.blue} small/>
      </div>
      {clients.length===0&&<div style={{textAlign:"center",color:C.muted,padding:40,fontSize:14}}>No clients yet.</div>}
      {sorted.map(c=>{
        const overdue=c.followUpDate&&c.followUpDate<today;
        const due=c.followUpDate&&c.followUpDate===today;
        return (
          <Card key={c.id} onClick={()=>openEdit(c)} style={{borderColor:overdue?C.redBorder:due?C.blueBorder:C.border}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>{c.name}</div>
                {c.phone&&<div style={{fontSize:12,color:C.muted}}>{c.phone}</div>}
                {c.reachOutDate&&<div style={{fontSize:12,color:C.muted}}>Reached out: {formatDate(c.reachOutDate)}</div>}
                {c.samples&&<div style={{fontSize:12,color:C.light,marginTop:4}}>Samples: {c.samples}</div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                {overdue&&<Badge label="Overdue" color={C.red}/>}
                {due&&<Badge label="Due Today" color={C.blue}/>}
                {c.followUpDate&&!overdue&&!due&&<div style={{fontSize:11,color:C.muted}}>Follow-up<br/>{formatDate(c.followUpDate)}</div>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTNERS
// ═══════════════════════════════════════════════════════════════════════════
const STAGES = ["Prospect","Evaluating","Active Partner","Paused","Closed"];
const STAGE_COLORS = {"Prospect":C.muted,"Evaluating":C.yellow,"Active Partner":C.green,"Paused":C.orange,"Closed":C.red};

function Partners() {
  const [partners, setPartners] = useState(null);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const emptyForm = {name:"",phone:"",email:"",stage:"Prospect",partnerSince:"",lastTouchbase:"",touchbaseDates:[],notes:"",strengths:"",concerns:"",goals:""};
  const [form, setForm] = useState(emptyForm);
  const [newTB, setNewTB] = useState(getToday());
  const [saveState, showSave] = useSaveIndicator();

  useEffect(()=>{ load("partners").then(p=>setPartners(p||[])); },[]);

  const savePartner = async () => {
    if (!form.name.trim()) return;
    const updated = selected
      ? partners.map(p=>p.id===selected.id?{...form,id:selected.id}:p)
      : [...partners,{...form,id:Date.now().toString()}];
    await save("partners",updated);
    setPartners(updated); showSave(); setView("list"); setSelected(null); setForm(emptyForm);
  };

  const del = async (id) => {
    const updated = partners.filter(p=>p.id!==id);
    await save("partners",updated);
    setPartners(updated); setView("list"); setSelected(null);
  };

  const openEdit = (p) => { setSelected(p); setForm({...emptyForm,...p,touchbaseDates:p.touchbaseDates||[]}); setView("form"); };

  const addTouchbase = () => {
    if (!newTB) return;
    const dates = [...new Set([...(form.touchbaseDates||[]),newTB])].sort((a,b)=>b.localeCompare(a));
    setForm(f=>({...f,touchbaseDates:dates,lastTouchbase:dates[0]}));
    setNewTB(getToday());
  };

  if (partners===null) return <div style={{padding:40,textAlign:"center",color:C.muted}}>Loading...</div>;

  if (view==="form") return (
    <div>
      <BackBtn onBack={()=>{setView("list");setSelected(null);setForm(emptyForm);}}/>
      <SectionHead label={selected?"Edit Partner":"New Partner"} color={C.green}/>
      <Card>
        <Inp label="Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Full name"/>
        <Inp label="Phone" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="Phone number"/>
        <Inp label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="Email address"/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.1em"}}>Stage</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {STAGES.map(s=>(
              <button key={s} onClick={()=>setForm(f=>({...f,stage:s}))} style={{padding:"5px 10px",background:form.stage===s?STAGE_COLORS[s]+"22":"#1a1a1a",border:`1px solid ${form.stage===s?STAGE_COLORS[s]+"55":"#252525"}`,borderRadius:6,color:form.stage===s?STAGE_COLORS[s]:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{s}</button>
            ))}
          </div>
        </div>
        <Inp label="Partner Since" value={form.partnerSince} onChange={v=>setForm(f=>({...f,partnerSince:v}))} type="date"/>
        <Inp label="Goals" value={form.goals} onChange={v=>setForm(f=>({...f,goals:v}))} placeholder="What are they building toward?" multiline/>
        <Inp label="Strengths" value={form.strengths} onChange={v=>setForm(f=>({...f,strengths:v}))} placeholder="What do they bring?" multiline/>
        <Inp label="Concerns / Watch-outs" value={form.concerns} onChange={v=>setForm(f=>({...f,concerns:v}))} placeholder="Anything to keep an eye on..." multiline/>
        <Inp label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Relationship context, character observations..." multiline/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.1em"}}>Log Touchbase</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input type="date" value={newTB} onChange={e=>setNewTB(e.target.value)} style={{flex:1,background:"#1a1a1a",border:"1px solid #252525",borderRadius:6,color:C.white,fontSize:14,padding:"9px 12px",outline:"none",fontFamily:"inherit"}}/>
            <Btn label="Add" onClick={addTouchbase} color={C.green} small/>
          </div>
          {(form.touchbaseDates||[]).map((d,i)=>(
            <div key={i} style={{fontSize:12,color:C.muted,padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>{formatDate(d)}{i===0?" (most recent)":""}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn label="Save Partner" onClick={savePartner} color={C.green} variant={saveState==="saved"?"saved":undefined}/>
          {selected&&<Btn label="Delete" onClick={()=>del(selected.id)} color={C.red} small/>}
        </div>
      </Card>
    </div>
  );

  const sorted = [...partners].sort((a,b)=>{
    const order = {"Active Partner":0,"Evaluating":1,"Prospect":2,"Paused":3,"Closed":4};
    return (order[a.stage]??5)-(order[b.stage]??5);
  });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SectionHead label={`AKB Partners (${partners.length})`} color={C.green}/>
        <Btn label="+ Add" onClick={()=>{setSelected(null);setForm(emptyForm);setView("form");}} color={C.green} small/>
      </div>
      {partners.length===0&&<div style={{textAlign:"center",color:C.muted,padding:40,fontSize:14}}>No partners yet.</div>}
      {sorted.map(p=>{
        const days=p.lastTouchbase?daysSince(p.lastTouchbase):null;
        const sc=STAGE_COLORS[p.stage]||C.muted;
        return (
          <Card key={p.id} onClick={()=>openEdit(p)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>{p.name}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Badge label={p.stage} color={sc}/>
                  {p.partnerSince&&<Badge label={`Since ${formatDate(p.partnerSince)}`} color={C.muted}/>}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                {days!==null&&<div style={{fontSize:12,color:days>14?C.red:C.muted}}>{days===0?"Today":`${days}d ago`}</div>}
                {days===null&&<div style={{fontSize:12,color:C.muted}}>No touchbase</div>}
                {days!==null&&days>14&&<Badge label="Overdue" color={C.red}/>}
              </div>
            </div>
            {p.goals&&<div style={{fontSize:12,color:C.light,marginTop:8,fontStyle:"italic"}}>"{p.goals}"</div>}
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════════════
const CONTENT_DAYS = [
  {num:12,title:"Return & Showing Up",format:"Standard Reel",bucket:"sees",hooks:["Day 12. Missed a few days. Showing up anyway.","Consistency doesn't mean perfect. It means you keep coming back.","For the man who stopped and started again — this one's for you."]},
  {num:13,title:"Why My Wife Is Still Working",format:"Story Reel",bucket:"sees",hooks:["I've made money online for 8 years. So why is my wife still working?","8 years. Still not there. Here's what changed.","I knew how to make money. I just didn't know how to make enough."]},
  {num:14,title:"Are You Building The Life You Want?",format:"Standard Reel",bucket:"feels",hooks:["88% of dads are building a life their kids will inherit — not one they chose.","For the dad who's winning at work and losing at home.","The life you're building right now — is it the one you actually want?"]},
  {num:15,title:"Before / After",format:"Before/After 🧪",bucket:"gets",hooks:[]},
  {num:16,title:"Discipline Without Direction",format:"Story Reel",bucket:"feels",hooks:["There are 2 types of dads. The ones who use their kids as an excuse. And the ones who use them as fuel.","For the dad who's disciplined in the gym but chaotic everywhere else.","The most disciplined men I know are failing at the thing that matters most."]},
  {num:17,title:"Checklist — Marriage Alignment",format:"Checklist 🧪",bucket:"feels",hooks:[]},
  {num:18,title:"Month 2 Real Update",format:"Standard Reel",bucket:"sees",hooks:["Month 2. Here's what's actually happening.","I thought month 2 would feel different. It does — just not how I expected.","No highlight reel. No wins only. Here's the real month 2 update."]},
  {num:19,title:"What My Son Actually Needs",format:"Story Reel",bucket:"feels",hooks:["The most important thing I will ever teach my son has nothing to do with money.","I used to tie my worth to what I accomplished. Then my son looked at me.","For the dad who worries he's not doing enough — you need to hear this."]},
  {num:20,title:"The One Morning Question",format:"Standard Reel",bucket:"gets",hooks:["The one question I ask every morning that keeps me building the right thing.","Before I open my phone. Before I check anything. I ask myself this.","Most men start their day reacting. This one question makes you intentional."]},
  {num:21,title:"Split Screen — Present vs. Absent",format:"Split Screen 🧪",bucket:"feels",hooks:[]},
  {num:22,title:"What I'm Actually Building This For",format:"Standard Reel",bucket:"feels",hooks:["I used to build for the income. Now I build for something bigger than me.","The moment I stopped asking 'what do I want' and started asking 'what am I called to'.","For the man who's grinding but still feels empty — this might be why."]},
  {num:23,title:"What She Actually Needs",format:"Standard Reel",bucket:"sees",hooks:["My wife doesn't need a bigger house. She needs a more present husband.","I was providing everything. And still missing the point.","For the husband who's doing everything right and still getting it wrong."]},
  {num:24,title:"Bad / Good / Best — Presence",format:"Bad/Good/Best 🧪",bucket:"gets",hooks:[]},
  {num:25,title:"The Week 2 Build Update",format:"Standard Reel",bucket:"sees",hooks:["Week 2. Here's what's actually different.","Nobody tells you how slow the beginning actually feels.","I don't share this for the wins. I share it so you know what it actually looks like."]},
  {num:26,title:"He's Watching How I Handle What I Don't Win",format:"Story Reel",bucket:"feels",hooks:["My son is not watching what I achieve. He's watching how I handle what I don't.","I used to think building a legacy meant building a business. My son taught me otherwise.","For the father who's putting pressure on himself to be more — this will reset you."]},
  {num:27,title:"The 3 Fitness Shifts That Changed Everything",format:"Standard Reel",bucket:"gets",hooks:["I've been training for years. These 3 shifts are the only ones that actually stuck.","Most men train their body. Almost none train their discipline to show up.","The gym didn't change my body first. It changed my mind."]},
  {num:29,title:"Why I Build With Faith In The Process",format:"Standard Reel",bucket:"sees",hooks:["I don't grind because I'm motivated. I show up because I'm called.","The hardest months of building taught me more about faith than a church pew ever did."]},
  {num:30,title:"Month 2 In The Right Rooms",format:"Standard Reel",bucket:"sees",hooks:["Month 2. I'm in rooms I didn't know existed 60 days ago.","You don't rise to your level of ambition. You rise to the level of the rooms you're in."]},
  {num:37,title:"Split Screen — Marriage",format:"Split Screen 🧪",bucket:"feels",hooks:[]},
  {num:40,title:"Day 40. I'm Not The Same Man.",format:"Story Reel",bucket:"sees",hooks:["Day 1 of this I didn't know if it was possible. Day 40 I know it is.","30 days ago I started documenting this publicly. Here's what that forced me to do."]},
];
const BC = {feels:"#e84040",sees:"#f5a623",gets:"#3ecf82"};
const BL = {feels:"🔴 He Feels It",sees:"🟡 He Sees It",gets:"🟢 He Gets It"};

function Content() {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(null);
  const copy = (text,id) => { navigator.clipboard?.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),1500); };

  const weeks = [
    {label:"Week 1 — Return & Tension",days:CONTENT_DAYS.filter(d=>d.num<=18)},
    {label:"Week 2 — Pursuit & Tools",days:CONTENT_DAYS.filter(d=>d.num>=19&&d.num<=25)},
    {label:"Week 3 — Legacy & Faith",days:CONTENT_DAYS.filter(d=>d.num>=26&&d.num<=32)},
    {label:"Week 4 — Momentum & Identity",days:CONTENT_DAYS.filter(d=>d.num>=33)},
  ];

  if (selected) return (
    <div>
      <BackBtn onBack={()=>setSelected(null)}/>
      <div style={{background:`linear-gradient(135deg,${BC[selected.bucket]}14,transparent)`,border:`1px solid ${BC[selected.bucket]}33`,borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:40,fontWeight:800,opacity:0.15,lineHeight:1}}>{selected.num}</div>
          <div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{selected.title}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <Badge label={selected.format} color={C.muted}/>
              <Badge label={BL[selected.bucket]} color={BC[selected.bucket]}/>
            </div>
          </div>
        </div>
      </div>
      {selected.hooks.length>0&&(
        <>
          <SectionHead label="Hook Options — Tap to Copy" color={C.yellow}/>
          {selected.hooks.map((h,i)=>(
            <Card key={i} onClick={()=>copy(h,`h${i}`)} style={{cursor:"pointer"}}>
              <div style={{fontSize:14,fontWeight:600,lineHeight:1.4}}>"{h}"</div>
              <div style={{fontSize:11,color:copied===`h${i}`?C.green:C.muted,marginTop:6}}>{copied===`h${i}`?"✓ Copied":"Tap to copy"}</div>
            </Card>
          ))}
        </>
      )}
      {selected.hooks.length===0&&<div style={{textAlign:"center",color:C.muted,padding:20,fontSize:13}}>See full playbook for this format's script details.</div>}
    </div>
  );

  return (
    <div>
      {weeks.map((w,wi)=>(
        <div key={wi} style={{marginBottom:24}}>
          <SectionHead label={w.label} color={C.yellow}/>
          {w.days.map(d=>(
            <Card key={d.num} onClick={()=>setSelected(d)} style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange,opacity:0.5,minWidth:28,lineHeight:1}}>{d.num}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{d.title}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:C.muted,background:"#1a1a1a",padding:"2px 8px",borderRadius:3}}>{d.format}</span>
                  <span style={{fontSize:10,color:BC[d.bucket],background:BC[d.bucket]+"18",padding:"2px 8px",borderRadius:3}}>{BL[d.bucket]}</span>
                </div>
              </div>
              <div style={{fontSize:16,color:C.border}}>›</div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LINKS
// ═══════════════════════════════════════════════════════════════════════════
function Links() {
  return (
    <div>
      <SectionHead label="Other Apps" color={C.muted}/>
      {[
        {icon:"🏋️",title:"Workout Tracker",desc:"4-day upper/lower split with warmups and persistent session logging.",note:"Find it in your Claude conversation about building your workout routine and warmup protocols."},
        {icon:"📊",title:"Business Tracker (Standalone)",desc:"Original pipeline + content tracker with full weekly history.",note:"Find it in your Claude conversation about building your business tracker."},
      ].map((l,i)=>(
        <Card key={i}>
          <div style={{fontSize:22,marginBottom:8}}>{l.icon}</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{l.title}</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:10}}>{l.desc}</div>
          <div style={{fontSize:12,color:C.muted,background:"#1a1a1a",border:"1px solid #252525",borderRadius:6,padding:"8px 12px"}}>{l.note}</div>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
const NAV = [
  {id:"dashboard",label:"Home",icon:"⚡"},
  {id:"growth",label:"Growth",icon:"🌱"},
  {id:"pipeline",label:"Pipeline",icon:"🔥"},
  {id:"clients",label:"Clients",icon:"🤝"},
  {id:"partners",label:"Partners",icon:"⚡"},
  {id:"content",label:"Content",icon:"🎬"},
];
const TITLES = {dashboard:"Align Living",growth:"Growth Log",pipeline:"Pipeline",clients:"Client CRM",partners:"AKB Partners",content:"Content Playbook",links:"Other Apps"};

export default function App() {
  const [view, setView] = useState("dashboard");
  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.white,fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.6}}>
      <div style={{background:"rgba(13,13,13,0.97)",borderBottom:`1px solid ${C.border}`,padding:"18px 16px 0",maxWidth:680,margin:"0 auto",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:C.orange,marginBottom:2}}>Align Living</div>
            <div style={{fontSize:20,fontWeight:800}}>{TITLES[view]}</div>
          </div>
          <button onClick={()=>setView("links")} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontSize:11,fontWeight:600,padding:"6px 10px",cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>🔗 Apps</button>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",gap:0}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} style={{flex:"0 0 auto",padding:"8px 14px",background:"none",border:"none",borderBottom:`2px solid ${view===n.id?C.orange:"transparent"}`,color:view===n.id?C.white:C.muted,fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 100px"}}>
        {view==="dashboard"&&<Dashboard onNav={setView}/>}
        {view==="growth"&&<GrowthLog/>}
        {view==="pipeline"&&<Pipeline/>}
        {view==="clients"&&<Clients/>}
        {view==="partners"&&<Partners/>}
        {view==="content"&&<Content/>}
        {view==="links"&&<Links/>}
      </div>
    </div>
  );
}
