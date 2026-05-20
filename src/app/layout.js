import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

// Keep your metadata and font configurations here at the top...

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      {/* 1. Everything that renders visible UI MUST live inside the <body> tag */}
      <body className="antialiased bg-base-100 text-base-content flex flex-col min-h-screen">
        
        {/* 2. AuthProvider must wrap the Navbar so the Navbar can read the user context state safely */}
        <AuthProvider>
          
          <Navbar />
          
          <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
            {children}
          </main>
          
          <Footer />
          
          <ToastContainer position="top-right" autoClose={3000} />
          
        </AuthProvider>
        
      </body>
    </html>
  );
}