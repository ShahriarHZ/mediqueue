'use client';
import React, { useContext, useEffect } from 'react';
import axiosSecure from '@/utils/axiosSecure'; // Adjust path if necessary
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // ✅ FIXED: Switched from 'react-hot-toast' to match your layout container
import Link from 'next/link';
import Script from 'next/script'; // ✅ Import Script to safely load the external API script file

export default function RegisterPage() {
    const { setUser } = useContext(AuthContext);
    const router = useRouter();

    // ✅ Move initialization into a stable function that safely checks if script loaded
    const initGoogleSignIn = () => {
        if (typeof window !== 'undefined' && window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: "794201743108-50ba4tq8devhqn9evj34lnim6spqvrkk.apps.googleusercontent.com",
                use_fedcm: false,
                callback: handleGoogleResponse
            });
        }
    };

    // Initialize Google Login on component mount
    useEffect(() => {
        // If script is already loaded dynamically, initialize right away
        if (window.google?.accounts?.id) {
            initGoogleSignIn();
        }
    }, []);

    // Handle Google sign-in response
    const handleGoogleResponse = async (googleResponse) => {
        try {
            const idToken = googleResponse.credential;
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            const decoded = JSON.parse(jsonPayload);

            const activeUser = {
                name: decoded.name,
                email: decoded.email,
                photo: decoded.picture
            };

            // Sync user data to local MySQL backend
            try {
                await axiosSecure.post('/register', {
                    name: activeUser.name,
                    email: activeUser.email,
                    photo: activeUser.photo,
                    password: "GOOGLE_OAUTH_SECURE_SESSION"
                });
            } catch (err) {
                console.log("Account sync: User already registered in MySQL.");
            }

            // Request JWT session token from local server
            const jwtRes = await axiosSecure.post('/jwt', { email: activeUser.email });
            if (jwtRes.data.token) {
                localStorage.setItem("mq-token", jwtRes.data.token);
                localStorage.setItem("mq-user", JSON.stringify(activeUser));
                setUser(activeUser);
                toast.success(`Welcome, ${activeUser.name}! 🎉`);
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error("Google authentication error:", err);
            toast.error("Google sync handshake failed.");
        }
    };

    const triggerGooglePrompt = () => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
        } else {
            toast.error("Google authentication script is still initializing.");
        }
    };

    // Handle standard Email/Password form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const photo = form.photo?.value || "";

        try {
            const res = await axiosSecure.post('/register', { name, email, photo, password });
            if (res.data.success) {
                const activeUser = res.data.user;
                localStorage.setItem("mq-token", res.data.token);
                localStorage.setItem("mq-user", JSON.stringify(activeUser));
                setUser(activeUser);
                toast.success("Account successfully created in MySQL database! 🎉");
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 py-12 px-4">
            {/* ✅ Load the Google client library safely for the standard Popup window pipeline */}
            <Script 
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={initGoogleSignIn}
            />

            <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-neutral/10">
                <div className="card-body p-8 sm:p-10">
                    
                    {/* Header Section */}
                    <div className="text-center space-y-2 mb-6">
                        <h2 className="text-3xl font-black tracking-tight text-base-content">Create Account</h2>
                        <p className="text-sm font-medium text-base-content/60">Join our portal system workspace today</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label py-1.5">
                                <span className="label-text font-bold text-base-content/80">Full Name</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:outline-primary bg-base-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-40 shrink-0"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/></svg>
                                <input type="text" name="name" placeholder="John Doe" className="w-full text-sm" required />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label py-1.5">
                                <span className="label-text font-bold text-base-content/80">Email Address</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:outline-primary bg-base-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-40 shrink-0"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5 A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input type="email" name="email" placeholder="name@example.com" className="w-full text-sm" required />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label py-1.5">
                                <span className="label-text font-bold text-base-content/80">Photo URL <span className="text-xs opacity-50 font-normal">(Optional)</span></span>
                            </label>
                            <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:outline-primary bg-base-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-40 shrink-0"><path d="M11.5 1a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h9zM3 12h8V2H3v10z"/><path d="M6.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
                                <input type="url" name="photo" placeholder="https://example.com/avatar.jpg" className="w-full text-sm" />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label py-1.5">
                                <span className="label-text font-bold text-base-content/80">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:outline-primary bg-base-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-40 shrink-0"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input type="password" name="password" placeholder="••••••••" className="w-full text-sm" required />
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-xl font-bold text-sm shadow-md shadow-primary/20 mt-4 normal-case tracking-wide">
                            Sign Up
                        </button>
                    </form>

                    {/* Divider Separator */}
                    <div className="divider text-xs font-bold uppercase text-base-content/30 tracking-widest my-6">OR</div>

                    {/* ✅ Custom Structured Google Authentication Button Layout */}
                    <button 
                        onClick={triggerGooglePrompt} 
                        type="button"
                        className="btn btn-outline w-full rounded-xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide normal-case border-base-300 bg-base-100 hover:bg-base-200 hover:border-base-400 text-base-content transition-all duration-200"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Footer Login Link Context */}
                    <p className="text-center text-sm font-medium text-base-content/60 mt-8 border-t border-base-200/60 pt-5">
                        Already have an account?{' '}
                        <Link href="/login" className="link link-primary no-underline hover:underline font-bold tracking-tight pl-1">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}