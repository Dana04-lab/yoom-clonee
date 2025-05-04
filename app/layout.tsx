import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner"; // ✅ toast компоненті

import "@stream-io/video-react-sdk/dist/css/styles.css";

import 'react-datepicker/dist/react-datepicker.css'



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkUp",
  description: "Video calling App",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#161925]`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}

