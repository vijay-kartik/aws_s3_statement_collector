import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Statement Collector',
  description: 'Analyze and manage your credit card statements and subscriptions',
  icons: {
    icon: [
      { url: '/app-logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/app-logo.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/app-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/app-logo.png" />
      </head>
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
