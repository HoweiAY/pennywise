import ReactQueryClientProvider from "@/components/providers/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { poppins } from "@/ui/fonts/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PennyWise - A smarter way to manage your finance",
  description:
    "Get started with PennyWise to enjoy a better finance management and budgeting experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
