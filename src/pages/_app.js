import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
