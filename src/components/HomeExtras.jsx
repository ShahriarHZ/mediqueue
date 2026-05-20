"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUsers, FaStar, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";

function Counter({ end, duration = 2000, suffix = "+" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomeExtras() {
  const stats = [
    {
      value: 500,
      label: "Expert Tutors",
      icon: <FaChalkboardTeacher />,
      suffix: "+",
    },
    {
      value: 2000,
      label: "Happy Students",
      icon: <FaUsers />,
      suffix: "+",
    },
    {
      value: 5000,
      label: "Sessions Booked",
      icon: <FaBookOpen />,
      suffix: "+",
    },
    {
      value: 4.9,
      label: "Average Rating",
      icon: <FaStar />,
      suffix: "/5",
    },
  ];

  return (
    <div className="w-full mt-24 space-y-30">
      
      {/* ========================================================= */}
      {/* STATS SECTION */}
      {/* ========================================================= */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  
                  {/* Icon */}
                  <div className="mb-6 text-4xl text-primary bg-primary/10 p-5 rounded-2xl group-hover:scale-110 transition duration-300">
                    {stat.icon}
                  </div>

                  {/* Number */}
                  <h2 className="text-5xl font-black tracking-tight text-base-content">
                    {stat.value === 4.9 ? (
                      <>
                        4.9
                        <span className="text-primary">/5</span>
                      </>
                    ) : (
                      <Counter end={stat.value} suffix={stat.suffix} />
                    )}
                  </h2>

                  {/* Label */}
                  <p className="mt-3 text-sm uppercase tracking-[0.25em] font-bold text-base-content/50">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA SECTION */}
<section className="w-full px-6 py-24 mt-24">
  <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
    
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

    <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-20 md:px-16">
      
      {/* Top Badge */}
      <div className="mb-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-neutral-300 font-medium">
        🚀 Trusted by thousands of learners
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
        Ready to Start
      </h2>

      <h2 className="text-4xl md:text-6xl font-black text-primary mt-1">
        Learning Smarter?
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-lg md:text-xl text-neutral-300 leading-relaxed">
        Join thousands of students already improving their grades,
        building skills, and booking sessions with top tutors on
        MediQueue.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-5">
        
<Link href="/login">
  <button className="btn h-14 px-10 rounded-2xl border-none bg-white text-slate-900 hover:bg-neutral-200 text-base font-bold shadow-lg hover:scale-105 transition duration-300">
    Join Now for Free
  </button>
</Link>

        <Link href={"/tutors"}><button className="btn h-14 px-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-black backdrop-blur-md text-base font-semibold transition duration-300">
          Explore Tutors
        </button></Link>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}