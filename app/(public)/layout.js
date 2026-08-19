import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-sand-900 text-sand-400 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm">
          <p className="text-sand-300 font-medium mb-1">זיכרון בחול</p>
          <p>פרויקט הנצחה לחללי ישראל — פסלים עשויים חול, לב ואהבה</p>
          <p className="mt-4 text-sand-600 text-xs">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </>
  );
}
