function PlaceholderPage({ title, description }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#e5e0f0" }}>
          <svg className="w-8 h-8" fill="none" stroke="#8e7bb7" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#281d51" }}>{title}</h2>
        <p className="text-sm mb-6" style={{ color: "#b2b2b2", maxWidth: 400, margin: "0 auto" }}>{description}</p>
        <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Coming Soon</span>
      </div>
    </div>
  );
}

export default PlaceholderPage;
