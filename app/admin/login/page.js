"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { validateCredentials, setAuthCookie } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    if (validateCredentials(username, password)) {
      setAuthCookie();
      router.push("/admin/dashboard");
    } else {
      setError("שם משתמש או סיסמה שגויים");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sand-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-sand-100">זיכרון בחול</h1>
          <p className="text-sand-400 text-sm mt-1">ממשק ניהול</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sand-800 rounded-2xl p-8 border border-sand-700 shadow-2xl space-y-5"
        >
          <h2 className="text-sand-100 font-semibold text-lg text-center mb-6">
            כניסה למערכת
          </h2>

          {error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sand-300 text-xs font-semibold mb-1.5">
              שם משתמש
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-sand-500"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-sand-700 border border-sand-600 text-sand-100 placeholder:text-sand-500 rounded-xl px-4 py-3 pe-9 text-sm focus:outline-none focus:ring-2 focus:ring-sand-400 transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sand-300 text-xs font-semibold mb-1.5">
              סיסמה
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-sand-500 hover:text-sand-300 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-sand-700 border border-sand-600 text-sand-100 placeholder:text-sand-500 rounded-xl px-4 py-3 pe-9 text-sm focus:outline-none focus:ring-2 focus:ring-sand-400 transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sand-500 hover:bg-sand-400 disabled:bg-sand-600 text-sand-50 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 text-sm mt-2"
          >
            {loading ? (
              "מתחבר..."
            ) : (
              <>
                <Lock size={14} />
                כניסה
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sand-600 text-xs mt-6">גישה מורשית בלבד</p>
      </div>
    </div>
  );
}
