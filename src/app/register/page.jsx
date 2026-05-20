"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", photo: "", password: "" });
  const [error, setError] = useState("");

  // Unified production backend URL fallback
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mediqueue-server-zeta.vercel.app";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, photo, password } = formData;

    // Password Validation Rules
    if (password.length < 6) {
      setError("Password length must be at least 6 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one Uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one Lowercase letter.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name, email, photo, password
      });

      // -------------------------------------------------------------------------
      // CRITICAL UPDATE: Capture the session token and log the user in instantly!
      // -------------------------------------------------------------------------
      if (response.data.success && response.data.token) {
        // 1. Store token and profile data cleanly into local storage
        localStorage.setItem("mq-token", response.data.token);
        localStorage.setItem("mq-user", JSON.stringify(response.data.user));

        // 2. Dispatch data to your global auth state context hook instantly
        setUser(response.data.user);

        toast.success(`Welcome to MediQueue, ${response.data.user.name}! 🎉 Account created successfully.`);
        
        // 3. Route directly to the home screen instead of the login form
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration workflow blocked.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: "1048318158494-2e05bvoemigkrifka2g42dvpcgcupf9h.apps.googleusercontent.com", // Corrected Console Client ID
        callback: async (googleResponse) => {
          const idToken = googleResponse.credential; 
          
          // Parse Google account JWT profile payload
          const base64Url = idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decodedPayload = JSON.parse(window.atob(base64));

          const activeUser = {
            email: decodedPayload.email,
            name: decodedPayload.name,
            photo: decodedPayload.picture
          };

          // Auto-register inside MongoDB Atlas if account doesn't exist yet
          await axios.post(`${API_BASE_URL}/register`, {
            name: activeUser.name,
            email: activeUser.email,
            photo: activeUser.photo,
            password: "GOOGLE_OAUTH_SECURE_SESSION" 
          });

          // Grab secure token from backend
          const response = await axios.post(`${API_BASE_URL}/jwt`, { email: activeUser.email });
          
          if (response.data.token) {
            localStorage.setItem("mq-token", response.data.token);
            localStorage.setItem("mq-user", JSON.stringify(activeUser));
            setUser(activeUser);
            
            toast.success(`Success! Registered and logged in as ${activeUser.name} 🎉`);
            router.push("/");
          }
        }
      });

      window.google.accounts.id.prompt();
      
    } catch (err) {
      console.error("Google Handshake error:", err);
      toast.error("Google authentication link broken on runtime pipelines.");
    }
  };

  return (
    <div className="hero min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
        <div className="card-body p-8 gap-4">
          <h2 className="text-3xl font-black text-center text-primary tracking-tight">Create Account</h2>
          
          {error && (
            <div className="alert alert-error text-xs font-semibold py-2 px-3 rounded-xl">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label-text font-bold mb-1">Name</label>
              <input type="text" name="name" value={formData.name} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="Your Name" />
            </div>
            <div className="form-control">
              <label className="label-text font-bold mb-1">Email</label>
              <input type="email" name="email" value={formData.email} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="name@example.com" />
            </div>
            <div className="form-control">
              <label className="label-text font-bold mb-1">Photo-URL</label>
              <input type="url" name="photo" value={formData.photo} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="https://image-link.png" />
            </div>
            <div className="form-control">
              <label className="label-text font-bold mb-1">Password</label>
              <input type="password" name="password" value={formData.password} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full rounded-xl font-bold">Register</button>
          </form>

          <div className="divider text-xs text-base-content/40 uppercase tracking-widest my-1">OR</div>

          <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="btn btn-outline border-base-300 hover:bg-neutral hover:text-neutral-content w-full rounded-xl font-bold gap-3"
          >
            <FaGoogle className="text-error" /> Continue with Google
          </button>
          
          <p className="text-center text-sm font-medium text-base-content/70 mt-2">
            Already have an account? <Link href="/login" className="link link-primary font-bold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}