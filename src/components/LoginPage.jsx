import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen w-screen">

      {/* ── Left panel — brand ── */}
      <div className="hidden md:flex flex-col justify-between w-2/5 p-12" style={{ backgroundColor: "#281d51" }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center font-bold flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#55478f", color: "#ffffff", fontSize: 15, fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.5px" }}>HC</div>
          <span className="font-bold text-xl tracking-tight" style={{ color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>
        </div>

        {/* Center copy */}
        <div>
          <p className="text-5xl font-extrabold leading-tight mb-6" style={{ color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>
            Every student<br />
            deserves a<br />
            <span style={{ color: "#ff3467" }}>great future.</span>
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#8e7bb7", fontFamily: "Montserrat, sans-serif" }}>
            The HelloCollege employee portal helps your team guide students from first session to final enrollment — all in one place.
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-xs font-semibold tracking-widest" style={{ color: "#55478f", fontFamily: "Montserrat, sans-serif" }}>
          EMPLOYEE PORTAL · BETA
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ backgroundColor: "#f8f7fc" }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 md:hidden">
            <div className="flex items-center justify-center font-bold" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#281d51", color: "#ffffff", fontSize: 13, fontFamily: "Montserrat, sans-serif" }}>HC</div>
            <span className="font-bold text-lg" style={{ color: "#281d51", fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>
          </div>

          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#281d51", fontFamily: "Montserrat, sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "#b2b2b2", fontFamily: "Montserrat, sans-serif" }}>
            Sign in to your HelloCollege account
          </p>

          {/* Google button */}
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md active:scale-[0.99]"
            style={{ backgroundColor: "#ffffff", color: "#474747", border: "1px solid #d1d5db", fontFamily: "Montserrat, sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            {/* Google "G" logo */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e0f0" }} />
            <span className="text-xs font-medium" style={{ color: "#b2b2b2" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e0f0" }} />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#474747", fontFamily: "Montserrat, sans-serif" }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hellocollege.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1px solid #c0bad4", backgroundColor: "#ffffff", color: "#281d51", fontFamily: "Montserrat, sans-serif" }}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#474747", fontFamily: "Montserrat, sans-serif" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1px solid #c0bad4", backgroundColor: "#ffffff", color: "#281d51", fontFamily: "Montserrat, sans-serif" }}
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end mb-6">
            <button className="text-xs font-semibold hover:underline" style={{ color: "#55478f", fontFamily: "Montserrat, sans-serif" }}>
              Forgot password?
            </button>
          </div>

          {/* Sign in */}
          <button
            onClick={onLogin}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ backgroundColor: "#281d51", fontFamily: "Montserrat, sans-serif", boxShadow: "0 2px 8px rgba(40,29,81,0.25)" }}
          >
            Sign In
          </button>

          <p className="text-xs text-center mt-8" style={{ color: "#b2b2b2", fontFamily: "Montserrat, sans-serif" }}>
            Having trouble? Contact{" "}
            <span className="font-semibold" style={{ color: "#55478f" }}>support@hellocollege.com</span>
          </p>
        </div>
      </div>

    </div>
  );
}
