function MetricItem({ label, value, color }) {
  return (
    <span className="text-sm">
      <span className="font-semibold" style={{ color: "#b2b2b2" }}>{label}:&nbsp;</span>
      <span className="max-[640px]:block font-bold" style={{ color: color || "#281d51" }}>{value}</span>
    </span>
  );
}

export default MetricItem;
