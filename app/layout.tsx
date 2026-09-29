import type { Metadata } from "next";
import "./globals.css";
import { SelectionProvider } from "@/lib/selection-context";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ShotVision — Football Shot Analytics",
  description:
    "Visualize historical football shooting and goal-placement data with a 4-zone goal model, player analytics, and shot history.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <SelectionProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
        </SelectionProvider>
      </body>
    </html>
  );
}
