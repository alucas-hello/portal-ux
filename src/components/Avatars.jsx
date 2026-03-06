import { getStaffPhoto, photoToName } from "../utils/staff";

export const TeamAvatar = ({ name, role, size = 32, color = "#8e7bb7", style = {} }) => {
  const photo = getStaffPhoto(name, role ? role.toLowerCase() : undefined);
  const displayName = photo ? photoToName(photo) : name;
  const initials = name.split(" ").map(n => n[0]).join("");
  return (
    <div className="relative group" style={{ flexShrink: 0 }}>
      <div className="rounded-full flex items-center justify-center text-white font-bold cursor-default overflow-hidden transition-opacity hover:opacity-80" style={{ width: size, height: size, backgroundColor: color, ...style }}>
        {photo ? (
          <img src={`${import.meta.env.BASE_URL}${photo}`} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <span style={{ fontSize: size * 0.35 }}>{initials}</span>
        )}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50" style={{ backgroundColor: "#281d51", color: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        {displayName}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #281d51" }} />
      </div>
    </div>
  );
};

export const StudentAvatar = ({ student, size = 44, style = {} }) => {
  const initials = `${student.firstName[0]}${student.lastName[0]}`;
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold overflow-hidden" style={{ width: size, height: size, backgroundColor: "#8e7bb7", flexShrink: 0, fontSize: size * 0.35, ...style }}>
      {student.photo ? (
        <img src={`${import.meta.env.BASE_URL}${student.photo}`} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
      ) : initials}
    </div>
  );
};
