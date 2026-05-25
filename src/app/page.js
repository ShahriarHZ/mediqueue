"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api"; 
import Banner from "@/components/Banner";
import TutorCard from "@/components/TutorCard";
import WhyChooseUs from "@/components/WhyChooseUs"; 
import Link from "next/link";
import HomeExtras from "@/components/HomeExtras";

export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeTutors = async () => {
      try {
        // Automatically fetches from your newly registered /tutors/home backend endpoint
        const response = await api.get("/tutors/home");
        setTutors(response.data);
      } catch (error) {
        console.error("Error loading home page tutors context:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeTutors();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Scrolling Banner Section */}
      <Banner />

      {/* 2. Available Tutors System Display */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-base-content">
              Available Tutors
            </h2>
            <p className="text-sm text-base-content/60 mt-1">
              Discover top-rated tutors in various subjects.
            </p>
          </div>
          <Link href="/tutors" className="btn btn-outline btn-sm rounded-xl px-5 border-base-300 hover:bg-base-200 hover:text-base-content">
            View All Tutors
          </Link>
        </div>

        {/* Conditional Loading States */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : tutors.length === 0 ? (
          <div className="bg-base-200 rounded-2xl p-12 text-center border border-dashed border-base-300">
            <p className="text-base-content/60 font-medium">No tutors available in the database right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tutors.map((tutor) => (
              // ✅ FIXED: Changed key target from tutor._id to tutor.id to match MySQL rows
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Isolated Feature Section Block */}
      <WhyChooseUs />

      {/* 4. Numbers & Call-To-Action Banner Section */}
      <HomeExtras />
    </div>
  );
}