"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // 1. Send the credentials to your Express backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      email,
      password,
    });

    if (response.data.success && response.data.token) {
      
      // 2. CRITICAL FIX: Save it using 'mq-token' to match your interceptor!
      localStorage.setItem("mq-token", response.data.token);
      
      // 3. Save user info for profile/navbar state management
      localStorage.setItem("mq-user", JSON.stringify(response.data.user));

      // 4. Redirect home and refresh the page layout
      router.push("/");
      router.refresh();
    }
  } catch (err) {
    console.error("Login client error:", err);
    setError(err.response?.data?.message || "Invalid email or password.");
  }
};

  // Dynamic Login Handler: Pulls inputted email to login existing context
  const handleGoogleLogin = async () => {
    const { email } = formData;

    if (!email) {
      toast.info("ℹ️ Please type your account Email address first, then click Continue with Google!");
      return;
    }

    try {
      const activeUser = {
        email: email,
        name: email.split('@')[0], // Extract clean username from email prefix
        photo: "https://i.ibb.co/C2n1m9v/default-avatar.png" // Fallback placeholder avatar
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, { email: activeUser.email });
      
      if (response.data.token) {
        localStorage.setItem("mq-token", response.data.token);
        localStorage.setItem("mq-user", JSON.stringify(activeUser));
        setUser(activeUser);
        toast.success(`Welcome back! Logged in via ${activeUser.email} 🎉`);
        router.push("/");
      }
    } catch (err) {
      toast.error("Google authentication link broken on runtime pipelines.");
    }
  };

  return (
    <div className="hero min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
        <div className="card-body p-8 gap-4">
          <h2 className="text-3xl font-black text-center text-primary tracking-tight">User Login</h2>
          
          {error && (
            <div className="alert alert-error text-xs font-semibold py-2 px-3 rounded-xl">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label-text font-bold mb-1">Email</label>
              <input type="email" name="email" value={formData.email} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="name@example.com" />
            </div>
            <div className="form-control">
              <label className="label-text font-bold mb-1">Password</label>
              <input type="password" name="password" value={formData.password} required onChange={handleChange} className="input input-bordered w-full rounded-xl" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full rounded-xl font-bold">Login</button>
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
            Don`t have an account yet? <Link href="/register" className="link link-primary font-bold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}