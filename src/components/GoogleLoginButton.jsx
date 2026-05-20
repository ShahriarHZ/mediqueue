"use client";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function GoogleLoginButton() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const initializeGoogleBtn = () => {
      /* global google */
      if (typeof google !== "undefined") {
        const targetDiv = document.getElementById("googleBtnDiv");
        
        if (targetDiv) {
          // 1. Initialize with your live Client ID
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          // 2. Safely render the official native button
          google.accounts.id.renderButton(targetDiv, {
            theme: "outline",
            size: "large",
            width: "360", // Matches the width of your form inputs perfectly
            text: "continue_with",
          });
        }
      }
    };

    // Giving Next.js 100ms to paint the DOM before Google looks for the container ID
    const timer = setTimeout(initializeGoogleBtn, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const idToken = response.credential;
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      const googleUser = {
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
      };

      // Request a secure session token from your Express backend
      const backendResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, { 
        email: googleUser.email 
      });
      
      if (backendResponse.data.token) {
        localStorage.setItem("mq-token", backendResponse.data.token);
        localStorage.setItem("mq-user", JSON.stringify(googleUser));
        
        setUser(googleUser);
        toast.success(`Welcome to MediQueue, ${googleUser.name}! 🎉`);
        router.push("/");
      }
    } catch (err) {
      toast.error("Google authentication link handshake failed.");
    }
  };

  return (
    <div className="w-full flex justify-center my-2">
      {/* Target container for Google script injection */}
      <div id="googleBtnDiv" className="min-h-[44px]"></div>
    </div>
  );
}