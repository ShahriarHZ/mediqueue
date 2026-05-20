"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { BsBookFill } from "react-icons/bs";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  // Sync theme status with localStorage and HTML properties base
  useEffect(() => {
    const savedTheme = localStorage.getItem("mq-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("mq-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const isActive = (path) => pathname === path ? "text-primary font-bold bg-base-200" : "";

  // Dynamic Navigation menu options links map
  const navLinks = (
    <>
      <li><Link href="/" className={isActive("/")}>Home</Link></li>
      <li><Link href="/tutors" className={isActive("/tutors")}>Tutors</Link></li>
      {user && (
        <>
          <li><Link href="/add-tutor" className={isActive("/add-tutor")}>Add Tutor</Link></li>
          <li><Link href="/my-tutors" className={isActive("/my-tutors")}>My Tutors</Link></li>
          <li><Link href="/my-bookings" className={isActive("/my-bookings")}>My Booked Sessions</Link></li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-12 sticky top-0 z-50 transition-colors duration-300">
      
      {/* Navbar Start: Logo & Mobile Hamburger */}
      <div className="navbar-start flex items-center">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden mr-2">
            <FaBars className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-1">
            {navLinks}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <BsBookFill className="text-3xl text-primary animate-pulse" />
          <Link href="/" className="text-2xl font-black tracking-tight text-primary">
            Medi<span className="text-secondary">Queue</span>
          </Link>
        </div>
      </div>

      {/* Navbar Center: Desktop Navigation Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          {navLinks}
        </ul>
      </div>

      {/* Navbar End: Control Toggles & User Menus */}
      <div className="navbar-end gap-3">
        {/* Light/Dark Toggle */}
        <button 
          onClick={toggleTheme} 
          className="btn btn-ghost btn-circle text-xl"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FaMoon className="text-neutral" /> : <FaSun className="text-warning" />}
        </button>

      {user ? (
          <div className="dropdown dropdown-end">
            {/* Minimalist Profile Button Circle Wrapper */}
            <label 
              tabIndex={0} 
              className="btn btn-ghost btn-circle avatar bg-base-200 text-neutral-content font-bold border border-base-300 hover:bg-base-300 transition-colors"
            >
              {user?.photo ? (
                <div className="w-10 rounded-full">
                  <img src={user.photo} alt="User Profile" />
                </div>
              ) : (
                /* Fallback clean text avatar character if no photo url provided */
                <span className="text-base uppercase text-neutral">
                  {user?.name ? user.name.charAt(0) : "U"}
                </span>
              )}
            </label>

            {/* Premium, High-Contrast Custom Dropdown Box matching your reference image */}
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-2 z-[50] p-2 shadow-xl bg-base-100 rounded-xl w-64 border border-base-200 gap-1 text-base-content"
            >
              {/* Profile Header Details block section */}
              <div className="px-3 py-2.5 flex flex-col border-b border-base-100 mb-1">
                <p className="font-bold text-sm text-base-content tracking-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-xs font-medium text-base-content/50 truncate mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              {/* Navigation Options list mappings with clean structural layout padding gaps */}
              <li>
                <Link href="/my-bookings" className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-base-200 transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-base-content/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span>My Bookings</span>
                </Link>
              </li>

              <li>
                <Link href="/my-tutors" className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-base-200 transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-base-content/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z" />
                  </svg>
                  <span>My Tutors</span>
                </Link>
              </li>

              {/* Separator line layout break block */}
              <div className="border-t border-base-100 my-1"></div>

              <li>
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-error hover:bg-error/10 active:bg-error/20 transition-colors font-medium w-full text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm font-bold">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm font-bold px-4 rounded-xl">
              Register
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}