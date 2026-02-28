import { useState } from "react";

const DAY1 = [
  {
    id: "D1-1",
    time: "Morning",
    topic: "Payment Acceptance — Migration Paths",
    subtopics: [
      "Existing customers on HPM migrating to Zuora Orchestration",
      "Existing customers on HPF using Zuora Orchestration for all/some volume",
      "Existing customers on Zuora SDK using Zuora Orchestration",
      "Reality of a Hybrid experience / How to mitigate time in transition phase",
    ],
    context: "Zuora's legacy hosted payment page (HPM) must be migrated to Yuno's Hosted Payment Form (HPF). This is a complex migration involving token portability and continuity of recurring billing. A hybrid phase is expected where some merchants are on HPM and some on HPF simultaneously.",
    owner: "Jarrett / Joaquin + Leo Liu / Guo Qing",
    keyQuestions: [
      "What is the estimated volume of merchants on HPM vs HPF vs SDK today?",
      "What is the minimum viable migration path to avoid disrupting active subscriptions?",
      "Who owns merchant communication during the transition?",
      "How long is the expected hybrid phase?",
    ],
    openItems: ["Token migration playbook (Chiara — in progress)", "HPM→HPF migration flow confirmation", "SDK white-labeling scope (OR-636)"],
    status: "open",
    priority: "critical",
  },
  {
    id: "D1-2",
    time: "Morning",
    topic: "Payment Methods — Creation, Storage & Presentation",
    subtopics: [
      "Payment method creation and storage",
      "Presentation on checkout and other customer-facing experiences",
      "Native payment methods for CPR and other Zuora Value Added Products",
      "RTAU and BAU",
      "Mandate Management and Migration",
    ],
    context: "Zuora needs a clear mapping of which Yuno payment methods are available and how they're presented. Key complexity: Zuora doesn't always hold raw PANs — they often have PSP-specific gateway tokens (Stripe cus_/pm_ tokens). Yuno must define how to vault these. Zuora also asked about a consistent field to identify payment method type + descriptive string across 1,000+ Yuno methods for checkout and enrollment.",
    owner: "Jarrett / Joaquin + Tyler Schemmel / Feng Liang",
    keyQuestions: [
      "Will Zuora use enrollment flow, payment flow, or both?",
      "Confirm vaulting support: raw PAN + NTI, Stripe tokens, PIX, UPI, Alipay?",
      "What is the common field to return payment method type + detail string across all 1,000+ methods?",
      "What native payment methods are required for CPR/VAPs beyond metadata?",
      "What mandates exist today and what is the migration path?",
    ],
    openItems: [
      "PSP Token Vaulting analysis (G-04 — Under Analysis)",
      "ACH/Digital Wallet vaulting (G-15 — CoreSecOps)",
      "Payment method type strings across 1,000+ methods (G-11 — Pending Yuno)",
      "Enrollment vs payment flow decision (Pending Zuora)",
    ],
    status: "open",
    priority: "critical",
  },
  {
    id: "D1-3",
    time: "Midday",
    topic: "Payment Processing — Source of Truth & Integration Patterns",
    subtopics: [
      "Payment creation and storage",
      "Sync of payments between Yuno and Zuora — Source of Truth",
      "Async vs Sync payment processing",
      "MIT vs CIT payment processing",
      "Subscription Management and NTI / NTID",
      "CEDP data processing",
    ],
    context: "Critical alignment needed on transaction status mapping. Zuora's terminal states (Processed/Error) conflict with Yuno's chargeback lifecycle (SUCCEEDED → IN_DISPUTE → CHARGEBACK → SUCCEEDED). Once Zuora marks a payment 'Processed', it cannot be changed. Yuno must provide a formal status mapping doc and engineering confirmation on how the chargeback lifecycle surfaces at the API level.",
    owner: "Jarrett + Leo Liu / Ming Dai",
    keyQuestions: [
      "Is Status=SUCCEEDED + Sub-status=APPROVED the only terminal success state?",
      "How does the chargeback lifecycle surface — via webhook events or status polling?",
      "How should Zuora handle async payments that remain in Pending for extended periods?",
      "What is the NTI/NTID flow for MIT recurring transactions?",
      "What is CEDP data processing and what does Yuno need to support here?",
    ],
    openItems: [
      "Transaction status mapping document (G-10 — Pending Yuno)",
      "Chargeback lifecycle API behavior confirmation",
      "Async vs sync processing architecture confirmation",
    ],
    status: "open",
    priority: "critical",
  },
  {
    id: "D1-4",
    time: "Midday",
    topic: "Settlement Reporting & Reconciliation",
    subtopics: [
      "Webhooks integration for settlement events",
      "Real-time vs batch reconciliation across payment methods",
    ],
    context: "Zuora requires both real-time and batch reconciliation modes. Webhook integration for settlement events is core. Transaction-level report fields, formats (API, SFTP, CSV), and SLA expectations still need to be defined. Zuora also asked whether end-to-end transaction monitoring is feasible for their merchants without requiring direct access to private Yuno servers.",
    owner: "Jarrett + Tyler Schemmel",
    keyQuestions: [
      "What specific fields are required in transaction-level settlement reports?",
      "What file formats and delivery methods are required (API, SFTP, CSV)?",
      "What are the SLA expectations for report availability?",
      "Is end-to-end transaction monitoring feasible without exposing private Yuno infrastructure?",
      "Real-time vs batch — which payment methods require which mode?",
    ],
    openItems: [
      "Reporting field spec and format definition",
      "End-to-end monitoring feasibility (G-17 — Under Analysis / Andrea Bautista)",
      "Webhook event catalog for settlement",
    ],
    status: "open",
    priority: "high",
  },
  {
    id: "D1-5",
    time: "Afternoon",
    topic: "Embedded Pages — Section-by-Section Review",
    subtopics: [
      "Go over the list of web pages to be embedded in Zuora UI",
      "Tech design: Zuora hosted pages transition to Yuno hosted pages",
      "Selective component embedding request from Zuora",
      "Embedding Zuora components inside Yuno embeds",
    ],
    context: "This is one of the highest-risk items. Yuno's current iFrame SDK embeds full sections (Routing, Connections, Checkout Builder). Zuora has explicitly requested selective component embedding — picking specific sub-sections of Yuno pages — AND the ability to inject Zuora's own components into Yuno embeds. This has NOT been confirmed as feasible. Zuora's UX team (Udit, Swarnim) is also waiting on embeddable component documentation. Engineering is currently blocked by a 404 on the Token Exchange API.",
    owner: "Jarrett / Joaquin + Leo Liu / Feng Liang / Udit / Swarnim",
    keyQuestions: [
      "Can Yuno support selective (partial) section embedding? What is the engineering effort?",
      "Can Zuora inject their own components into Yuno embed containers?",
      "What is the resolution timeline for the Token Exchange API 404?",
      "When will the step-by-step integration guide with code samples be available?",
      "Which sections are in scope for MVP: Routing, Connections, Checkout Builder only?",
    ],
    openItems: [
      "🔴 Token Exchange API 404 — CRITICAL BLOCKER (G-03)",
      "🔴 Step-by-step integration guide + code samples — CRITICAL BLOCKER",
      "Selective component embedding feasibility (G-01 — Under Analysis)",
      "Embeddable components documentation for UX team",
      "Embed Sections: OR-632",
    ],
    status: "blocked",
    priority: "critical",
  },
  {
    id: "D1-6",
    time: "Afternoon",
    topic: "Zuora Platform Integration",
    subtopics: [
      "OneID / SSO Integration",
      "Central Sandbox Support",
      "Release cycle and release criteria",
    ],
    context: "Zuora uses OneID for SSO. Zuora's engineer Feng Liang could not find the Single Sign-On setting in his test account and was blocked. Yuno needs Zuora sandbox access to test embedding and HPM→HPF migration flows. Zuora has expressed they want to show a working embedded prototype at their Product offsite in 2 weeks — making this timeline very tight.",
    owner: "Jarrett + Rafael Kawase + Leo Liu / Guo Qing",
    keyQuestions: [
      "What SSO protocol does Zuora use — SAML or OIDC?",
      "What is required to enable SSO in the test/sandbox account?",
      "When can Yuno get access to Zuora's Central Sandbox?",
      "What are Zuora's release cycle cadences and release criteria?",
      "Can a working embedded prototype be ready for Zuora's Product offsite?",
    ],
    openItems: [
      "SSO / OneID integration (G-12 — Pending Both Teams)",
      "Central Sandbox access for Yuno (G-13 — Pending Zuora)",
      "SSO enablement in Feng Liang's test account",
    ],
    status: "blocked",
    priority: "high",
  },
];

const DAY2 = [
  {
    id: "D2-1",
    time: "Morning",
    topic: "Provisioning — Account Hierarchy & API Requirements",
    subtopics: [
      "Account hierarchy requirements: Standard, Multi-Entity, Multi-Org",
      "API requirements for provisioning new Yuno accounts in hierarchy",
      "API requirements for new user access",
    ],
    context: "Zuora operates across 3 tenant models. Standard (1 tenant → 1 Yuno account) is the MVP baseline. Multi-Entity requires a separate Yuno account per Zuora tenant with an umbrella org above. Multi-Org requires Yuno to support tenant-global, org-specific, or inherited credential models. Zuora's engineers have explicitly asked for an API to create sub-accounts under a parent, with isolated traffic per sub-account and a sub-account reference key appearing on all traffic.",
    owner: "Jarrett / Joaquin + Leo Liu / Guo Qing / Ming Dai",
    keyQuestions: [
      "For Multi-Entity: does each entity get its own Yuno credentials or shared under an umbrella org?",
      "For Multi-Org: tenant-global, org-specific, or inherited config model — which does Zuora prefer?",
      "Is sub-account traffic fully isolated or just logically tagged?",
      "What identifier format is required on all traffic as a sub-account reference key?",
      "What is the API spec for account creation and user provisioning?",
    ],
    openItems: [
      "Sub-Account API (G-07 — Pending Yuno / OR-635)",
      "Multi-Entity / Multi-Org mapping design (OR-634 — Future Phase)",
      "API for user access provisioning tied to Zuora's permission model",
    ],
    status: "open",
    priority: "high",
  },
  {
    id: "D2-2",
    time: "Morning",
    topic: "Dispute Management — Processing & Payment Lifecycle",
    subtopics: [
      "Dispute processing and Payment lifecycle management",
      "Chargeback monitoring and webhook notifications",
      "AI Dispute Management product integration",
      "Who owns dispute resolution communication to end merchant",
    ],
    context: "Zuora cannot update a payment record once it reaches 'Processed'. Yuno's chargeback lifecycle (SUCCEEDED → IN_DISPUTE → CHARGEBACK → SUCCEEDED) conflicts with this. Zuora needs clarity on how dispute data flows through both systems. Zuora also asked specifically about Yuno's AI chargeback/dispute management product — how it works and how it integrates with the Zuora setup. This is pending an internal answer from Carol / Bernabe.",
    owner: "Jarrett + Carol Oppenheimer / Bernabe Murata + Tyler Schemmel",
    keyQuestions: [
      "How does a chargeback event surface to Zuora — webhook, status change, or both?",
      "What is Yuno's recommended pattern for keeping a Zuora payment in 'Pending' during an open dispute?",
      "How does Yuno's AI Dispute Management product work and how does it fit the Zuora integration?",
      "Who communicates dispute status to the end merchant — Zuora or Yuno?",
      "What data fields are included in chargeback webhook events?",
    ],
    openItems: [
      "AI Dispute Management integration explanation (G-14 — Carol / Bernabe)",
      "Dispute data flow design across both systems",
      "Transaction status mapping doc including chargeback lifecycle (G-10)",
    ],
    status: "open",
    priority: "high",
  },
  {
    id: "D2-3",
    time: "Afternoon",
    topic: "Enablement — Implementation Process & Training",
    subtopics: [
      "Standard implementation process with Yuno Professional Services",
      "Identify areas of complexity for Zuora GS teams",
      "Internal Yuno ↔ Zuora training sessions (Support, Sales, and more)",
    ],
    context: "Zuora serves ~800 enterprise customers and needs a formal support operating model covering tiers, SLAs, escalation paths, and KPIs. Zuora's head of support was very interested in Yuno's AI-assisted support tooling. A formal Support Model doc has not yet been delivered. Yuno's tier structure is: Tier 1 (24/7 Tech Support) → Tier 2 (TAM) → Tier 3 (Engineering).",
    owner: "Jarrett + Daniel Rebelo / Rafael Kawase + Zuora GS team",
    keyQuestions: [
      "What is the standard Yuno implementation timeline and phase structure?",
      "What does Zuora's GS team need to support their 800 merchants on this integration?",
      "What training format is preferred — live sessions, async docs, or both?",
      "Who is the Yuno DRI for ongoing support escalations post-launch?",
      "How is Yuno's AI support tooling integrated into the tier model?",
    ],
    openItems: [
      "Support Model documentation (G-19 — Pending Yuno / Daniel Rebelo)",
      "SLA by severity documentation (P1/P2/P3)",
      "Formal KPI report from Pylon (Alessandra Ribeiro)",
      "Roadmap prioritization process for partner requests (G-17 — Juanma / Julie Santiago)",
    ],
    status: "open",
    priority: "medium",
  },
];

const PREWORK = [
  { id: "P-01", task: "Token Exchange API 404 — resolve and document", owner: "Dashboard Eng / Andres Sanz", due: "ASAP — BLOCKING", status: "open", priority: "critical" },
  { id: "P-02", task: "Step-by-step embedded integration guide + code samples", owner: "Dashboard Team / Andrea Bautista", due: "Before Mar 9", status: "open", priority: "critical" },
  { id: "P-03", task: "Transaction Status Mapping doc (incl. chargeback lifecycle)", owner: "Jarrett + Bernabe / Core Eng", due: "Before Mar 9", status: "open", priority: "critical" },
  { id: "P-04", task: "AI Dispute Management — integration explainer for Zuora", owner: "Carol Oppenheimer / Bernabe", due: "Before Mar 9", status: "open", priority: "high" },
  { id: "P-05", task: "Embeddable component docs for Zuora UX team (Udit, Swarnim)", owner: "Andres Sanz / Dashboard", due: "Before Mar 9", status: "open", priority: "high" },
  { id: "P-06", task: "22M ACH / 12-hour capacity validation with Vantiv", owner: "CoreCheckout / SalesEng", due: "Before Mar 9", status: "open", priority: "high" },
  { id: "P-07", task: "Selective component embedding — engineering feasibility answer", owner: "Dashboard Eng", due: "Before Mar 9", status: "open", priority: "high" },
  { id: "P-08", task: "PSP token vaulting analysis (Stripe tokens, ACH, PIX, UPI, Alipay)", owner: "CoreSecOps / Chiara", due: "Mar 14", status: "open", priority: "high" },
  { id: "P-09", task: "Historical uptime actuals per processor connection", owner: "Jairo Rivero", due: "Mar 14", status: "open", priority: "medium" },
  { id: "P-10", task: "Support Model doc (tiers, SLAs, escalation, KPIs)", owner: "Daniel Rebelo / Anastasia", due: "Mar 14", status: "open", priority: "medium" },
  { id: "P-11", task: "Payment method type/description string solution (1,000+ methods)", owner: "Yuno CoreCheckout / Rafael Kawase", due: "Mar 14", status: "open", priority: "medium" },
  { id: "P-12", task: "Roadmap prioritization process doc for partner requests", owner: "Juanma / Julie Santiago", due: "Mar 14", status: "open", priority: "medium" },
  { id: "P-13", task: "White-label theming spec (colors, typography controls)", owner: "Dashboard Team / OR-633", due: "Mar 14", status: "open", priority: "high" },
  { id: "P-14", task: "System email suppression / rebranding scope (OR-633)", owner: "Dashboard Team", due: "Mar 14", status: "open", priority: "medium" },
  { id: "P-15", task: "Sub-account API design spec (isolated traffic + ref key)", owner: "CoreDashboard / OR-635", due: "Mar 14", status: "open", priority: "high" },
];

const statusColors = {
  open: "bg-blue-100 text-blue-800",
  blocked: "bg-red-100 text-red-800",
  done: "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
};

const priorityDot = { critical: "🔴", high: "🟠", medium: "🟡", low: "⚪" };

function AgendaCard({ item, statuses, onToggle }) {
  const [open, setOpen] = useState(false);
  const status = statuses[item.id] || item.status;
  return (
    <div className={`border rounded-lg mb-3 overflow-hidden shadow-sm ${item.status === "blocked" ? "border-red-300" : "border-gray-200"}`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-gray-50"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-mono text-gray-400 w-12 shrink-0">{item.id}</span>
          <span className="text-xs text-gray-500 w-20 shrink-0">{item.time}</span>
          <span className="font-semibold text-sm text-gray-800 truncate">{priorityDot[item.priority]} {item.topic}</span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <select
            className={`text-xs border rounded px-1.5 py-0.5 font-semibold ${statusColors[status]}`}
            value={status}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); onToggle(item.id, e.target.value); }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Context</p>
            <p className="text-sm text-gray-700">{item.context}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Sub-topics</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.subtopics.map((s, i) => <li key={i} className="text-sm text-gray-700">{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Questions to Resolve</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.keyQuestions.map((q, i) => <li key={i} className="text-sm text-gray-700">{q}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Open Items / Blockers</p>
            <ul className="list-disc list-inside space-y-0.5">
              {item.openItems.map((o, i) => <li key={i} className="text-sm text-red-700">{o}</li>)}
            </ul>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Owner:</p>
            <p className="text-sm text-gray-700">{item.owner}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PreworkRow({ item, statuses, onToggle }) {
  const status = statuses[item.id] || item.status;
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2 text-xs font-mono text-gray-400">{item.id}</td>
      <td className="px-3 py-2 text-sm text-gray-800">{priorityDot[item.priority]} {item.task}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{item.owner}</td>
      <td className={`px-3 py-2 text-xs font-semibold ${item.due.includes("BLOCKING") ? "text-red-600" : "text-gray-600"}`}>{item.due}</td>
      <td className="px-3 py-2">
        <select
          className={`text-xs border rounded px-1.5 py-0.5 font-semibold ${statusColors[status]}`}
          value={status}
          onChange={e => onToggle(item.id, e.target.value)}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
        </select>
      </td>
    </tr>
  );
}

export default function App() {
  const [tab, setTab] = useState("day1");
  const [statuses, setStatuses] = useState({});
  const onToggle = (id, val) => setStatuses(s => ({ ...s, [id]: val }));

  const allItems = [...DAY1, ...DAY2, ...PREWORK];
  const counts = {
    open: allItems.filter(i => (statuses[i.id] || i.status) === "open").length,
    "in-progress": allItems.filter(i => (statuses[i.id] || i.status) === "in-progress").length,
    blocked: allItems.filter(i => (statuses[i.id] || i.status) === "blocked").length,
    done: allItems.filter(i => (statuses[i.id] || i.status) === "done").length,
  };

  const tabs = [
    { id: "day1", label: "Day 1 — Mar 9", subtitle: "Payment Acceptance, Methods, Processing & Embedded Pages" },
    { id: "day2", label: "Day 2 — Mar 10", subtitle: "Provisioning, Disputes & Enablement" },
    { id: "prework", label: "Pre-work / Follow-ups", subtitle: "Due by end of week Mar 14" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Project York</p>
              <h1 className="text-xl font-bold">Integration Workshop Tracker</h1>
              <p className="text-sm text-gray-400 mt-0.5">March 9–10, 2026 · Zuora HQ, Foster City CA · 1001 E Hillsdale Blvd Ste 500</p>
            </div>
            <div className="flex gap-3 text-sm mt-1">
              <div className="text-center"><div className="text-lg font-bold text-red-400">{counts.blocked}</div><div className="text-gray-400 text-xs">Blocked</div></div>
              <div className="text-center"><div className="text-lg font-bold text-blue-300">{counts.open}</div><div className="text-gray-400 text-xs">Open</div></div>
              <div className="text-center"><div className="text-lg font-bold text-yellow-300">{counts["in-progress"]}</div><div className="text-gray-400 text-xs">In Progress</div></div>
              <div className="text-center"><div className="text-lg font-bold text-green-400">{counts.done}</div><div className="text-gray-400 text-xs">Done</div></div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span>Rooms: US FC-Presidio (6) · US FC-Pulgas Ridge (8)</span>
            <span>·</span>
            <span>🔴 Critical · 🟠 High · 🟡 Medium</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              <div>{t.label}</div>
              <div className={`text-xs font-normal mt-0.5 ${tab === t.id ? "text-blue-500" : "text-gray-400"}`}>{t.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {tab === "day1" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 text-sm text-blue-800">
              <strong>Day 1 Focus:</strong> Align on integration architecture, migration strategy, payment method coverage, processing & status mapping, and the embedded page implementation. Click any row to expand.
            </div>
            {DAY1.map(item => <AgendaCard key={item.id} item={item} statuses={statuses} onToggle={onToggle} />)}
          </div>
        )}
        {tab === "day2" && (
          <div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 mb-4 text-sm text-purple-800">
              <strong>Day 2 Focus:</strong> Provisioning hierarchy design, dispute management & chargeback lifecycle, and enablement / support model. Click any row to expand.
            </div>
            {DAY2.map(item => <AgendaCard key={item.id} item={item} statuses={statuses} onToggle={onToggle} />)}
          </div>
        )}
        {tab === "prework" && (
          <div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 mb-4 text-sm text-orange-800">
              <strong>Pre-work & Follow-ups:</strong> Items needed before the workshop or resolved by end of week March 14. Items marked BLOCKING must ship before March 9.
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">ID</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Task</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Owner</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Due</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PREWORK.map(item => <PreworkRow key={item.id} item={item} statuses={statuses} onToggle={onToggle} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
