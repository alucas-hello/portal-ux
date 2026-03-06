// Staff photos — maps employee names to public/ images
export const STAFF_PHOTOS = [
  "allison_dahleen.png", "amanda_yoder.png", "chris_bench.png",
  "don_keller.png", "ian_simon.png", "miracle_husband.png", "raymond_gonzales.png",
];
// Non-fixed photos for random team member assignment
export const OTHER_STAFF_PHOTOS = STAFF_PHOTOS.filter(p => p !== "ian_simon.png" && p !== "chris_bench.png");

// Deterministic photo assignment — every team includes Ian (tutor), Chris (essay coach), + random counselor
export const getStaffPhoto = (name, role) => {
  if (role === "tutor") return "ian_simon.png";
  if (role === "essay coach") return "chris_bench.png";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return OTHER_STAFF_PHOTOS[Math.abs(hash) % OTHER_STAFF_PHOTOS.length];
};

// Convert filename to display name: "allison_dahleen.png" → "Allison Dahleen"
export const photoToName = (filename) => filename.replace(".png", "").split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
