import { useState, useEffect } from "react";

const WEEKLY_TARGETS = {
  ig_convos: 3,
  bb_convos: 3,
  drop_messages: 7,
  reels_posted: 3,
  reach: 5000,
  profile_visits: 300,
  follows_gained: 20,
};

const METRICS = [
  { id: "ig_convos", label: "IG Convos Started", section: "pipeline", icon: "📸", color: "#f05a1a", target: WEEKLY_TARGETS.ig_convos },
  { id: "bb_convos", label: "Bumble Biz Convos", section: "pipeline", icon: "🐝", color: "#f5a623", target: WEEKLY_TARGETS.bb_convos },
  { id: "drop_messages", label: "Drop Messages Sent", section: "pipeline", icon: "📩", color: "#3a9de8", target: WEEKLY_TARGETS.drop_messages },
  { id: "vetting_meetings", label: "Vetting Meetings", section: "pipeline", icon: "🤝", color: "#3ecf82", outcome: true },
  { id: "new_partners", label: "New Partners Added", section: "pipeline", icon: "⚡", color: "#9d6ef5", outcome: true },
  { id: "reels_posted", label: "Reels Posted", section: "content", icon: "🎬", color: "#f05a1a", target: WEEKLY_TARGETS.reels_posted },
  { id: "reach", label: "Reach", section: "content", icon: "👁", color: "#3a9de8", target: WEEKLY_TARGETS.reach },
  { id: "profile_visits", label: "Profile Visits", section: "content", icon: "👤", color: "#3ecf82", target: WEEKLY_TARGETS.profile_visits },
  { id: "follows_gained", label: "Follows Gained", section: "content", icon: "➕", color: "#9d6ef5", target: WEEKLY_TARGETS.follows_gained },
];

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}
function getDateKey(date = new Date()) { return new Date(date).toISOString().split("T")[0]; }
function formatNum(n) { if (!n) return 0; if (n >= 1000) return (n / 1000).toFixed(1) + "k"; return n; }
function getPct(value, target) { return Math.min(100, Math.round((value / target) * 100)); }
function getStatusColor(pct) { if (pct >= 100) return "#3ecf82"; if (pct >= 60) return "#f5a623"; return "#e84040"; }

async function storageGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function storageSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}

function DailyLog({ section }) {
  const today = getDateKey();
  const weekKey = getWeekKey();
  const [dailyLog, setDailyLog] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const metrics = METRICS.filter(m => m.section === section);

  useEffect(() => {
    storageGet(`daily:${today}`).then(log => { if (log) setDailyLog(log); setLoading(false); });
  }, [section]);

  const update = (id, val) => setDailyLog(prev => ({ ...prev, [id]: Math.max(0, parseInt(val) || 0) }));
  const increment = (id) => setDailyLog(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decrement = (id) => setDailyLog(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));

  const save = async () => {
    await storageSet(`daily:${today}`, dailyLog);
    const weekStart = new Date(weekKey);
    let weekTotals = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dk = getDateKey(d);
      const dayLog = dk === today ? dailyLog : ((await storageGet(`daily:${dk}`)) || {});
      METRICS.forEach(m => { weekTotals[m.id] = (weekTotals[m.id] || 0) + (dayLog[m.id] || 0); });
    }
    await storageSet(`week:${weekKey}`, { totals: weekTotals, weekStart: weekKey });
    const hist = (await storageGet("week-history")) || [];
    const filtered = hist.filter(h => h.weekStart !== weekKey);
    await storageSet("week-history", [...filtered, { weekStart: weekKey, totals: weekTotals }].slice(-52));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>;

  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e1e", borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#555", display: "flex", justifyContent: "space-between" }}>
        <span>Today — {today}</span>
        <span style={{ color: "#3a3a3a" }}>Saves to weekly totals</span>
      </div>

      {metrics.map(m => (
        <div key={m.id} style={{ background: "#161616", border: `1px solid ${m.outcome ? "#1e1e1e" : "#1e1e1e"}`, borderRadius: 8, padding: "16px", marginBottom: 10, opacity: m.outcome ? 0.85 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#444", fontStyle: m.outcome ? "italic" : "normal" }}>
                  {m.outcome ? "Outcome — log when it happens" : `Weekly target: ${formatNum(m.target)}`}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color, minWidth: 48, textAlign: "right" }}>
              {formatNum(dailyLog[m.id] || 0)}
            </div>
          </div>

          {!m.outcome && m.target >= 100 ? (
            <input type="number" inputMode="numeric" value={dailyLog[m.id] || ""} placeholder="0"
              onChange={e => update(m.id, e.target.value)}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #252525", borderRadius: 6, color: "#f2ede4", fontSize: 16, padding: "10px 14px", outline: "none", fontFamily: "inherit" }}
            />
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => decrement(m.id)} style={{ width: 44, height: 44, background: "#1a1a1a", border: "1px solid #252525", borderRadius: 6, color: "#888", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <input type="number" inputMode="numeric" value={dailyLog[m.id] || ""} placeholder="0"
                onChange={e => update(m.id, e.target.value)}
                style={{ flex: 1, background: "#1a1a1a", border: "1px solid #252525", borderRadius: 6, color: "#f2ede4", fontSize: 18, fontWeight: 700, padding: "10px 14px", outline: "none", fontFamily: "inherit", textAlign: "center" }}
              />
              <button onClick={() => increment(m.id)} style={{ width: 44, height: 44, background: `${m.color}22`, border: `1px solid ${m.color}44`, borderRadius: 6, color: m.color, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          )}
        </div>
      ))}

      <button onClick={save} style={{ width: "100%", padding: 14, background: saved ? "rgba(62,207,130,0.15)" : "rgba(240,90,26,0.12)", border: `1px solid ${saved ? "rgba(62,207,130,0.4)" : "rgba(240,90,26,0.3)"}`, borderRadius: 8, color: saved ? "#3ecf82" : "#f05a1a", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", marginTop: 4 }}>
        {saved ? "✓ Saved" : "Save Today's Numbers"}
      </button>
    </div>
  );
}

function WeeklyReview() {
  const weekKey = getWeekKey();
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageGet(`week:${weekKey}`).then(d => { setWeekData(d); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>;

  const totals = weekData?.totals || {};
  const today = new Date();
  const weekStart = new Date(weekKey);
  const dayOfWeek = Math.min(6, Math.floor((today - weekStart) / (1000 * 60 * 60 * 24)));
  const weekProgress = Math.round(((dayOfWeek + 1) / 7) * 100);

  const inputMetrics = METRICS.filter(m => !m.outcome);
  const outcomeMetrics = METRICS.filter(m => m.outcome);

  return (
    <div>
      {/* Week progress */}
      <div style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "16px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#555" }}>Week of {weekKey}</span>
          <span style={{ fontSize: 12, color: "#f05a1a", fontWeight: 600 }}>Day {dayOfWeek + 1} of 7</span>
        </div>
        <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${weekProgress}%`, background: "#f05a1a", borderRadius: 4 }} />
        </div>
      </div>

      {/* Controllable inputs */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        Inputs — What You Control <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>

      {inputMetrics.filter(m => m.section === "pipeline").map(m => {
        const val = totals[m.id] || 0;
        const pct = getPct(val, m.target);
        const sc = getStatusColor(pct);
        return (
          <div key={m.id} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{m.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#555" }}>{val} / {m.target}</span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10, background: `${sc}22`, color: sc, border: `1px solid ${sc}44` }}>{pct}%</span>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 4, height: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: sc, borderRadius: 4, transition: "width 0.4s" }} />
            </div>
          </div>
        );
      })}

      {/* Platform comparison */}
      <div style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "16px", marginBottom: 20, marginTop: 4 }}>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform Comparison</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ id: "ig_convos", label: "Instagram", icon: "📸", color: "#f05a1a" }, { id: "bb_convos", label: "Bumble Biz", icon: "🐝", color: "#f5a623" }].map(p => {
            const val = totals[p.id] || 0;
            const pct = getPct(val, WEEKLY_TARGETS[p.id]);
            return (
              <div key={p.id} style={{ background: "#1a1a1a", borderRadius: 6, padding: "14px", textAlign: "center", border: "1px solid #252525" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: p.color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>of {WEEKLY_TARGETS[p.id]} target</div>
                <div style={{ marginTop: 8, background: "#252525", borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcomes — no targets */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3ecf82", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        Outcomes — Results of the Work <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {outcomeMetrics.map(m => (
          <div key={m.id} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: m.color, lineHeight: 1 }}>{totals[m.id] || 0}</div>
            <div style={{ fontSize: 10, color: "#333", marginTop: 4, fontStyle: "italic" }}>no weekly target</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3a9de8", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        Content <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      {inputMetrics.filter(m => m.section === "content").map(m => {
        const val = totals[m.id] || 0;
        const pct = getPct(val, m.target);
        const sc = getStatusColor(pct);
        return (
          <div key={m.id} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{m.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#555" }}>{formatNum(val)} / {formatNum(m.target)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10, background: `${sc}22`, color: sc, border: `1px solid ${sc}44` }}>{pct}%</span>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 4, height: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: sc, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HistoryView() {
  const [history, setHistory] = useState(null);

  useEffect(() => { storageGet("week-history").then(h => setHistory(h || [])); }, []);

  if (history === null) return <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>;
  if (history.length === 0) return (
    <div style={{ padding: 40, textAlign: "center", color: "#444", fontSize: 14 }}>
      No weeks logged yet.<br /><span style={{ color: "#333", fontSize: 12 }}>Log daily numbers and they'll appear here week by week.</span>
    </div>
  );

  const inputMetrics = METRICS.filter(m => !m.outcome);

  return (
    <div>
      {[...history].reverse().map((week, wi) => {
        const totals = week.totals || {};
        const overallPct = Math.round(inputMetrics.reduce((sum, m) => sum + getPct(totals[m.id] || 0, m.target), 0) / inputMetrics.length);
        return (
          <div key={wi} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Week of {week.weekStart}</span>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 10, background: `${getStatusColor(overallPct)}22`, color: getStatusColor(overallPct), border: `1px solid ${getStatusColor(overallPct)}44` }}>{overallPct}% on target</span>
            </div>
            <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {METRICS.map(m => (
                <div key={m.id} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{m.icon} {m.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{formatNum(totals[m.id] || 0)}</div>
                  {!m.outcome && <div style={{ fontSize: 9, color: "#333" }}>/ {formatNum(m.target)}</div>}
                  {m.outcome && <div style={{ fontSize: 9, color: "#333", fontStyle: "italic" }}>outcome</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("pipeline");
  const VIEWS = [
    { id: "pipeline", label: "Pipeline" },
    { id: "content", label: "Content" },
    { id: "week", label: "This Week" },
    { id: "history", label: "History" },
  ];

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "#f2ede4", fontFamily: "system-ui, sans-serif", fontSize: 15, lineHeight: 1.6 }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "20px 16px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 6 }}>Align Living</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.01em", marginBottom: 16 }}>Business Hub</div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)} style={{ flex: "0 0 auto", padding: "10px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeView === v.id ? "#f05a1a" : "transparent"}`, color: activeView === v.id ? "#f2ede4" : "#444", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>{v.label}</button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 80px" }}>
        {activeView === "pipeline" && <DailyLog section="pipeline" />}
        {activeView === "content" && <DailyLog section="content" />}
        {activeView === "week" && <WeeklyReview />}
        {activeView === "history" && <HistoryView />}
      </div>
    </div>
  );
}
