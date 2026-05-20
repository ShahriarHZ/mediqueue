"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBookOpen, FaClock, FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function TutorCard({ tutor }) {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Check if a user session is active

  const handleBookSession = () => {
    // Check if user is logged in
    if (!user) {
      toast.warning("🔒 You must log in to view tutor details and book sessions!");
      router.push("/login");
      return;
    }
    
    // If logged in, send them straight to the private dynamic details path
    router.push(`/tutors/${tutor._id}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group h-full">
      
      {/* Top Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-base-300">
        <img 
          src={tutor.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600"} 
          alt={tutor.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-content text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
          ${tutor.hourlyFee}/hr
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-6 flex-grow flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-base-content truncate tracking-tight mb-1">
            {tutor.name}
          </h3>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
            <FaBookOpen className="text-xs" />
            <span>{tutor.subject}</span>
          </div>

          {/* Description Snippet/Institution */}
          <p className="text-xs text-base-content/60 line-clamp-2 mb-4">
            {tutor.institution || "Verified Educator"} • {tutor.experience || "Expert Instructor"}
          </p>

          {/* Balanced Meta Info */}
          <div className="space-y-2 text-xs text-base-content/70 font-medium border-t border-base-200 pt-3">
            <div className="flex items-center gap-3">
              <FaClock className="text-primary text-xs shrink-0" />
              <span className="truncate">{tutor.availability?.days || "Flexible Days"}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaLocationDot className="text-primary text-xs shrink-0" />
              <span className="truncate">{tutor.location} ({tutor.teachingMode})</span>
            </div>
          </div>
        </div>

        {/* Dynamic Action Call */}
        <div className="mt-2">
          <button 
            onClick={handleBookSession}
            className="btn btn-primary w-full rounded-xl font-bold text-sm tracking-wide"
          >
            Book Session
          </button>
        </div>
      </div>

    </div>
  );
}