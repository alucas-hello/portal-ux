import { useState } from "react";

const SAMPLE_SERVICES = [
  { id: 1, code: "CC-JR-10", name: "Counseling - 10 Hours Junior", price: 3500, type: "Regular", maxPurchases: 1, meetings: 10, inUse: true },
  { id: 2, code: "CC-JR-15", name: "Counseling - 15 Hours Junior", price: 4950, type: "Regular", maxPurchases: 1, meetings: 15, inUse: true },
  { id: 3, code: "CC-SR-10", name: "Counseling - 10 Hours Senior", price: 3500, type: "Regular", maxPurchases: 1, meetings: 10, inUse: true },
  { id: 4, code: "CC-SR-15", name: "Counseling - 15 Hours Senior", price: 4950, type: "Regular", maxPurchases: 1, meetings: 15, inUse: true },
  { id: 5, code: "CC-SR-20", name: "Counseling - 20 Hours Senior", price: 6200, type: "Regular", maxPurchases: 1, meetings: 20, inUse: true },
  { id: 6, code: "CC-COMP-JR", name: "Comprehensive Junior Package", price: 7500, type: "Regular", maxPurchases: 1, meetings: 25, inUse: true },
  { id: 7, code: "CC-COMP-SR", name: "Comprehensive Senior Package", price: 8500, type: "Regular", maxPurchases: 1, meetings: 30, inUse: true },
  { id: 8, code: "CC-SOPH-5", name: "Counseling - 5 Hours Sophomore", price: 1750, type: "Regular", maxPurchases: 1, meetings: 5, inUse: true },
  { id: 9, code: "CC-FRESH-5", name: "Counseling - 5 Hours Freshman", price: 1750, type: "Regular", maxPurchases: 1, meetings: 5, inUse: false },
  { id: 10, code: "EC-1", name: "Essay Review - Single", price: 250, type: "Regular", maxPurchases: 10, meetings: 1, inUse: true },
  { id: 11, code: "EC-3", name: "Essay Review - 3 Pack", price: 675, type: "Regular", maxPurchases: 5, meetings: 3, inUse: true },
  { id: 12, code: "EC-5", name: "Essay Review - 5 Pack", price: 1050, type: "Regular", maxPurchases: 3, meetings: 5, inUse: true },
  { id: 13, code: "EC-10", name: "Essay Review - 10 Pack", price: 1900, type: "Regular", maxPurchases: 2, meetings: 10, inUse: true },
  { id: 14, code: "EC-UNLIM", name: "Essay Review - Unlimited", price: 3200, type: "Regular", maxPurchases: 1, meetings: 0, inUse: true },
  { id: 15, code: "EC-PS", name: "Personal Statement Review", price: 450, type: "Regular", maxPurchases: 5, meetings: 2, inUse: true },
  { id: 16, code: "EC-SUPP-3", name: "Supplemental Essays - 3 Schools", price: 900, type: "Regular", maxPurchases: 3, meetings: 3, inUse: true },
  { id: 17, code: "EC-SUPP-5", name: "Supplemental Essays - 5 Schools", price: 1400, type: "Regular", maxPurchases: 2, meetings: 5, inUse: true },
  { id: 18, code: "TP-ACT", name: "ACT Prep - Full Course", price: 1200, type: "Regular", maxPurchases: 2, meetings: 8, inUse: true },
  { id: 19, code: "TP-SAT", name: "SAT Prep - Full Course", price: 1200, type: "Regular", maxPurchases: 2, meetings: 8, inUse: true },
  { id: 20, code: "TP-ACT-INT", name: "ACT Prep - Intensive", price: 2400, type: "Regular", maxPurchases: 1, meetings: 16, inUse: true },
  { id: 21, code: "TP-SAT-INT", name: "SAT Prep - Intensive", price: 2400, type: "Regular", maxPurchases: 1, meetings: 16, inUse: true },
  { id: 22, code: "TP-ACT-4", name: "ACT Tutoring - 4 Sessions", price: 600, type: "Regular", maxPurchases: 5, meetings: 4, inUse: true },
  { id: 23, code: "TP-SAT-4", name: "SAT Tutoring - 4 Sessions", price: 600, type: "Regular", maxPurchases: 5, meetings: 4, inUse: true },
  { id: 24, code: "TP-MATH", name: "Math Tutoring - 4 Sessions", price: 500, type: "Regular", maxPurchases: 10, meetings: 4, inUse: true },
  { id: 25, code: "TP-SCI", name: "Science Tutoring - 4 Sessions", price: 500, type: "Regular", maxPurchases: 10, meetings: 4, inUse: true },
  { id: 26, code: "TP-ENG", name: "English Tutoring - 4 Sessions", price: 500, type: "Regular", maxPurchases: 10, meetings: 4, inUse: true },
  { id: 27, code: "TP-AP", name: "AP Subject Tutoring - 4 Sessions", price: 650, type: "Regular", maxPurchases: 10, meetings: 4, inUse: true },
  { id: 28, code: "MI-1", name: "Mock Interview - Single", price: 200, type: "Regular", maxPurchases: 5, meetings: 1, inUse: true },
  { id: 29, code: "MI-3", name: "Mock Interview - 3 Pack", price: 525, type: "Regular", maxPurchases: 3, meetings: 3, inUse: true },
  { id: 30, code: "AR-1", name: "Application Review - Single School", price: 350, type: "Regular", maxPurchases: 15, meetings: 1, inUse: true },
  { id: 31, code: "AR-5", name: "Application Review - 5 Schools", price: 1500, type: "Regular", maxPurchases: 3, meetings: 5, inUse: true },
  { id: 32, code: "AR-10", name: "Application Review - 10 Schools", price: 2750, type: "Regular", maxPurchases: 2, meetings: 10, inUse: true },
  { id: 33, code: "FA-CONSULT", name: "Financial Aid Consultation", price: 300, type: "Regular", maxPurchases: 3, meetings: 1, inUse: true },
  { id: 34, code: "FA-FAFSA", name: "FAFSA Filing Assistance", price: 150, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 35, code: "FA-CSS", name: "CSS Profile Assistance", price: 200, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 36, code: "FA-SCHOL", name: "Scholarship Search & Strategy", price: 500, type: "Regular", maxPurchases: 1, meetings: 2, inUse: true },
  { id: 37, code: "WS-CL", name: "Workshop - College List Building", price: 175, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 38, code: "WS-RES", name: "Workshop - Resume Building", price: 175, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 39, code: "WS-ACT", name: "Workshop - Activities List", price: 175, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 40, code: "WS-INT", name: "Workshop - Interview Prep", price: 175, type: "Regular", maxPurchases: 2, meetings: 1, inUse: true },
  { id: 41, code: "LOR-1", name: "Letter of Rec Coordination", price: 150, type: "Regular", maxPurchases: 10, meetings: 0, inUse: true },
  { id: 42, code: "CC-HOURLY", name: "Counseling - Hourly Add-On", price: 350, type: "Regular", maxPurchases: 20, meetings: 1, inUse: true },
  { id: 43, code: "TP-PSAT", name: "PSAT Prep - Short Course", price: 450, type: "Regular", maxPurchases: 2, meetings: 4, inUse: false },
  { id: 44, code: "CC-TRANS", name: "Transfer Student Counseling", price: 2800, type: "Regular", maxPurchases: 1, meetings: 8, inUse: false },
  { id: 45, code: "EC-GRAD", name: "Graduate School Essay Review", price: 550, type: "Regular", maxPurchases: 5, meetings: 2, inUse: false },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SAMPLE_SERVICES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "code": va = a.code; vb = b.code; break;
      case "name": va = a.name; vb = b.name; break;
      case "price": va = a.price; vb = b.price; break;
      case "type": va = a.type; vb = b.type; break;
      case "maxPurchases": va = a.maxPurchases; vb = b.maxPurchases; break;
      case "meetings": va = a.meetings; vb = b.meetings; break;
      case "inUse": va = a.inUse ? 1 : 0; vb = b.inUse ? 1 : 0; break;
      default: va = a.name; vb = b.name;
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const formatPrice = (cents) => `$${cents.toLocaleString("en-US")}`;

  const SortHeader = ({ col, label }) => (
    <th className="text-left px-4 py-3 text-xs font-semibold cursor-pointer select-none hover:bg-gray-50" style={{ color: "#281d51" }} onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
      </div>
    </th>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg text-sm w-80"
            style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
          />
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of 236 services</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD SERVICE</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="code" label="Code" />
              <SortHeader col="name" label="Name" />
              <SortHeader col="price" label="Price" />
              <SortHeader col="type" label="Type" />
              <SortHeader col="maxPurchases" label="Max Purchases" />
              <SortHeader col="meetings" label="# of Meetings" />
              <SortHeader col="inUse" label="In Use" />
              <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: "#281d51" }} colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(s => (
              <tr key={s.id} onClick={() => {}} className="hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderBottom: "1px solid #f0edf5" }}>
                <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: "#55478f" }}>{s.code}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{s.name}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#474747" }}>{formatPrice(s.price)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>
                  <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: "#f0edf5", color: "#8e7bb7" }}>{s.type}</span>
                </td>
                <td className="px-4 py-3 text-sm text-center" style={{ color: "#474747" }}>{s.maxPurchases}</td>
                <td className="px-4 py-3 text-sm text-center" style={{ color: "#474747" }}>{s.meetings === 0 ? "N/A" : s.meetings}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{
                    backgroundColor: s.inUse ? "#e0f5f0" : "#fef2f2",
                    color: s.inUse ? "#42778c" : "#ff3467"
                  }}>
                    {s.inUse ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="text-xs px-2 py-1 rounded hover:opacity-80" onClick={e => e.stopPropagation()} style={{ color: "#55478f" }} title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="text-xs px-2 py-1 rounded hover:opacity-80" onClick={e => e.stopPropagation()} style={{ color: "#ff3467" }} title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "#b2b2b2" }}>Per page:</span>
            {[10, 25, 50].map(n => (
              <button
                key={n}
                onClick={() => { setPerPage(n); setPage(1); }}
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: perPage === n ? "#55478f" : "#e5e0f0",
                  color: perPage === n ? "#ffffff" : "#55478f"
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Prev</button>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Next</button>
        </div>
      </div>
    </div>
  );
}
