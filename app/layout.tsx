import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CSPostHogProvider } from './providers'

export const metadata = {
  title: "Tunerkit AI",
  description: "The fastest way to build finetuned AI agents",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className="min-h-screen flex flex-col">
          <section>
            <Suspense
              fallback={
                <div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between h-[69px]" />
              }
            >
              <Navbar />
            </Suspense>
          </section>
          <main className="flex flex-1 flex-col items-center">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
