import { cn } from "@/lib/utils";
import "./globals.css";

import { Inconsolata } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inconsolata = Inconsolata({
  subsets: ["latin"],
});

let title = "Change Detector";
let description =
  "Change Detector is a tool to monitor changes in any website using natural language. It will notify you when a change is detected.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://change-detector.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* add background image from a url */}
      <body className={cn(inconsolata.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
