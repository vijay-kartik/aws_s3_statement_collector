import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Elucida',
  description: 'Analyze and manage your credit card statements and subscriptions',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/app-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/app-logo.svg', type: 'image/svg+xml' },
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
        <link rel="icon" href="/app-logo.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/app-logo.svg" color="#1E4E5F" />
        <link rel="apple-touch-icon" href="/app-logo.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Elucida" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1E4E5F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
