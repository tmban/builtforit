import { useState, useRef, useEffect } from "react";

// ─── PATHS TO RESEARCH ───────────────────────────────────────────────────────

const PATHS_TO_RESEARCH = [
  // Scenarios
  { id: "gordon", label: "Gordon Ramsay's Kitchen", icon: "👨‍🍳", category: "Scenario" },
  { id: "loveisland", label: "Love Island", icon: "🌴", category: "Scenario" },
  { id: "sas", label: "SAS: Who Dares Wins", icon: "🪖", category: "Scenario" },
  { id: "apprentice", label: "The Apprentice", icon: "💼", category: "Scenario" },
  { id: "startup_grind", label: "Startup Grind (18 months, no salary)", icon: "🚀", category: "Scenario" },
  { id: "silent_retreat", label: "Silent Retreat (30 days)", icon: "🧘", category: "Scenario" },
  { id: "mma_fighter_scenario", label: "MMA Fighter Training Camp", icon: "🥊", category: "Scenario" },
  { id: "reality_tv", label: "Reality TV (Big Brother / The Circle)", icon: "📺", category: "Scenario" },
  // Career paths
  { id: "football", label: "Premier League Footballer", icon: "⚽", category: "Career" },
  { id: "dj", label: "DJ", icon: "🎧", category: "Career" },
  { id: "standup", label: "Stand-up Comedian", icon: "🎤", category: "Career" },
  { id: "founder", label: "Startup Founder", icon: "💡", category: "Career" },
  { id: "chef", label: "Professional Chef", icon: "🍽️", category: "Career" },
  { id: "pt", label: "Personal Trainer", icon: "💪", category: "Career" },
  { id: "streamer", label: "Full-time Streamer / Content Creator", icon: "🎮", category: "Career" },
  { id: "pro_gamer", label: "Professional Gamer (Esports)", icon: "🕹️", category: "Career" },
  { id: "tattoo_artist", label: "Tattoo Artist", icon: "🎨", category: "Career" },
  { id: "mma_fighter", label: "Professional MMA Fighter", icon: "🥊", category: "Career" },
  { id: "real_estate", label: "Real Estate Investor", icon: "🏠", category: "Career" },
  { id: "digital_nomad", label: "Digital Nomad (location-independent freelancer)", icon: "🌍", category: "Career" },
  { id: "musician", label: "Professional Musician / Artist", icon: "🎵", category: "Career" },
  { id: "actor", label: "Actor / Performer", icon: "🎭", category: "Career" },
  { id: "model", label: "Model (fashion / commercial)", icon: "✨", category: "Career" },
  { id: "firefighter", label: "Firefighter", icon: "🚒", category: "Career" },
  { id: "nurse", label: "Nurse / Healthcare Professional", icon: "🏥", category: "Career" },
  { id: "lawyer", label: "Barrister / Lawyer", icon: "⚖️", category: "Career" },
  { id: "pilot", label: "Commercial Pilot", icon: "✈️", category: "Career" },
  { id: "crypto_trader", label: "Crypto / Day Trader", icon: "📈", category: "Career" },
  { id: "social_media", label: "Social Media Influencer", icon: "📱", category: "Career" },
  { id: "architect", label: "Architect", icon: "🏗️", category: "Career" },
  { id: "vet", label: "Veterinarian", icon: "🐾", category: "Career" },
  { id: "engineer", label: "Software Engineer at a Top Tech Company", icon: "💻", category: "Career" },
  { id: "chef_patissier", label: "Pastry Chef / Patissier", icon: "🍰", category: "Career" },
  { id: "police", label: "Police Officer", icon: "🚔", category: "Career" },
  { id: "barber", label: "Master Barber / Hairdresser", icon: "✂️", category: "Career" },
];

const RESEARCH_PROMPT = (path) => `You are a deep research expert for a quiz app called "Am I Built For It?". Your job is to produce comprehensive, accurate research on what it ACTUALLY takes to succeed in a specific path — for a 16–30 year old audience in the UK.

Path: ${path.label}
Type: ${path.category}

Produce a detailed JSON research profile. Be specific, honest, and evidence-based. Draw on real data, realistic timelines, and common failure patterns. Do NOT be generic.

Return ONLY raw JSON, no markdown, no backticks:

{
  "path_id": "${path.id}",
  "path_label": "${path.label}",
  "overview": "<2-3 sentence honest summary of what this path actually involves>",
  "reality_check": "<what most people get wrong or underestimate about this path>",
  "age_relevance": {
    "sweet_spot": "<the ideal age range and why>",
    "too_young": "<what challenges under-18s face>",
    "too_old": "<at what point does age start working against you and why>"
  },
  "what_it_actually_takes": [
    "<specific requirement 1 — be concrete>",
    "<specific requirement 2>",
    "<specific requirement 3>",
    "<specific requirement 4>",
    "<specific requirement 5>"
  ],
  "daily_reality": "<what a realistic day actually looks like — hours, routine, unglamorous parts>",
  "timeline_to_viability": "<how long realistically before someone could earn a living wage from this, with specifics>",
  "common_failure_modes": [
    "<why most people fail at this — specific, not generic>",
    "<second failure mode>",
    "<third failure mode>"
  ],
  "green_flags": [
    "<trait or habit that strongly predicts success>",
    "<second green flag>",
    "<third green flag>"
  ],
  "red_flags": [
    "<trait or habit that predicts failure>",
    "<second red flag>",
    "<third red flag>"
  ],
  "key_assessment_dimensions": [
    {
      "dimension": "<e.g. Technical Ability>",
      "why_it_matters": "<why this dimension is critical for this specific path>",
      "how_to_assess": "<what question or indicator best reveals this>"
    },
    {
      "dimension": "<second dimension>",
      "why_it_matters": "<explanation>",
      "how_to_assess": "<indicator>"
    },
    {
      "dimension": "<third dimension>",
      "why_it_matters": "<explanation>",
      "how_to_assess": "<indicator>"
    },
    {
      "dimension": "<fourth dimension>",
      "why_it_matters": "<explanation>",
      "how_to_assess": "<indicator>"
    },
    {
      "dimension": "<fifth dimension>",
      "why_it_matters": "<explanation>",
      "how_to_assess": "<indicator>"
    }
  ],
  "suggested_questions": {
    "multiple_choice": [
      {
        "tag": "<SHORT TAG IN CAPS>",
        "type": "current_ability",
        "q": "<question about what they can do RIGHT NOW>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "current_routine",
        "q": "<question about their current habits or schedule>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "scenario",
        "q": "<how would they respond in a defining moment for this path>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "current_ability",
        "q": "<second ability question>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "current_routine",
        "q": "<second routine question>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "scenario",
        "q": "<second scenario question>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "current_ability",
        "q": "<third ability question — different dimension>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "current_routine",
        "q": "<third routine/schedule question>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "scenario",
        "q": "<third scenario — pressure or defining moment>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      },
      {
        "tag": "<TAG>",
        "type": "mindset",
        "q": "<question about long-term commitment, resilience, or motivation>",
        "opts": ["<weakest>", "<below average>", "<above average>", "<strongest>"]
      }
    ],
    "open_ended": [
      {
        "tag": "<TAG>",
        "q": "<question that reveals genuine depth — where they should describe something real about themselves, their setup, their history, or their why. Cannot be answered in one word.>",
        "prompt_hint": "<what a strong answer would include>"
      },
      {
        "tag": "<TAG>",
        "q": "<second open-ended — different angle, should surface something the MC questions can't capture>",
        "prompt_hint": "<what a strong answer would include>"
      }
    ]
  },
  "verdict_context": {
    "pass_threshold": "<what a genuine PASS looks like for this path — be specific>",
    "maybe_threshold": "<what puts someone in the MAYBE category>",
    "fail_indicators": "<what clearly signals they are not ready or suited>"
  }
}`;

// ─── STATUS TYPES ────────────────────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  RUNNING: "running",
  DONE: "done",
  ERROR: "error",
};

export default function PathResearchAgent() {
  const [dark, setDark] = useState(true);
  const [pathStatuses, setPathStatuses] = useState(() =>
    Object.fromEntries(PATHS_TO_RESEARCH.map(p => [p.id, { status: STATUS.IDLE, data: null, error: null }]))
  );
  const [running, setRunning] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [concurrency] = useState(3);
  const abortRef = useRef(false);
  const logRef = useRef(null);
  const [logs, setLogs] = useState([]);

  const d = dark;
  const c = {
    bg: d ? "#0a0a0a" : "#f5f5f5",
    surface: d ? "#141414" : "#ffffff",
    surfaceAlt: d ? "#1a1a1a" : "#f0f0f0",
    border: d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    text: d ? "#f0ece4" : "#111",
    textMuted: d ? "rgba(240,236,228,0.55)" : "rgba(0,0,0,0.55)",
    textFaint: d ? "rgba(240,236,228,0.28)" : "rgba(0,0,0,0.3)",
    accent: "#ff6b35",
    green: "#4ade80",
    amber: "#fbbf24",
    red: "#f87171",
    blue: "#60a5fa",
  };

  function addLog(msg, type = "info") {
    const ts = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-200), { ts, msg, type }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
  }

  function updatePathStatus(id, update) {
    setPathStatuses(prev => ({ ...prev, [id]: { ...prev[id], ...update } }));
  }

  async function researchPath(path) {
    updatePathStatus(path.id, { status: STATUS.RUNNING });
    addLog(`Starting research: ${path.label}`, "info");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: RESEARCH_PROMPT(path),
          }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Extract text from all content blocks (may include tool_use/tool_result)
      const text = data.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("")
        .replace(/```json|```/g, "")
        .trim();

      const parsed = JSON.parse(text);
      updatePathStatus(path.id, { status: STATUS.DONE, data: parsed });
      addLog(`✓ Done: ${path.label}`, "success");
      return parsed;
    } catch (err) {
      updatePathStatus(path.id, { status: STATUS.ERROR, error: err.message });
      addLog(`✗ Failed: ${path.label} — ${err.message}`, "error");
      return null;
    }
  }

  async function runAll() {
    abortRef.current = false;
    setRunning(true);
    addLog("=== Research agent started ===", "system");

    const todo = PATHS_TO_RESEARCH.filter(p => pathStatuses[p.id].status !== STATUS.DONE);
    addLog(`Researching ${todo.length} paths with concurrency ${concurrency}`, "system");

    // Set all pending
    todo.forEach(p => updatePathStatus(p.id, { status: STATUS.PENDING }));

    // Process in batches
    for (let i = 0; i < todo.length; i += concurrency) {
      if (abortRef.current) { addLog("Aborted by user", "system"); break; }
      const batch = todo.slice(i, i + concurrency);
      addLog(`Batch ${Math.floor(i / concurrency) + 1}: ${batch.map(p => p.label).join(", ")}`, "system");
      await Promise.all(batch.map(p => researchPath(p)));
    }

    addLog("=== Research complete ===", "system");
    setRunning(false);
  }

  async function runSingle(path) {
    setRunning(true);
    await researchPath(path);
    setRunning(false);
  }

  function stop() { abortRef.current = true; }

  function exportAll() {
    const allDone = Object.values(pathStatuses).filter(s => s.status === STATUS.DONE).map(s => s.data);
    const blob = new Blob([JSON.stringify(allDone, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "path_research.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function exportSingle(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${data.path_id}_research.json`; a.click();
    URL.revokeObjectURL(url);
  }

  const counts = Object.values(pathStatuses).reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1; return acc;
  }, {});

  const statusColor = (s) => ({
    [STATUS.IDLE]: c.textFaint,
    [STATUS.PENDING]: c.amber,
    [STATUS.RUNNING]: c.blue,
    [STATUS.DONE]: c.green,
    [STATUS.ERROR]: c.red,
  }[s] || c.textFaint);

  const statusIcon = (s) => ({
    [STATUS.IDLE]: "○",
    [STATUS.PENDING]: "◌",
    [STATUS.RUNNING]: "●",
    [STATUS.DONE]: "✓",
    [STATUS.ERROR]: "✗",
  }[s] || "○");

  const logColor = (type) => ({
    info: c.textMuted,
    success: c.green,
    error: c.red,
    system: c.accent,
    warn: c.amber,
  }[type] || c.textMuted);

  const selectedData = selectedPath ? pathStatuses[selectedPath]?.data : null;

  return (
    <div style={{ fontFamily: "'DM Mono', 'Fira Mono', monospace", background: c.bg, minHeight: "100vh", color: c.text, fontSize: "0.82rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        button { cursor: pointer; font-family: inherit; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 1s linear infinite; }
      `}</style>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${c.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: c.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: c.accent, letterSpacing: "0.04em" }}>PATH RESEARCH AGENT</div>
          <div style={{ fontSize: "0.68rem", color: c.textFaint, letterSpacing: "0.06em" }}>BUILT FOR IT — v1.0</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Stat pills */}
          {[
            [counts[STATUS.DONE] || 0, "done", c.green],
            [counts[STATUS.RUNNING] || 0, "running", c.blue],
            [counts[STATUS.ERROR] || 0, "errors", c.red],
            [counts[STATUS.IDLE] || 0, "idle", c.textFaint],
          ].map(([n, label, col]) => n > 0 ? (
            <div key={label} style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: 4, background: `${col}18`, color: col, border: `1px solid ${col}30`, letterSpacing: "0.06em" }}>
              {n} {label}
            </div>
          ) : null)}
          <button onClick={() => setDark(!dark)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: "0.75rem" }}>
            {dark ? "☀" : "☽"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 49px)" }}>

        {/* LEFT: Path list */}
        <div style={{ borderRight: `1px solid ${c.border}`, overflowY: "auto", height: "calc(100vh - 49px)", position: "sticky", top: 49 }}>
          {/* Controls */}
          <div style={{ padding: "12px", borderBottom: `1px solid ${c.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={running ? stop : runAll}
              style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: running ? c.red : c.accent, color: "#fff", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.04em", width: "100%" }}>
              {running ? "⬛ Stop" : "▶ Run All Research"}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={exportAll}
                disabled={!(counts[STATUS.DONE] > 0)}
                style={{ flex: 1, padding: "6px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: counts[STATUS.DONE] > 0 ? c.green : c.textFaint, fontSize: "0.72rem" }}>
                ↓ Export All ({counts[STATUS.DONE] || 0})
              </button>
              <button
                onClick={() => setPathStatuses(prev => {
                  const next = { ...prev };
                  Object.keys(next).forEach(id => { if (next[id].status === STATUS.ERROR) next[id] = { status: STATUS.IDLE, data: null, error: null }; });
                  return next;
                })}
                style={{ flex: 1, padding: "6px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.amber, fontSize: "0.72rem" }}>
                ↺ Retry Errors
              </button>
            </div>
          </div>

          {/* Scenario section */}
          {["Scenario", "Career"].map(cat => (
            <div key={cat}>
              <div style={{ padding: "8px 12px 4px", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textFaint, borderBottom: `1px solid ${c.border}` }}>
                {cat} paths
              </div>
              {PATHS_TO_RESEARCH.filter(p => p.category === cat).map(path => {
                const s = pathStatuses[path.id];
                const isSelected = selectedPath === path.id;
                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", background: isSelected ? `${c.accent}14` : "transparent", borderLeft: isSelected ? `2px solid ${c.accent}` : "2px solid transparent", borderBottom: `1px solid ${c.border}` }}>
                    <span style={{ fontSize: "0.72rem", color: statusColor(s.status), flexShrink: 0, width: 12, textAlign: "center" }}>{s.status === STATUS.RUNNING ? <span className="spin">◌</span> : statusIcon(s.status)}</span>
                    <span style={{ fontSize: "0.82rem" }}>{path.icon}</span>
                    <span style={{ fontSize: "0.72rem", color: isSelected ? c.text : c.textMuted, lineHeight: 1.3, flex: 1 }}>{path.label}</span>
                    {s.status === STATUS.IDLE && !running && (
                      <button
                        onClick={e => { e.stopPropagation(); runSingle(path); }}
                        style={{ padding: "2px 6px", borderRadius: 4, border: `1px solid ${c.border}`, background: "transparent", color: c.textFaint, fontSize: "0.62rem", flexShrink: 0 }}>
                        run
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT: Detail + Log */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 180px", height: "calc(100vh - 49px)" }}>

          {/* Detail panel */}
          <div style={{ overflowY: "auto", padding: "20px 24px" }}>
            {!selectedPath && (
              <div style={{ color: c.textFaint, padding: "40px 0", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔬</div>
                <div>Select a path to view research</div>
                <div style={{ marginTop: 8, fontSize: "0.72rem" }}>or click Run All to start researching</div>
              </div>
            )}

            {selectedPath && (() => {
              const path = PATHS_TO_RESEARCH.find(p => p.id === selectedPath);
              const s = pathStatuses[selectedPath];

              if (s.status === STATUS.IDLE) return (
                <div style={{ color: c.textFaint, padding: "40px 0", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{path.icon}</div>
                  <div style={{ color: c.textMuted, marginBottom: 16 }}>{path.label}</div>
                  <button onClick={() => runSingle(path)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: "0.78rem" }}>Research this path</button>
                </div>
              );

              if (s.status === STATUS.PENDING) return (
                <div style={{ color: c.textFaint, padding: "40px 0", textAlign: "center" }}>
                  <div style={{ color: c.amber }}>Queued — waiting for a slot...</div>
                </div>
              );

              if (s.status === STATUS.RUNNING) return (
                <div style={{ color: c.textFaint, padding: "40px 0", textAlign: "center" }}>
                  <div style={{ color: c.blue, marginBottom: 8 }}><span className="spin">◌</span> Researching {path.label}...</div>
                  <div style={{ fontSize: "0.72rem" }}>Claude is searching the web and compiling deep research</div>
                </div>
              );

              if (s.status === STATUS.ERROR) return (
                <div style={{ color: c.red, padding: "40px 0", textAlign: "center" }}>
                  <div style={{ marginBottom: 8 }}>✗ Research failed</div>
                  <div style={{ fontSize: "0.72rem", color: c.textFaint, marginBottom: 16 }}>{s.error}</div>
                  <button onClick={() => runSingle(path)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: "0.78rem" }}>Retry</button>
                </div>
              );

              if (s.status === STATUS.DONE && s.data) {
                const data = s.data;
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: c.text, marginBottom: 4 }}>{path.icon} {data.path_label}</div>
                        <div style={{ fontSize: "0.68rem", color: c.textFaint, letterSpacing: "0.08em", textTransform: "uppercase" }}>{path.category} path · Research complete</div>
                      </div>
                      <button onClick={() => exportSingle(data)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${c.green}40`, background: `${c.green}12`, color: c.green, fontSize: "0.72rem" }}>
                        ↓ Export JSON
                      </button>
                    </div>

                    {/* Overview */}
                    <Section label="Overview" c={c}>
                      <p style={{ color: c.textMuted, lineHeight: 1.7 }}>{data.overview}</p>
                    </Section>

                    {/* Reality check */}
                    <Section label="Reality Check" c={c}>
                      <p style={{ color: c.amber, lineHeight: 1.7 }}>{data.reality_check}</p>
                    </Section>

                    {/* Age relevance */}
                    <Section label="Age Relevance" c={c}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                        {[["Sweet spot", data.age_relevance?.sweet_spot, c.green], ["Too young", data.age_relevance?.too_young, c.amber], ["Too old", data.age_relevance?.too_old, c.red]].map(([label, val, col]) => (
                          <div key={label} style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px" }}>
                            <div style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: col, marginBottom: 6 }}>{label}</div>
                            <div style={{ fontSize: "0.76rem", color: c.textMuted, lineHeight: 1.5 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* What it takes + failure modes */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      <Section label="What It Actually Takes" c={c} noMargin>
                        {(data.what_it_actually_takes || []).map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: c.accent, flexShrink: 0 }}>→</span>
                            <span style={{ color: c.textMuted, fontSize: "0.76rem", lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </Section>
                      <Section label="Common Failure Modes" c={c} noMargin>
                        {(data.common_failure_modes || []).map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: c.red, flexShrink: 0 }}>✗</span>
                            <span style={{ color: c.textMuted, fontSize: "0.76rem", lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </Section>
                    </div>

                    {/* Green/red flags */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      <Section label="Green Flags" c={c} noMargin>
                        {(data.green_flags || []).map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: c.green, flexShrink: 0 }}>✓</span>
                            <span style={{ color: c.textMuted, fontSize: "0.76rem", lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </Section>
                      <Section label="Red Flags" c={c} noMargin>
                        {(data.red_flags || []).map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: c.red, flexShrink: 0 }}>⚑</span>
                            <span style={{ color: c.textMuted, fontSize: "0.76rem", lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </Section>
                    </div>

                    {/* Timeline */}
                    <Section label="Timeline to Viability" c={c}>
                      <p style={{ color: c.textMuted, lineHeight: 1.7 }}>{data.timeline_to_viability}</p>
                    </Section>

                    {/* Daily reality */}
                    <Section label="Daily Reality" c={c}>
                      <p style={{ color: c.textMuted, lineHeight: 1.7 }}>{data.daily_reality}</p>
                    </Section>

                    {/* Assessment dimensions */}
                    <Section label="Key Assessment Dimensions" c={c}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(data.key_assessment_dimensions || []).map((dim, i) => (
                          <div key={i} style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 14px" }}>
                            <div style={{ fontWeight: 500, color: c.accent, marginBottom: 4, fontSize: "0.78rem" }}>{dim.dimension}</div>
                            <div style={{ color: c.textMuted, fontSize: "0.74rem", lineHeight: 1.5, marginBottom: 4 }}>{dim.why_it_matters}</div>
                            <div style={{ color: c.textFaint, fontSize: "0.7rem", fontStyle: "italic" }}>How to assess: {dim.how_to_assess}</div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Questions preview */}
                    <Section label="Generated Questions" c={c}>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: "0.65rem", color: c.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Multiple Choice ({(data.suggested_questions?.multiple_choice || []).length})</div>
                        {(data.suggested_questions?.multiple_choice || []).map((q, i) => (
                          <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${c.border}` }}>
                            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                              <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: 3, background: `${c.accent}20`, color: c.accent, letterSpacing: "0.06em", flexShrink: 0, alignSelf: "flex-start", marginTop: 1 }}>{q.tag}</span>
                              <span style={{ fontSize: "0.74rem", color: c.textMuted, lineHeight: 1.5 }}>{q.q}</span>
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: 0 }}>
                              {(q.opts || []).map((opt, j) => (
                                <span key={j} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 3, background: c.surfaceAlt, color: c.textFaint, border: `1px solid ${c.border}` }}>{opt}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.65rem", color: c.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Open Ended ({(data.suggested_questions?.open_ended || []).length})</div>
                        {(data.suggested_questions?.open_ended || []).map((q, i) => (
                          <div key={i} style={{ marginBottom: 10, background: c.surfaceAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px" }}>
                            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                              <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: 3, background: `${c.blue}20`, color: c.blue, letterSpacing: "0.06em", flexShrink: 0, alignSelf: "flex-start", marginTop: 1 }}>{q.tag}</span>
                              <span style={{ fontSize: "0.74rem", color: c.text, lineHeight: 1.5, fontWeight: 500 }}>{q.q}</span>
                            </div>
                            <div style={{ fontSize: "0.68rem", color: c.textFaint, fontStyle: "italic" }}>Strong answer includes: {q.prompt_hint}</div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Verdict context */}
                    <Section label="Verdict Thresholds" c={c}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[["PASS", data.verdict_context?.pass_threshold, c.green], ["MAYBE", data.verdict_context?.maybe_threshold, c.amber], ["STRUGGLE", data.verdict_context?.fail_indicators, c.red]].map(([label, val, col]) => (
                          <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ fontSize: "0.6rem", padding: "2px 8px", borderRadius: 3, background: `${col}18`, color: col, border: `1px solid ${col}30`, flexShrink: 0, marginTop: 2, letterSpacing: "0.06em" }}>{label}</span>
                            <span style={{ fontSize: "0.76rem", color: c.textMuted, lineHeight: 1.6 }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  </div>
                );
              }
            })()}
          </div>

          {/* Log panel */}
          <div style={{ borderTop: `1px solid ${c.border}`, background: c.surface, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "6px 14px", borderBottom: `1px solid ${c.border}`, fontSize: "0.62rem", color: c.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
              <span>Agent log</span>
              <button onClick={() => setLogs([])} style={{ background: "none", border: "none", color: c.textFaint, fontSize: "0.62rem" }}>clear</button>
            </div>
            <div ref={logRef} style={{ flex: 1, overflowY: "auto", padding: "8px 14px", fontFamily: "'DM Mono', monospace" }}>
              {logs.length === 0 && <div style={{ color: c.textFaint, fontSize: "0.72rem" }}>No activity yet. Run research to see logs.</div>}
              {logs.map((log, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 3 }}>
                  <span style={{ color: c.textFaint, flexShrink: 0, fontSize: "0.68rem" }}>{log.ts}</span>
                  <span style={{ color: logColor(log.type), fontSize: "0.72rem" }}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION COMPONENT ───────────────────────────────────────────────────────
function Section({ label, children, c, noMargin = false }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 20 }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textFaint, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${c.border}` }}>{label}</div>
      {children}
    </div>
  );
}
