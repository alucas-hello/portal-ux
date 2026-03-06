import { useState, useEffect, useRef } from "react";

// Prototype detail data — all colleges link to this screen
export const COLLEGE_DETAIL = {
  // Basic Info
  name: "University of Michigan",
  nickname: "UMich",
  type: "Public",
  city: "Ann Arbor",
  state: "MI",
  country: "USA",
  ipeds: "170976",
  phone: "(734) 764-1817",
  nearestMetro: "Detroit",
  campusSetting: "City: Large",
  difficulty: "Most Selective",
  categories: "Public Research University",
  testOptional: false,
  website: "umich.edu",
  ceebCode: "1839",
  // Application
  commonApp: true,
  coalitionApp: false,
  umichApp: true,
  appFee: 75,
  lorRequired: 1,
  lorOptional: true,
  essaysRequired: true,
  superscoreACT: true,
  superscoreSAT: true,
  // Enrollment & Outcomes
  enrolledFreshmen: 7290,
  undergrads: 32282,
  gradRate4yr: 81,
  gradRate6yr: 93,
  retention: 97,
  studentFacultyRatio: 15,
  // Test Scores
  act25: 31,
  act75: 34,
  sat25: 1360,
  sat75: 1530,
  avgGPA: 3.88,
  // Acceptance
  acceptanceOverall: 16,
  yield: 45,
  acceptanceByMajor: [
    { major: "LSA (Liberal Arts)", rate: 18 },
    { major: "Engineering", rate: 8 },
    { major: "Ross (Business)", rate: 7 },
    { major: "Nursing", rate: 14 },
    { major: "Architecture", rate: 20 },
    { major: "Information", rate: 15 },
    { major: "Kinesiology", rate: 30 },
    { major: "Music, Theatre & Dance", rate: 20 },
    { major: "Art & Design", rate: 25 },
    { major: "Natural Resources", rate: 50 },
  ],
  // Deadlines
  eaDeadline: "11/01/25",
  eaNotification: "12/24/25",
  edDeadline: "",
  edNotification: "",
  rdDeadline: "02/01/26",
  rdNotification: "04/01/26",
  // Financial Aid
  tuitionInState: 18346,
  tuitionOutOfState: 63962,
  fees: 328,
  roomBoard: 16246,
  books: 1184,
  avgAidPackage: 19200,
  pctReceivingAid: 68,
  pctNeedMet: 90,
  finaidWebsite: "finaid.umich.edu",
  // Rankings
  usNewsNational: 21,
  usNewsBestPublic: 3,
  usNewsEngineering: 9,
  usNewsBusiness: 12,
  usNewsCS: 9,
  usNewsNursing: 16,
  forbes: 18,
  // Admissions Factors (VI=Very Important, I=Important, C=Considered, NC=Not Considered)
  admissionsFactors: [
    { label: "Rigor of secondary school record", rating: "VI" },
    { label: "Class rank", rating: "C" },
    { label: "Academic GPA", rating: "VI" },
    { label: "Standardized test scores", rating: "I" },
    { label: "Application essay", rating: "VI" },
    { label: "Recommendations", rating: "I" },
    { label: "Interview", rating: "NC" },
    { label: "Extracurricular activities", rating: "I" },
    { label: "Talent/ability", rating: "I" },
    { label: "Character/personal qualities", rating: "VI" },
    { label: "First generation", rating: "C" },
    { label: "Alumni/ae relation", rating: "C" },
    { label: "Geographical residence", rating: "I" },
    { label: "State residency", rating: "VI" },
    { label: "Religious affiliation/commitment", rating: "NC" },
    { label: "Racial/ethnic status", rating: "NC" },
    { label: "Volunteer work", rating: "C" },
    { label: "Work experience", rating: "C" },
    { label: "Level of applicant's interest", rating: "NC" },
  ],
  // HC Insight
  hcInsight: "Strong preference for in-state applicants — state residency is listed as Very Important. Ross School of Business and College of Engineering are highly competitive with sub-10% acceptance rates. Test scores required (not test optional). Strong alumni network, especially in Midwest. Students should apply EA (Nov 1) as RD acceptance rates are lower. UMich tends to superscore both ACT and SAT.",
  // BS/MD
  bsMdProgram: "",
  verified: true,
};

function StatChip({ label, value, accent, sub }) {
  return (
    <div className="rounded-lg px-3 py-2 flex-1 min-w-0" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold leading-none mb-0.5" style={{ color: "#b2b2b2" }}>{label}</p>
      <p className="text-sm font-bold leading-snug" style={{ color: accent || "#281d51" }}>{value}</p>
      {sub && <p className="text-xs leading-none mt-0.5" style={{ color: "#b2b2b2" }}>{sub}</p>}
    </div>
  );
}

function FieldRow({ label, value, edit, input, labelWidth = 148 }) {
  return (
    <div className="flex items-start gap-2 py-0.5" style={{ borderBottom: "1px solid #f0edf5" }}>
      <span className="text-xs font-semibold flex-shrink-0 leading-5" style={{ color: "#b2b2b2", width: labelWidth }}>{label}</span>
      {edit ? input : <span className="text-xs leading-5" style={{ color: value !== undefined && value !== null && value !== "" ? "#474747" : "#c0bad4" }}>{value !== undefined && value !== null && value !== "" ? value : "—"}</span>}
    </div>
  );
}

const FACTOR_COLORS = {
  VI: { bg: "#281d51", text: "#ffffff", label: "Very Important" },
  I:  { bg: "#6b59a8", text: "#ffffff", label: "Important" },
  C:  { bg: "#bfb4db", text: "#281d51", label: "Considered" },
  NC: { bg: "#ede9f5", text: "#9e94b8", label: "Not Considered" },
};

function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm px-4 py-3 ${className}`} style={{ border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>{title}</p>
      {children}
    </div>
  );
}

export function CollegeDetail({ college, editing, onEdit, onSave, onCancel }) {
  const [form, setForm] = useState({ ...college, admissionsFactors: college.admissionsFactors.map(f => ({ ...f })), acceptanceByMajor: college.acceptanceByMajor.map(m => ({ ...m })) });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setForm({ ...college, admissionsFactors: college.admissionsFactors.map(f => ({ ...f })), acceptanceByMajor: college.acceptanceByMajor.map(m => ({ ...m })) });
    }
  }, [editing]);

  useEffect(() => {
    const findScrollParent = (el) => {
      if (!el || el === document.documentElement) return document.documentElement;
      const style = window.getComputedStyle(el);
      if (/auto|scroll/.test(style.overflow + style.overflowY)) return el;
      return findScrollParent(el.parentElement);
    };
    const parent = findScrollParent(containerRef.current?.parentElement);
    const getY = () => parent === document.documentElement ? window.scrollY : parent.scrollTop;
    const handler = () => setScrollY(getY());
    parent.addEventListener("scroll", handler, { passive: true });
    return () => parent.removeEventListener("scroll", handler);
  }, []);

  const f = v => e => setForm(prev => ({ ...prev, [v]: e.target.value }));
  const fNum = v => e => setForm(prev => ({ ...prev, [v]: e.target.value }));
  const fBool = v => e => setForm(prev => ({ ...prev, [v]: e.target.checked }));

  const inp = (field, type = "text", width = 200) => (
    <input type={type} value={form[field] ?? ""} onChange={f(field)} className="px-2 py-1 rounded-md text-sm"
      style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", width }} />
  );

  const data = editing ? form : college;
  const totalCostOOS = data.tuitionOutOfState + data.fees + data.roomBoard + data.books;
  const totalCostIS = data.tuitionInState + data.fees + data.roomBoard + data.books;

  // Parallax: image moves up at 35% of scroll speed
  const imgTranslate = scrollY * -0.35;
  // Mask: transparent at scrollY=0, increases as you scroll down; scroll back up to reveal full photo
  const maskOpacity = Math.min(0.82, scrollY / 280 * 0.82);

  return (
    <div ref={containerRef}>
      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", height: "55vh", minHeight: 300, overflow: "hidden", backgroundColor: "#00274C" }}>
        {/* Parallax image — 140% height gives room above and below for travel */}
        <img
          src={`${import.meta.env.BASE_URL}michigan_banner.png`}
          alt=""
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "140%",
            objectFit: "cover", objectPosition: "center",
            transform: `translateY(${imgTranslate}px)`,
            willChange: "transform",
          }}
        />
        {/* Scroll-driven gradient mask */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,39,76,0.15) 0%, rgba(0,39,76,0.9) 100%)",
          opacity: maskOpacity,
          transition: "opacity 0.04s linear",
        }} />
        {/* Permanent bottom fade so content below reads cleanly */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,39,76,0.55) 100%)" }} />

        {/* Name overlaid at bottom of banner */}
        <div style={{ position: "absolute", bottom: 44, left: 24, right: 24, zIndex: 2 }}>
          {editing ? (
            <input value={form.name} onChange={f("name")} className="font-bold text-2xl w-full px-3 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(0,0,0,0.35)", color: "white", border: "1px solid rgba(255,255,255,0.25)", outline: "none", backdropFilter: "blur(4px)" }} />
          ) : (
            <h1 className="font-bold" style={{ fontSize: 28, color: "white", textShadow: "0 2px 16px rgba(0,0,0,0.6)", lineHeight: 1.2 }}>{data.name}</h1>
          )}
        </div>
      </div>

      {/* ── WHITE CONTENT SHEET ── slides up from below banner */}
      <div style={{ position: "relative", zIndex: 10, backgroundColor: "white", borderRadius: "24px 24px 0 0", marginTop: -28 }}>
        {/* Logo + metadata row — logo overlaps the banner edge */}
        <div className="flex items-end gap-4" style={{ padding: "0 24px", marginTop: -44, marginBottom: 4 }}>
          <div className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: 88, height: 88, border: "4px solid white", backgroundColor: "#00274C", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
            <img src={`${import.meta.env.BASE_URL}michigan_logo.png`} alt="U of M" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            {editing ? (
              <div className="flex flex-wrap gap-2 mb-2">
                <select value={form.type} onChange={f("type")} className="px-2 py-1 rounded-lg text-xs" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
                  <option>Public</option><option>Private</option><option>Private Non-Profit</option>
                </select>
                <input value={form.city} onChange={f("city")} placeholder="City" className="px-2 py-1 rounded-lg text-xs" style={{ border: "1px solid #c0bad4", color: "#474747", width: 110, outline: "none" }} />
                <input value={form.state} onChange={f("state")} placeholder="ST" className="px-2 py-1 rounded-lg text-xs" style={{ border: "1px solid #c0bad4", color: "#474747", width: 46, outline: "none" }} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: data.type === "Public" ? "#e0f5f0" : "#f0edf5", color: data.type === "Public" ? "#42778c" : "#8e7bb7" }}>{data.type}</span>
                <span className="text-sm" style={{ color: "#474747" }}>{data.city}, {data.state}</span>
                <span style={{ color: "#c0bad4" }}>·</span>
                <span className="text-sm" style={{ color: "#474747" }}>{data.difficulty}</span>
                {data.commonApp && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Common App</span>}
                {data.testOptional && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>Test Optional</span>}
              </div>
            )}
            {editing ? (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>CEEB</span>
                  <input value={form.ceebCode} onChange={f("ceebCode")} className="px-2 py-1 rounded text-xs w-20" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
                </div>
                <input value={form.website} onChange={f("website")} className="px-2 py-1 rounded text-xs w-36" style={{ border: "1px solid #c0bad4", color: "#42778c", outline: "none" }} />
                <input value={form.phone} onChange={f("phone")} className="px-2 py-1 rounded text-xs w-36" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm" style={{ color: "#b2b2b2" }}>CEEB <span className="font-bold" style={{ color: "#281d51" }}>{data.ceebCode}</span></span>
                <span className="text-sm" style={{ color: "#42778c" }}>{data.website}</span>
                <span className="text-sm" style={{ color: "#b2b2b2" }}>{data.phone}</span>
              </div>
            )}
          </div>
          {/* Verified badge — top-right of card */}
          {data.verified && !editing && (
            <span className="self-start mt-4 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(0,230,195,0.1)", color: "#00e6c3", border: "1px solid rgba(0,230,195,0.3)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              Verified
            </span>
          )}
        </div>

        {/* Key stats row */}
        <div className="flex gap-2 px-6 pb-4 pt-2">
          <StatChip label="ACCEPTANCE RATE" value={`${data.acceptanceOverall}%`} accent="#ff3467" sub={`Yield ${data.yield}%`} />
          <StatChip label="ENROLLED FRESHMEN" value={data.enrolledFreshmen.toLocaleString()} sub={`${data.undergrads.toLocaleString()} undergrads`} />
          <StatChip label="6-YR GRAD RATE" value={`${data.gradRate6yr}%`} accent="#00e6c3" sub={`4-yr: ${data.gradRate4yr}%`} />
          <StatChip label="RETENTION" value={`${data.retention}%`} accent="#00e6c3" />
          <StatChip label="STUDENT / FACULTY" value={`${data.studentFacultyRatio}:1`} />
          <StatChip label="US NEWS RANK" value={`#${data.usNewsNational}`} sub={`#${data.usNewsBestPublic} Public`} />
        </div>
        <div style={{ height: 1, backgroundColor: "#e5e0f0", margin: "0 24px 16px" }} />

        {/* All detail sections */}
        <div className="px-6 pb-8 space-y-3">

          {/* 1. Admissions Factors */}
          <SectionCard title="ADMISSIONS FACTORS">
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(FACTOR_COLORS).map(([key, val]) => (
                <span key={key} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: val.bg, color: val.text }}>{key} — {val.label}</span>
              ))}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {data.admissionsFactors.map((factor, i) => {
                const fc = FACTOR_COLORS[factor.rating] || FACTOR_COLORS.NC;
                return (
                  <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: fc.bg, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <span className="text-xs font-medium" style={{ color: fc.text }}>{factor.label}</span>
                    {editing ? (
                      <select value={form.admissionsFactors[i]?.rating} onChange={e => {
                        const updated = [...form.admissionsFactors];
                        updated[i] = { ...updated[i], rating: e.target.value };
                        setForm(prev => ({ ...prev, admissionsFactors: updated }));
                      }} className="px-1.5 py-0.5 rounded text-xs font-semibold" style={{ border: "1px solid #c0bad4" }}>
                        <option value="VI">VI</option><option value="I">I</option><option value="C">C</option><option value="NC">NC</option>
                      </select>
                    ) : (
                      <span className="text-xs font-bold opacity-70" style={{ color: fc.text }}>{factor.rating}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* 2. Deadlines + Acceptance by Major (side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <SectionCard title="ADMISSIONS DEADLINES">
              <div className="grid grid-cols-3 gap-2">
                {["EA", "ED", "RD"].map(type => {
                  const dlField = type === "EA" ? "eaDeadline" : type === "ED" ? "edDeadline" : "rdDeadline";
                  const ntField = type === "EA" ? "eaNotification" : type === "ED" ? "edNotification" : "rdNotification";
                  const dl = data[dlField];
                  const nt = data[ntField];
                  return (
                    <div key={type} className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
                      <p className="text-xs font-bold mb-1" style={{ color: "#281d51" }}>{type === "EA" ? "Early Action" : type === "ED" ? "Early Decision" : "Regular Decision"}</p>
                      {editing ? (
                        <>
                          <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Deadline</p>
                          <input value={form[dlField]} onChange={f(dlField)} className="w-full px-1.5 py-0.5 rounded text-xs mb-1" style={{ border: "1px solid #c0bad4", color: "#474747" }} placeholder="MM/DD/YY" />
                          <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Notification</p>
                          <input value={form[ntField]} onChange={f(ntField)} className="w-full px-1.5 py-0.5 rounded text-xs" style={{ border: "1px solid #c0bad4", color: "#474747" }} placeholder="MM/DD/YY" />
                        </>
                      ) : (
                        <>
                          <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Deadline</p>
                          <p className="text-xs font-semibold mb-1" style={{ color: dl ? "#474747" : "#c0bad4" }}>{dl || "—"}</p>
                          <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Notification</p>
                          <p className="text-xs font-semibold" style={{ color: nt ? "#42778c" : "#c0bad4" }}>{nt || "—"}</p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="ACCEPTANCE RATES BY MAJOR">
              <div className="flex flex-wrap gap-1.5">
                {data.acceptanceByMajor.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
                    <span className="text-xs font-medium" style={{ color: "#474747" }}>{m.major}</span>
                    <span className="text-xs font-bold" style={{ color: m.rate <= 10 ? "#ff3467" : m.rate <= 20 ? "#fbbf24" : "#00e6c3" }}>{m.rate}%</span>
                  </div>
                ))}
              </div>
              {editing && <p className="text-xs mt-2" style={{ color: "#b2b2b2" }}>Edit in data source.</p>}
              <div className="flex items-center gap-3 mt-2 pt-2" style={{ borderTop: "1px solid #f0edf5" }}>
                {[["#ff3467", "≤10% Very Selective"], ["#fbbf24", "11–20% Selective"], ["#00e6c3", ">20% Less Selective"]].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} /><span className="text-xs" style={{ color: "#b2b2b2" }}>{l}</span></div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* 3. Basic Info + Application */}
          <div className="grid grid-cols-2 gap-3">
            <SectionCard title="BASIC INFORMATION">
              <FieldRow label="IPEDS Code" value={data.ipeds} edit={editing} input={inp("ipeds")} />
              <FieldRow label="Phone" value={data.phone} edit={editing} input={inp("phone")} />
              <FieldRow label="Nearest Metro" value={data.nearestMetro} edit={editing} input={inp("nearestMetro")} />
              <FieldRow label="Campus Setting" value={data.campusSetting} edit={editing} input={inp("campusSetting")} />
              <FieldRow label="Difficulty" value={data.difficulty} edit={editing} input={
                editing ? <select value={form.difficulty} onChange={f("difficulty")} className="px-2 py-0.5 rounded text-xs" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
                  {["Most Selective", "Highly Selective", "Very Selective", "Selective", "Less Selective", "Open Admission"].map(o => <option key={o}>{o}</option>)}
                </select> : null
              } />
              <FieldRow label="Categories" value={data.categories} edit={editing} input={inp("categories")} />
              <FieldRow label="Test Policy" value={data.testOptional ? "Test Optional" : "Test Required"} edit={editing} input={
                editing ? <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "#474747" }}>
                  <input type="checkbox" checked={!!form.testOptional} onChange={fBool("testOptional")} style={{ accentColor: "#55478f" }} /> Test Optional
                </label> : null
              } />
            </SectionCard>

            <SectionCard title="APPLICATION">
              <FieldRow label="Application Fee" value={editing ? null : `$${data.appFee}`} edit={editing} input={inp("appFee", "number", 100)} />
              <FieldRow label="App Methods" value={editing ? null : [data.commonApp && "Common App", data.coalitionApp && "Coalition", data.umichApp && "UMich App"].filter(Boolean).join(", ")} edit={editing} input={
                editing ? <div className="flex flex-col gap-0.5">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.commonApp} onChange={fBool("commonApp")} style={{ accentColor: "#55478f" }} /> Common App</label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.coalitionApp} onChange={fBool("coalitionApp")} style={{ accentColor: "#55478f" }} /> Coalition App</label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.umichApp} onChange={fBool("umichApp")} style={{ accentColor: "#55478f" }} /> UMich App</label>
                </div> : null
              } />
              <FieldRow label="Letters of Rec" value={editing ? null : `${data.lorRequired} required${data.lorOptional ? " + optional" : ""}`} edit={editing} input={
                editing ? <div className="flex items-center gap-2">
                  <input type="number" value={form.lorRequired} onChange={fNum("lorRequired")} className="px-1.5 py-0.5 rounded text-xs w-14" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
                  <label className="flex items-center gap-1 text-xs cursor-pointer"><input type="checkbox" checked={!!form.lorOptional} onChange={fBool("lorOptional")} style={{ accentColor: "#55478f" }} /> Optional</label>
                </div> : null
              } />
              <FieldRow label="Essays Required" value={editing ? null : data.essaysRequired ? "Yes" : "No"} edit={editing} input={
                editing ? <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.essaysRequired} onChange={fBool("essaysRequired")} style={{ accentColor: "#55478f" }} /> Required</label> : null
              } />
              <FieldRow label="Superscore ACT" value={editing ? null : data.superscoreACT ? "Yes" : "No"} edit={editing} input={
                editing ? <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.superscoreACT} onChange={fBool("superscoreACT")} style={{ accentColor: "#55478f" }} /> Yes</label> : null
              } />
              <FieldRow label="Superscore SAT" value={editing ? null : data.superscoreSAT ? "Yes" : "No"} edit={editing} input={
                editing ? <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={!!form.superscoreSAT} onChange={fBool("superscoreSAT")} style={{ accentColor: "#55478f" }} /> Yes</label> : null
              } />
            </SectionCard>
          </div>

          {/* 4. Test Scores + Rankings */}
          <div className="grid grid-cols-2 gap-3">
            <SectionCard title="TEST SCORES & GPA">
              <FieldRow label="ACT 25th %ile" value={data.act25} edit={editing} input={inp("act25", "number", 100)} />
              <FieldRow label="ACT 75th %ile" value={data.act75} edit={editing} input={inp("act75", "number", 100)} />
              <FieldRow label="SAT 25th %ile" value={data.sat25} edit={editing} input={inp("sat25", "number", 100)} />
              <FieldRow label="SAT 75th %ile" value={data.sat75} edit={editing} input={inp("sat75", "number", 100)} />
              <FieldRow label="Avg GPA (Unweighted)" value={data.avgGPA} edit={editing} input={inp("avgGPA", "number", 100)} />
            </SectionCard>

            <SectionCard title="RANKINGS">
              <FieldRow label="US News — National" value={editing ? null : `#${data.usNewsNational}`} edit={editing} input={inp("usNewsNational", "number", 80)} />
              <FieldRow label="US News — Best Public" value={editing ? null : `#${data.usNewsBestPublic}`} edit={editing} input={inp("usNewsBestPublic", "number", 80)} />
              <FieldRow label="US News — Engineering" value={editing ? null : `#${data.usNewsEngineering}`} edit={editing} input={inp("usNewsEngineering", "number", 80)} />
              <FieldRow label="US News — Business" value={editing ? null : `#${data.usNewsBusiness}`} edit={editing} input={inp("usNewsBusiness", "number", 80)} />
              <FieldRow label="US News — CS" value={editing ? null : `#${data.usNewsCS}`} edit={editing} input={inp("usNewsCS", "number", 80)} />
              <FieldRow label="US News — Nursing" value={editing ? null : `#${data.usNewsNursing}`} edit={editing} input={inp("usNewsNursing", "number", 80)} />
              <FieldRow label="Forbes" value={editing ? null : `#${data.forbes}`} edit={editing} input={inp("forbes", "number", 80)} />
            </SectionCard>
          </div>

          {/* 5. Financial Aid */}
          <SectionCard title="FINANCIAL AID & COSTS">
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <FieldRow label="Tuition (In-State)" value={editing ? null : `$${data.tuitionInState.toLocaleString()}`} edit={editing} input={inp("tuitionInState", "number")} />
                <FieldRow label="Tuition (Out-of-State)" value={editing ? null : `$${data.tuitionOutOfState.toLocaleString()}`} edit={editing} input={inp("tuitionOutOfState", "number")} />
                <FieldRow label="Fees" value={editing ? null : `$${data.fees.toLocaleString()}`} edit={editing} input={inp("fees", "number")} />
                <FieldRow label="Room & Board" value={editing ? null : `$${data.roomBoard.toLocaleString()}`} edit={editing} input={inp("roomBoard", "number")} />
                <FieldRow label="Books & Supplies" value={editing ? null : `$${data.books.toLocaleString()}`} edit={editing} input={inp("books", "number")} />
                {!editing && <FieldRow label="Total CoA (Out-of-State)" value={`$${totalCostOOS.toLocaleString()}`} />}
                {!editing && <FieldRow label="Total CoA (In-State)" value={`$${totalCostIS.toLocaleString()}`} />}
              </div>
              <div>
                <FieldRow label="Avg Aid Package" value={editing ? null : `$${data.avgAidPackage.toLocaleString()}`} edit={editing} input={inp("avgAidPackage", "number")} />
                <FieldRow label="% Receiving Aid" value={editing ? null : `${data.pctReceivingAid}%`} edit={editing} input={inp("pctReceivingAid", "number", 80)} />
                <FieldRow label="% of Need Met" value={editing ? null : `${data.pctNeedMet}%`} edit={editing} input={inp("pctNeedMet", "number", 80)} />
                <FieldRow label="Financial Aid Website" value={data.finaidWebsite} edit={editing} input={inp("finaidWebsite")} />
              </div>
            </div>
          </SectionCard>

          {/* 6. HC Insight + BS/MD */}
          <div className="grid grid-cols-2 gap-3">
            <SectionCard title="HC INSIGHT">
              {editing ? (
                <textarea value={form.hcInsight} onChange={f("hcInsight")} rows={4} className="w-full px-2.5 py-1.5 rounded-lg text-xs" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", resize: "vertical" }} />
              ) : (
                <p className="text-xs leading-relaxed" style={{ color: data.hcInsight ? "#474747" : "#c0bad4" }}>{data.hcInsight || "No insights added."}</p>
              )}
            </SectionCard>
            <SectionCard title="BS/MD PROGRAMS">
              {editing ? (
                <textarea value={form.bsMdProgram} onChange={f("bsMdProgram")} rows={4} className="w-full px-2.5 py-1.5 rounded-lg text-xs" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", resize: "vertical" }} placeholder="Describe any BS/MD or direct-admit medical programs..." />
              ) : (
                <p className="text-xs leading-relaxed" style={{ color: data.bsMdProgram ? "#474747" : "#c0bad4" }}>{data.bsMdProgram || "No BS/MD programs noted."}</p>
              )}
            </SectionCard>
          </div>

        </div>{/* end px-6 pb-8 sections */}
      </div>{/* end white content sheet */}
    </div>
  );
}

const SAMPLE_COLLEGES = [
  { id: 1, name: "Harvard University", acceptance: 3.4, state: "MA", act25: "34/1510", act75: "36/1580", eaDeadline: "11/01/25", edDeadline: null },
  { id: 2, name: "Stanford University", acceptance: 3.7, state: "CA", act25: "33/1500", act75: "35/1570", eaDeadline: null, edDeadline: null },
  { id: 3, name: "MIT", acceptance: 3.9, state: "MA", act25: "34/1520", act75: "36/1580", eaDeadline: "11/01/25", edDeadline: null },
  { id: 4, name: "University of Michigan", acceptance: 20.2, state: "MI", act25: "31/1380", act75: "34/1530", eaDeadline: "11/01/25", edDeadline: null },
  { id: 5, name: "University of Texas at Austin", acceptance: 31.8, state: "TX", act25: "27/1230", act75: "33/1480", eaDeadline: null, edDeadline: null },
  { id: 6, name: "Georgia Tech", acceptance: 17.3, state: "GA", act25: "32/1420", act75: "35/1550", eaDeadline: "11/01/25", edDeadline: null },
  { id: 7, name: "UCLA", acceptance: 8.8, state: "CA", act25: "31/1400", act75: "35/1540", eaDeadline: null, edDeadline: null },
  { id: 8, name: "University of Virginia", acceptance: 18.7, state: "VA", act25: "32/1410", act75: "35/1540", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 9, name: "Duke University", acceptance: 5.7, state: "NC", act25: "34/1510", act75: "36/1570", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 10, name: "Northwestern University", acceptance: 7.0, state: "IL", act25: "33/1490", act75: "35/1560", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 11, name: "Vanderbilt University", acceptance: 5.6, state: "TN", act25: "34/1500", act75: "36/1570", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 12, name: "Rice University", acceptance: 8.7, state: "TX", act25: "34/1510", act75: "36/1570", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 13, name: "Emory University", acceptance: 11.4, state: "GA", act25: "32/1430", act75: "35/1540", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 14, name: "University of Florida", acceptance: 23.5, state: "FL", act25: "29/1310", act75: "33/1480", eaDeadline: null, edDeadline: null },
  { id: 15, name: "Boston University", acceptance: 14.4, state: "MA", act25: "32/1400", act75: "34/1530", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 16, name: "University of Southern California", acceptance: 12.4, state: "CA", act25: "33/1470", act75: "35/1550", eaDeadline: null, edDeadline: null },
  { id: 17, name: "NYU", acceptance: 12.2, state: "NY", act25: "32/1430", act75: "35/1550", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 18, name: "University of Washington", acceptance: 47.5, state: "WA", act25: "28/1270", act75: "33/1470", eaDeadline: null, edDeadline: null },
  { id: 19, name: "Ohio State University", acceptance: 53.0, state: "OH", act25: "27/1220", act75: "32/1430", eaDeadline: "11/01/25", edDeadline: null },
  { id: 20, name: "Penn State University", acceptance: 55.8, state: "PA", act25: "26/1190", act75: "31/1390", eaDeadline: null, edDeadline: null },
  { id: 21, name: "University of Wisconsin-Madison", acceptance: 49.2, state: "WI", act25: "28/1280", act75: "32/1450", eaDeadline: "11/01/25", edDeadline: null },
  { id: 22, name: "Auburn University", acceptance: 44.0, state: "AL", act25: "26/1180", act75: "31/1370", eaDeadline: null, edDeadline: null },
  { id: 23, name: "Clemson University", acceptance: 43.4, state: "SC", act25: "28/1260", act75: "32/1410", eaDeadline: null, edDeadline: null },
  { id: 24, name: "Arizona State University", acceptance: 88.4, state: "AZ", act25: "22/1060", act75: "29/1310", eaDeadline: null, edDeadline: null },
  { id: 25, name: "Indiana University Bloomington", acceptance: 80.1, state: "IN", act25: "25/1140", act75: "31/1370", eaDeadline: "11/01/25", edDeadline: null },
  { id: 26, name: "University of Colorado Boulder", acceptance: 78.8, state: "CO", act25: "26/1180", act75: "31/1380", eaDeadline: "11/01/25", edDeadline: null },
  { id: 27, name: "Tulane University", acceptance: 11.0, state: "LA", act25: "31/1380", act75: "34/1510", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 28, name: "University of Georgia", acceptance: 39.5, state: "GA", act25: "29/1300", act75: "33/1470", eaDeadline: "10/15/25", edDeadline: null },
  { id: 29, name: "University of Illinois Urbana-Champaign", acceptance: 44.8, state: "IL", act25: "29/1310", act75: "34/1520", eaDeadline: "11/01/25", edDeadline: null },
  { id: 30, name: "Purdue University", acceptance: 53.4, state: "IN", act25: "27/1210", act75: "33/1470", eaDeadline: "11/01/25", edDeadline: null },
  { id: 31, name: "University of North Carolina at Chapel Hill", acceptance: 16.9, state: "NC", act25: "31/1380", act75: "34/1520", eaDeadline: "10/15/25", edDeadline: null },
  { id: 32, name: "Wake Forest University", acceptance: 21.5, state: "NC", act25: "31/1380", act75: "34/1510", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 33, name: "University of Miami", acceptance: 19.1, state: "FL", act25: "31/1380", act75: "34/1510", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 34, name: "Florida State University", acceptance: 25.1, state: "FL", act25: "27/1230", act75: "31/1380", eaDeadline: null, edDeadline: null },
  { id: 35, name: "University of Alabama", acceptance: 80.2, state: "AL", act25: "23/1080", act75: "31/1360", eaDeadline: null, edDeadline: null },
  { id: 36, name: "Texas A&M University", acceptance: 57.6, state: "TX", act25: "26/1190", act75: "32/1410", eaDeadline: null, edDeadline: null },
  { id: 37, name: "University of Pittsburgh", acceptance: 52.4, state: "PA", act25: "28/1270", act75: "33/1450", eaDeadline: null, edDeadline: null },
  { id: 38, name: "University of Maryland", acceptance: 41.2, state: "MD", act25: "30/1350", act75: "34/1510", eaDeadline: "11/01/25", edDeadline: null },
  { id: 39, name: "Baylor University", acceptance: 52.3, state: "TX", act25: "26/1200", act75: "31/1390", eaDeadline: "11/01/25", edDeadline: null },
  { id: 40, name: "Syracuse University", acceptance: 41.6, state: "NY", act25: "27/1230", act75: "32/1420", eaDeadline: null, edDeadline: "11/15/25" },
  { id: 41, name: "Colorado School of Mines", acceptance: 42.5, state: "CO", act25: "30/1340", act75: "34/1510", eaDeadline: "11/01/25", edDeadline: null },
  { id: 42, name: "Villanova University", acceptance: 23.1, state: "PA", act25: "31/1380", act75: "34/1510", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 43, name: "University of Connecticut", acceptance: 52.5, state: "CT", act25: "28/1260", act75: "32/1430", eaDeadline: null, edDeadline: null },
  { id: 44, name: "Northeastern University", acceptance: 6.7, state: "MA", act25: "33/1480", act75: "35/1560", eaDeadline: "11/01/25", edDeadline: "11/01/25" },
  { id: 45, name: "University of South Carolina", acceptance: 68.1, state: "SC", act25: "25/1140", act75: "30/1350", eaDeadline: null, edDeadline: null },
  { id: 46, name: "Michigan State University", acceptance: 76.3, state: "MI", act25: "24/1100", act75: "30/1360", eaDeadline: null, edDeadline: null },
  { id: 47, name: "University of Oregon", acceptance: 82.4, state: "OR", act25: "24/1090", act75: "30/1340", eaDeadline: "11/01/25", edDeadline: null },
  { id: 48, name: "Loyola University Chicago", acceptance: 65.3, state: "IL", act25: "26/1180", act75: "31/1380", eaDeadline: "11/01/25", edDeadline: null },
  { id: 49, name: "George Washington University", acceptance: 38.4, state: "DC", act25: "30/1350", act75: "34/1510", eaDeadline: null, edDeadline: "11/01/25" },
  { id: 50, name: "Santa Clara University", acceptance: 42.7, state: "CA", act25: "29/1310", act75: "33/1480", eaDeadline: "11/01/25", edDeadline: null },
];

export default function CollegesPage({ onViewCollege }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SAMPLE_COLLEGES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "name": va = a.name; vb = b.name; break;
      case "acceptance": va = a.acceptance; vb = b.acceptance; break;
      case "state": va = a.state; vb = b.state; break;
      case "act25": va = a.act25; vb = b.act25; break;
      case "act75": va = a.act75; vb = b.act75; break;
      case "ea": va = a.eaDeadline || ""; vb = b.eaDeadline || ""; break;
      case "ed": va = a.edDeadline || ""; vb = b.edDeadline || ""; break;
      default: va = a.name; vb = b.name;
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const SortHeader = ({ col, label }) => (
    <th className="text-left px-4 py-3 text-xs font-semibold cursor-pointer select-none hover:bg-gray-50" style={{ color: "#281d51" }} onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search colleges..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg text-sm w-80" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of 4,071 colleges</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD COLLEGE</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="name" label="Name" />
              <SortHeader col="acceptance" label="Acceptance %" />
              <SortHeader col="state" label="State" />
              <SortHeader col="act25" label="ACT/SAT 25%" />
              <SortHeader col="act75" label="ACT/SAT 75%" />
              <SortHeader col="ea" label="Early Action" />
              <SortHeader col="ed" label="Early Decision" />
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id} onClick={() => onViewCollege(c)} className="hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderBottom: "1px solid #f0edf5" }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{c.name}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{c.acceptance}%</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{c.state}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{c.act25}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{c.act75}</td>
                <td className="px-4 py-3 text-sm" style={{ color: c.eaDeadline ? "#474747" : "#c0bad4" }}>{c.eaDeadline || "—"}</td>
                <td className="px-4 py-3 text-sm" style={{ color: c.edDeadline ? "#474747" : "#c0bad4" }}>{c.edDeadline || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Prev</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
