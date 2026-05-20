"use client";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded-t-xl mt-auto border-t border-base-300">
      {/* Services Links */}
      <nav className="grid grid-flow-col gap-4 text-sm font-semibold">
        <Link href="/tutors" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Mathematics</Link>
        <Link href="/tutors" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Physics</Link>
        <Link href="/tutors" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Chemistry</Link>
        <Link href="/tutors" className="link link-hover text-base-content/70 hover:text-primary transition-colors">Biology</Link>
      </nav>
      
      {/* Social Links & Rebranded X Logo */}
      <nav>
        <div className="grid grid-flow-col gap-6 text-2xl">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="X (formerly Twitter)">
            <FaSquareXTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </nav>
      
      {/* Contact & Copyright Info */}
      <aside className="text-xl font-bold text-white text-base-content/50 gap-1">
        <p className="font-medium">Contact: support@mediqueue.com | +880 1700-000000</p>
        <p>© 2026 MediQueue Learning Services Ltd. All rights reserved.</p>
      </aside>
    </footer>
  );
}