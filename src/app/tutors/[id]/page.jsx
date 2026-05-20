"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import axiosSecure from "../../../utils/axiosSecure";
import { toast } from "react-toastify";
import { FaBookOpen, FaClock, FaLocationDot, FaGraduationCap, FaCircleCheck } from "react-icons/fa6";

export default function TutorDetails() {
  const params = useParams(); 
  const tutorId = params?.id;

  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSubmit, setBookingSubmit] = useState(false);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      if (!tutorId) return;
      try {
        // Fetches cleanly even if authorization token is empty/null
        const response = await axiosSecure.get(`/tutors/${tutorId}`);
        setTutor(response.data);
      } catch (err) {
        toast.error("Could not extract tutor configuration details.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTutorDetails();
    }
  }, [tutorId, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center p-12 bg-base-200 rounded-2xl max-w-xl mx-auto border border-dashed border-base-300">
        <p className="font-semibold text-base-content/60">Tutor profile data record was not found.</p>
      </div>
    );
  }

  const handleBookSession = async () => {
    // --- Guard Check 1: User Logged-In Requirement ---
    if (!user) {
      toast.info("🔒 Private functionality. Please log in to book a session slot with this tutor!");
      router.push("/login");
      return;
    }

    const today = new Date();
    const sessionStartDate = new Date(tutor.sessionStartDate);

    // --- Guard Check 2: Date Bounds Rule ---
    if (today < sessionStartDate) {
      toast.warning(`🚫 Booking is not active yet! This tutor begins sessions starting on ${tutor.sessionStartDate}.`);
      return;
    }

    // --- Guard Check 3: Out of Slots Rule ---
    if (tutor.totalSlot <= 0) {
      toast.error("❌ This instructor's schedule matrix is completely full! No slots remaining.");
      return;
    }

    setBookingSubmit(true);

    const bookingPayload = {
      tutorId: tutor._id,
      tutorName: tutor.name,
      tutorImage: tutor.image,
      subject: tutor.subject,
      hourlyFee: tutor.hourlyFee,
      studentName: user.name,
      studentEmail: user.email,
      bookedAt: new Date().toISOString(),
      status: "active"
    };

    try {
      const response = await axiosSecure.post("/bookings", bookingPayload);
      
      if (response.data.success) {
        toast.success(`🎉 Slot Reserved Successfully! $${tutor.hourlyFee} token block registered.`);
        setTutor(prev => ({ ...prev, totalSlot: prev.totalSlot - 1 }));
        router.push("/my-bookings");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Booking pipeline submission fault.";
      toast.error(errMsg);
    } finally {
      setBookingSubmit(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-base-100 border border-base-200 shadow-2xl rounded-2xl overflow-hidden p-6 md:p-8">
        
        {/* Left Side Profile Image Frame */}
        <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-base-200 pb-6 md:pb-0 md:pr-4">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-lg bg-base-200">
            <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
          </div>
          <div className="badge badge-primary font-black mt-3 text-xs py-2 px-3 rounded-xl shadow-md">
            ${tutor.hourlyFee} / hour
          </div>
        </div>

        {/* Right Side Content Specifications Grid Info Block */}
        <div className="md:col-span-2 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-black text-base-content tracking-tight">{tutor.name}</h1>
              <div className="flex items-center gap-2 text-primary font-bold text-sm mt-1">
                <FaBookOpen /> <span>{tutor.subject} Specialist</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-base-content/80 border-y border-base-200 py-4">
              <div className="flex items-center gap-3">
                <FaClock className="text-primary" />
                <span>{tutor.availability?.days} ({tutor.availability?.timeSlot})</span>
              </div>
              <div className="flex items-center gap-3">
                <FaLocationDot className="text-primary" />
                <span>{tutor.location} ({tutor.teachingMode})</span>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <FaGraduationCap className="text-primary text-base" />
                <span>{tutor.institution} • {tutor.experience}</span>
              </div>
            </div>

            {/* Live Counter Tracking Monitor Alert Frame */}
            <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl border border-base-300">
              <div>
                <span className="text-xs text-base-content/50 uppercase tracking-widest block font-bold">Remaining Openings</span>
                <span className={`text-2xl font-black ${tutor.totalSlot > 0 ? "text-success" : "text-error"}`}>
                  {tutor.totalSlot} Slots Left
                </span>
              </div>
              <div>
                <span className="text-xs text-base-content/50 uppercase tracking-widest block font-bold text-right">Start Date</span>
                <span className="text-sm font-bold text-base-content">{tutor.sessionStartDate}</span>
              </div>
            </div>
          </div>

          {/* Checkout Triggers Action Button */}
          <div>
            <button
              onClick={handleBookSession}
              disabled={bookingSubmit || tutor.totalSlot <= 0}
              className="btn btn-primary w-full rounded-xl font-bold tracking-wide text-base shadow-lg shadow-primary/20 gap-2"
            >
              <FaCircleCheck /> Confirm Session Booking
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}