import { useState } from "react";

const SAMPLE_PROGRAMS = [
  { id: 1, name: "Comprehensive Counseling - Junior", inUse: true },
  { id: 2, name: "Comprehensive Counseling - Senior", inUse: true },
  { id: 3, name: "Comprehensive Counseling - Sophomore", inUse: true },
  { id: 4, name: "Comprehensive Counseling - Freshman", inUse: false },
  { id: 5, name: "Essay Coaching - 5 Sessions", inUse: true },
  { id: 6, name: "Essay Coaching - 10 Sessions", inUse: true },
  { id: 7, name: "Essay Coaching - Unlimited", inUse: true },
  { id: 8, name: "Test Prep - ACT Full", inUse: true },
  { id: 9, name: "Test Prep - SAT Full", inUse: true },
  { id: 10, name: "Test Prep - ACT Intensive", inUse: true },
  { id: 11, name: "Test Prep - SAT Intensive", inUse: false },
  { id: 12, name: "Test Prep - PSAT", inUse: false },
  { id: 13, name: "College List Building", inUse: true },
  { id: 14, name: "Financial Aid Strategy", inUse: true },
  { id: 15, name: "Interview Prep", inUse: true },
  { id: 16, name: "Scholarship Search", inUse: true },
  { id: 17, name: "Summer Planning", inUse: true },
  { id: 18, name: "Transfer Counseling", inUse: false },
  { id: 19, name: "Graduate School Counseling", inUse: false },
  { id: 20, name: "Athletic Recruitment Counseling", inUse: true },
  { id: 21, name: "Arts Portfolio Review", inUse: false },
  { id: 22, name: "Early Decision Strategy", inUse: true },
  { id: 23, name: "Application Review - Single School", inUse: true },
  { id: 24, name: "Application Review - 5 Schools", inUse: true },
  { id: 25, name: "Application Review - 10 Schools", inUse: true },
  { id: 26, name: "Parent Consultation Package", inUse: true },
  { id: 27, name: "Junior Year Kickstart", inUse: true },
  { id: 28, name: "Senior Year Sprint", inUse: true },
  { id: 29, name: "Gap Year Planning", inUse: false },
  { id: 30, name: "International Student Counseling", inUse: false },
];

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SAMPLE_PROGRAMS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "name": va = a.name; vb = b.name; break;
      case "inUse": va = a.inUse ? 1 : 0; vb = b.inUse ? 1 : 0; break;
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
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
      </div>
    </th>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search programs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg text-sm w-80" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of {SAMPLE_PROGRAMS.length} programs</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD PROGRAM</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="name" label="Name" />
              <SortHeader col="inUse" label="In Use" />
              <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: "#281d51" }} colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(p => (
              <tr key={p.id} onClick={() => {}} className="hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderBottom: "1px solid #f0edf5" }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{p.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: p.inUse ? "#e0f5f0" : "#f0edf5", color: p.inUse ? "#42778c" : "#8e7bb7" }}>
                    {p.inUse ? "Yes" : "No"}
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
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "#b2b2b2" }}>Show</span>
            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="px-2 py-1 rounded text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm" style={{ color: "#b2b2b2" }}>per page</span>
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
