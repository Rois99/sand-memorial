import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-sand-900 text-sand-100">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide hover:text-sand-300 transition-colors duration-200"
        >
          זיכרון בחול
        </Link>
        <div className="flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-sand-300 transition-colors duration-200"
          >
            בית
          </Link>
          <Link
            href="/artist"
            className="hover:text-sand-300 transition-colors duration-200"
          >
            על האמן
          </Link>
          <Link
            href="/request"
            className="bg-sand-600 hover:bg-sand-500 text-sand-50 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            הגשת בקשה
          </Link>
        </div>
      </div>
    </nav>
  );
}
