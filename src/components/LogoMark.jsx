const LogoMark = ({ expanded }) => (
  <div className="flex items-center" style={{ justifyContent: expanded ? "flex-start" : "center" }}>
    <div className="flex items-center justify-center font-bold flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: "#55478f", color: "#ffffff", fontSize: 13, fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.5px" }}>HC</div>
    {expanded && <span className="ml-3 font-bold text-base tracking-tight" style={{ color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>}
  </div>
);

export default LogoMark;
