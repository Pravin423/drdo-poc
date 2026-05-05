import React, { useEffect } from "react";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = `${poppins.className} antialiased`;
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
