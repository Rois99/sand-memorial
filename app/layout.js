import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "זיכרון בחול",
  description: "פרויקט הנצחה לזכר חללים ונופלים בפסלי חול",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen bg-sand-50 text-sand-900 font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
