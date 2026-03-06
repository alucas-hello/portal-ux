import { useState, useMemo } from "react";

const STAFF = ["Alex Morgan", "Allison Dahleen", "Amanda Yoder", "Don Keller", "Raymond Gonzales"];

const STUDENTS = [
  "Aiden Patel", "Brianna Chen", "Carlos Rivera", "Destiny Williams",
  "Ethan Nakamura", "Fatima Al-Hassan", "Grace Kim", "Henry Okafor",
  "Isabella Torres", "Jayden Brooks",
];

const SERVICE_CATALOG = [
  // Counseling
  { category: "Counseling", name: "College Counseling — Full Package", price: 3500 },
  { category: "Counseling", name: "College Counseling — Essentials", price: 2200 },
  { category: "Counseling", name: "College List Development", price: 600 },
  { category: "Counseling", name: "Application Strategy Session", price: 350 },
  { category: "Counseling", name: "Financial Aid & Scholarship Advising", price: 450 },
  // Essay Coaching
  { category: "Essay Coaching", name: "Personal Statement Coaching (5 sessions)", price: 1200 },
  { category: "Essay Coaching", name: "Supplemental Essay Package (up to 8)", price: 900 },
  { category: "Essay Coaching", name: "Single Essay Review", price: 175 },
  { category: "Essay Coaching", name: "Scholarship Essay Coaching", price: 400 },
  // Test Prep
  { category: "Test Prep", name: "SAT Prep — 10 Sessions", price: 1800 },
  { category: "Test Prep", name: "SAT Prep — 5 Sessions", price: 950 },
  { category: "Test Prep", name: "ACT Prep — 10 Sessions", price: 1800 },
  { category: "Test Prep", name: "ACT Prep — 5 Sessions", price: 950 },
  { category: "Test Prep", name: "SAT/ACT Diagnostic Assessment", price: 150 },
  // Add-Ons
  { category: "Add-Ons", name: "Interview Prep (2 sessions)", price: 350 },
  { category: "Add-Ons", name: "Resume & Activities List Review", price: 200 },
  { category: "Add-Ons", name: "Letter of Rec Strategy Session", price: 150 },
  { category: "Add-Ons", name: "College Visit Planning", price: 250 },
];

const PAYMENT_TERMS = [
  { label: "1-time payment", months: 1 },
  { label: "2 months", months: 2 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "10 months", months: 10 },
  { label: "12 months", months: 12 },
];

const CATEGORY_ICONS = {
  Counseling: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 12.083V21l-9-5-9 5v-8.917c0-2.485.768-4.795 2.084-6.7L12 14z",
  "Essay Coaching": "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  "Test Prep": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "Add-Ons": "M12 6v6m0 0v6m0-6h6m-6 0H6",
};

function formatCurrency(cents) {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductOrderPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [orderDate, setOrderDate] = useState(today);
  const [salesPerson, setSalesPerson] = useState(STAFF[0]);
  const [student, setStudent] = useState("");
  const [quantities, setQuantities] = useState(() => Object.fromEntries(SERVICE_CATALOG.map((_, i) => [i, 0])));
  const [discountInput, setDiscountInput] = useState("0");
  const [paymentTerms, setPaymentTerms] = useState(1);

  const setQty = (idx, delta) => {
    setQuantities((prev) => ({ ...prev, [idx]: Math.max(0, (prev[idx] || 0) + delta) }));
  };

  const subtotal = useMemo(
    () => SERVICE_CATALOG.reduce((sum, svc, i) => sum + svc.price * 100 * (quantities[i] || 0), 0),
    [quantities]
  );

  const discountAmount = useMemo(() => {
    const val = parseFloat(discountInput) || 0;
    return Math.round(val * 100);
  }, [discountInput]);

  const total = Math.max(0, subtotal - discountAmount);
  const monthlyAmount = paymentTerms > 0 ? Math.ceil(total / paymentTerms) : total;
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const categories = [...new Set(SERVICE_CATALOG.map((s) => s.category))];

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#281d51" }}>Product Order</h1>
      <p className="text-sm mb-6" style={{ color: "#b2b2b2" }}>Create a new service order for a student.</p>

      {/* Order Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#b2b2b2" }}>Student</label>
            <select
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#c0bad4", color: student ? "#474747" : "#b2b2b2", focusRingColor: "#55478f" }}
            >
              <option value="" disabled>Select a student...</option>
              {STUDENTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#b2b2b2" }}>Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#c0bad4", color: "#474747" }}
            />
          </div>

          {/* Sales Person */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#b2b2b2" }}>Sales Person</label>
            <select
              value={salesPerson}
              onChange={(e) => setSalesPerson(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#c0bad4", color: "#474747" }}
            >
              {STAFF.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Service Line Items — grouped by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#e5e0f0" }}>
              <svg className="w-4 h-4" fill="none" stroke="#55478f" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d={CATEGORY_ICONS[cat]} />
              </svg>
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#281d51" }}>{cat}</h2>
          </div>

          <div className="space-y-2">
            {SERVICE_CATALOG.map((svc, idx) => {
              if (svc.category !== cat) return null;
              const qty = quantities[idx] || 0;
              const lineTotal = svc.price * qty;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm px-5 py-3 flex items-center justify-between transition-all"
                  style={{ borderLeft: qty > 0 ? "3px solid #00e6c3" : "3px solid transparent" }}
                >
                  {/* Service info */}
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium truncate" style={{ color: "#474747" }}>{svc.name}</p>
                    <p className="text-xs" style={{ color: "#b2b2b2" }}>${svc.price.toLocaleString()} per unit</p>
                  </div>

                  {/* Quantity spinner */}
                  <div className="flex items-center gap-1 mr-6">
                    <button
                      onClick={() => setQty(idx, -1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold transition-colors"
                      style={{
                        backgroundColor: qty === 0 ? "#f3f4f6" : "#e5e0f0",
                        color: qty === 0 ? "#c0bad4" : "#55478f",
                        cursor: qty === 0 ? "default" : "pointer",
                      }}
                    >
                      -
                    </button>
                    <span
                      className="w-8 text-center text-sm font-semibold"
                      style={{ color: qty > 0 ? "#281d51" : "#b2b2b2" }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(idx, 1)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold transition-colors hover:opacity-80"
                      style={{ backgroundColor: "#e5e0f0", color: "#55478f", cursor: "pointer" }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line subtotal */}
                  <div className="w-24 text-right">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: qty > 0 ? "#281d51" : "#c0bad4" }}
                    >
                      {qty > 0 ? "$" + lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "--"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Order Summary Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#281d51" }}>Order Summary</h2>

        {/* Items in cart */}
        {itemCount === 0 ? (
          <p className="text-sm italic mb-4" style={{ color: "#b2b2b2" }}>No services selected. Use the + buttons above to add items.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {SERVICE_CATALOG.map((svc, idx) => {
              const qty = quantities[idx] || 0;
              if (qty === 0) return null;
              return (
                <div key={idx} className="flex justify-between text-sm" style={{ color: "#474747" }}>
                  <span>{svc.name} <span style={{ color: "#b2b2b2" }}>x{qty}</span></span>
                  <span className="font-medium">${(svc.price * qty).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-3 space-y-2" style={{ borderColor: "#e5e0f0" }}>
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span style={{ color: "#b2b2b2" }}>Subtotal</span>
            <span className="font-semibold" style={{ color: "#474747" }}>{formatCurrency(subtotal)}</span>
          </div>

          {/* Discount */}
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: "#b2b2b2" }}>Discount</span>
            <div className="flex items-center gap-1">
              <span style={{ color: "#b2b2b2" }}>$</span>
              <input
                type="text"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-24 border rounded-md px-2 py-1 text-sm text-right focus:outline-none focus:ring-2"
                style={{ borderColor: "#c0bad4", color: "#474747" }}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: "#e5e0f0" }}>
            <span className="font-bold" style={{ color: "#281d51" }}>Total</span>
            <span className="font-bold" style={{ color: "#281d51" }}>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: "#e5e0f0" }}>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#b2b2b2" }}>Payment Terms</label>
          <div className="flex items-center gap-4">
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#c0bad4", color: "#474747" }}
            >
              {PAYMENT_TERMS.map((pt) => (
                <option key={pt.months} value={pt.months}>{pt.label}</option>
              ))}
            </select>
            {total > 0 && paymentTerms > 1 && (
              <span className="text-sm" style={{ color: "#42778c" }}>
                {formatCurrency(monthlyAmount)}/mo <span style={{ color: "#b2b2b2" }}>x {paymentTerms} months</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end">
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
          style={{ borderColor: "#c0bad4", color: "#474747" }}
        >
          CANCEL
        </button>
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: itemCount > 0 && student ? "#55478f" : "#c0bad4", cursor: itemCount > 0 && student ? "pointer" : "default" }}
          disabled={itemCount === 0 || !student}
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}
