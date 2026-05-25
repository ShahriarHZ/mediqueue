'use client';
import React, { useContext, useEffect } from 'react';
import axiosSecure from '@/utils/axiosSecure'; // Adjust path if necessary
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // ✅ FIXED: Switched from 'react-hot-toast' to match your layout container
import Link from 'next/link';
import Script from 'next/script'; // ✅ Import Script to safely load the external API script file

export default function LoginPage() {
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

            // ✅ Automatically render the native Google button inside our placeholder div
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInBtn"),
                { theme: "outline", size: "large", width: "384", shape: "pill" }
            );
        }
    };

    useEffect(() => {
        // If script is already loaded dynamically, initialize right away
        if (window.google?.accounts?.id) {
            initGoogleSignIn();
        }
    }, []);

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

            const jwtRes = await axiosSecure.post('/jwt', { email: activeUser.email });
            if (jwtRes.data.token) {
                localStorage.setItem("mq-token", jwtRes.data.token);
                localStorage.setItem("mq-user", JSON.stringify(activeUser));
                setUser(activeUser);
                toast.success(`Logged in as ${activeUser.name} 🎉`);
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error("Google Login error:", err);
            toast.error("Google login authentication failed.");
        }
    };

    const triggerGooglePrompt = () => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
        } else {
            toast.error("Google authentication script is still initializing.");
        }
    };

    // Handle standard Email/Password Login form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const res = await axiosSecure.post('/login', { email, password });
            if (res.data.success) {
                const activeUser = res.data.user;
                localStorage.setItem("mq-token", res.data.token);
                localStorage.setItem("mq-user", JSON.stringify(activeUser));
                setUser(activeUser);
                toast.success(`Welcome back, ${activeUser.name}!`);
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid credentials.");
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-base-200/50 py-12 px-4">
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
                        <h2 className="text-3xl font-black tracking-tight text-base-content">Welcome Back</h2>
                        <p className="text-sm font-medium text-base-content/60">Please sign in to access your platform account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label py-1.5">
                                <span className="label-text font-bold text-base-content/80">Email Address</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:outline-primary bg-base-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-40 shrink-0"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input type="email" name="email" placeholder="name@example.com" className="w-full text-sm" required />
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
                            Sign In
                        </button>
                    </form>

                    {/* Divider Separator */}
                    <div className="divider text-xs font-bold uppercase text-base-content/30 tracking-widest my-6">OR</div>

                    {/* ✅ Standard unified Google Button Frame Wrapper Node */}
                    <div className="w-full flex justify-center min-h-[46px] items-center">
                        <div id="googleSignInBtn" onClick={triggerGooglePrompt} className="cursor-pointer transition-transform duration-150 active:scale-[0.98]"></div>
                    </div>

                    {/* Footer Register Link Context */}
                    <p className="text-center text-sm font-medium text-base-content/60 mt-8 border-t border-base-200/60 pt-5">
                        Don`t have an account yet?{' '}
                        <Link href="/register" className="link link-primary no-underline hover:underline font-bold tracking-tight pl-1">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}