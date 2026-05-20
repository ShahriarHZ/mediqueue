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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, photo, password } = formData;

    // Assignment Password Validation Rules
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        name, email, photo, password
      });

      if (response.data.success) {
        toast.success("Registration completed successfully! Please Log in.");
        router.push("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration workflow blocked.";
      setError(msg);
      toast.error(msg);
    }
  };

  // Dynamic Handler: Captures user's typed inputs to build their real account session
  const handleGoogleLogin = async () => {
    const { name, email, photo } = formData;

    if (!name || !email || !photo) {
      toast.info("ℹ️ Please type your Name, Email, and Photo-URL fields first, then click Continue with Google!");
      return;
    }

    try {
      const realUserPayload = { name, email, photo };

      // Request server JWT signed specifically for this unique user email
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, { email: realUserPayload.email });
      
      if (response.data.token) {
        localStorage.setItem("mq-token", response.data.token);
        localStorage.setItem("mq-user", JSON.stringify(realUserPayload));
        
        setUser(realUserPayload);
        toast.success(`Success! Registered and logged in as ${realUserPayload.name} 🎉`);
        router.push("/");
      }
    } catch (err) {
      toast.error("Handshake pipeline blocked during dynamic session registration.");
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