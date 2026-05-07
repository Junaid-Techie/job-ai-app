import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import CustomCursor from "./components/CustomCursor";

export const metadata: Metadata = {
  title: "Job AI Matcher | Semantic Job Search",
  description: "AI-powered job matching platform using vector embeddings and semantic similarity to find the perfect job for you.",
  keywords: ["AI Job Search", "Semantic Matching", "Resume Vector", "Job Matcher"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white overflow-x-hidden">
        <Providers>
          <CustomCursor />
          <Background />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
