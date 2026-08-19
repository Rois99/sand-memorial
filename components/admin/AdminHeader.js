import { LogOut } from "lucide-react";

export default function AdminHeader({ onLogout }) {
  return (
    <header className="bg-sand-900 text-sand-100 px-6 py-4 flex items-center justify-between shadow-md">
      <div>
        <h1 className="font-bold text-lg">ממשק ניהול</h1>
        <p className="text-sand-400 text-xs">זיכרון בחול</p>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-sand-700 hover:bg-sand-600 text-sand-200 text-sm px-4 py-2 rounded-lg transition-colors"
      >
        <LogOut size={14} />
        יציאה
      </button>
    </header>
  );
}
