import "./globals.css";
import Providers from "./providers";
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
      <body className="min-h-screen text-white overflow-x-hidden">
        <Providers>
          <Background />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 px-6 py-10 max-w-6xl mx-auto">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
