import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Background from "./components/Background";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden">
        <Background />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
