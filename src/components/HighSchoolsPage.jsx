import { useState } from "react";

const SAMPLE_HIGH_SCHOOLS = [
  { id: 1, name: "Lincoln High School", kind: "Public", country: "US", state: "CA", group: true, totalStudents: 12 },
  { id: 2, name: "Westview Academy", kind: "Public", country: "US", state: "FL", group: true, totalStudents: 8 },
  { id: 3, name: "North Ridge Prep", kind: "Public", country: "US", state: "NY", group: false, totalStudents: 5 },
  { id: 4, name: "Eastlake High School", kind: "Public", country: "US", state: "WA", group: true, totalStudents: 15 },
  { id: 5, name: "Memorial High School", kind: "Public", country: "US", state: "TX", group: true, totalStudents: 22 },
  { id: 6, name: "Oak Park Academy", kind: "Public", country: "US", state: "IL", group: false, totalStudents: 3 },
  { id: 7, name: "Riverside High School", kind: "Public", country: "US", state: "NJ", group: true, totalStudents: 9 },
  { id: 8, name: "Crestwood Prep", kind: "Public", country: "US", state: "MA", group: false, totalStudents: 4 },
  { id: 9, name: "Mountain View Academy", kind: "Public", country: "US", state: "CO", group: true, totalStudents: 11 },
  { id: 10, name: "Lakewood High School", kind: "Public", country: "US", state: "OH", group: true, totalStudents: 18 },
  { id: 11, name: "Jefferson High School", kind: "Public", country: "US", state: "VA", group: true, totalStudents: 14 },
  { id: 12, name: "St. Anthony's Prep", kind: "Not Available", country: "US", state: "NY", group: false, totalStudents: 6 },
  { id: 13, name: "Heritage Christian Academy", kind: "Not Available", country: "US", state: "GA", group: false, totalStudents: 2 },
  { id: 14, name: "Austin Homeschool Co-op", kind: "Homeschool", country: "US", state: "TX", group: false, totalStudents: 7 },
  { id: 15, name: "Sunshine Homeschool Network", kind: "Homeschool", country: "US", state: "FL", group: false, totalStudents: 4 },
  { id: 16, name: "Central High School", kind: "Public", country: "US", state: "TN", group: true, totalStudents: 20 },
  { id: 17, name: "Greenfield Academy", kind: "Not Available", country: "US", state: "NC", group: false, totalStudents: 3 },
  { id: 18, name: "Pioneer High School", kind: "Public", country: "US", state: "MI", group: true, totalStudents: 16 },
  { id: 19, name: "Pacific Heights Prep", kind: "Public", country: "US", state: "CA", group: false, totalStudents: 5 },
  { id: 20, name: "Valley Forge High School", kind: "Public", country: "US", state: "PA", group: true, totalStudents: 13 },
  { id: 21, name: "Springfield High School", kind: "Public", country: "US", state: "MO", group: true, totalStudents: 10 },
  { id: 22, name: "Brookfield Academy", kind: "Not Available", country: "US", state: "WI", group: false, totalStudents: 4 },
  { id: 23, name: "Desert Ridge High School", kind: "Public", country: "US", state: "AZ", group: true, totalStudents: 19 },
  { id: 24, name: "Harbor View High School", kind: "Public", country: "US", state: "WA", group: false, totalStudents: 7 },
  { id: 25, name: "Ridgemont Prep", kind: "Public", country: "US", state: "CT", group: true, totalStudents: 8 },
  { id: 26, name: "International Academy of Houston", kind: "Not Available", country: "US", state: "TX", group: false, totalStudents: 6 },
  { id: 27, name: "Woodland Hills High School", kind: "Public", country: "US", state: "CA", group: true, totalStudents: 17 },
  { id: 28, name: "Summit Charter School", kind: "Not Available", country: "US", state: "OR", group: false, totalStudents: 5 },
  { id: 29, name: "Peachtree Academy", kind: "Not Available", country: "US", state: "GA", group: false, totalStudents: 3 },
  { id: 30, name: "Midwest Homeschool Alliance", kind: "Homeschool", country: "US", state: "IN", group: false, totalStudents: 9 },
];

export default function HighSchoolsPage() {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SAMPLE_HIGH_SCHOOLS.filter(hs =>
    hs.name.toLowerCase().includes(search.toLowerCase()) || hs.state.toLowerCase().includes(search.toLowerCase()) || hs.kind.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "name": va = a.name; vb = b.name; break;
      case "kind": va = a.kind; vb = b.kind; break;
      case "country": va = a.country; vb = b.country; break;
      case "state": va = a.state; vb = b.state; break;
      case "totalStudents": va = a.totalStudents; vb = b.totalStudents; break;
      default: va = a.name; vb = b.name;
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

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
          <input type="text" placeholder="Search high schools..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 rounded-lg text-sm w-80" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of 975 high schools</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Merge</button>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD HIGH SCHOOL</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="name" label="Name" />
              <SortHeader col="kind" label="Kind" />
              <SortHeader col="country" label="Country" />
              <SortHeader col="state" label="State" />
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Group</th>
              <SortHeader col="totalStudents" label="Total Students" />
              <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: "#281d51" }} colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(hs => (
              <tr key={hs.id} onClick={() => {}} className="hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderBottom: "1px solid #f0edf5" }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{hs.name}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>
                  <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: hs.kind === "Public" ? "#e0f5f0" : hs.kind === "Homeschool" ? "#fff3cd" : "#f0edf5", color: hs.kind === "Public" ? "#42778c" : hs.kind === "Homeschool" ? "#856404" : "#8e7bb7" }}>{hs.kind}</span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{hs.country}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{hs.state}</td>
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" checked={hs.group} readOnly className="rounded" style={{ accentColor: "#55478f" }} />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-center" style={{ color: "#281d51" }}>{hs.totalStudents}</td>
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
    </div>
  );
}
