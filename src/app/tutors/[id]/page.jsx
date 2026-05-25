"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosSecure from '@/utils/axiosSecure';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-toastify'; // ✅ FIXED: Switched from 'react-hot-toast' to match your layout

export default function TutorProfilePage() {
    const { id } = useParams(); 
    const router = useRouter();
    const { user } = useContext(AuthContext);
    
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTutorProfile = async () => {
            try {
                const response = await axiosSecure.get(`/tutors/${id}`);
                setTutor(response.data);
            } catch (err) {
                console.error("Error loading profile data:", err);
                toast.error("Failed to fetch tutor profile records.");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadTutorProfile();
    }, [id]);

    const handleConfirmBooking = async () => {
        if (!user?.email) {
            toast.error("Please log in to confirm session bookings.");
            return;
        }

        try {
            const bookingPayload = {
                tutor_id: tutor.id,
                tutor_name: tutor.name,
                photo: tutor.photo,         
                subject: tutor.subject,
                price: tutor.price,
                student_email: user.email,  
                tutor_email: tutor.email    
            };

            const response = await axiosSecure.post('/bookings', bookingPayload);
            
            if (response.data.success) {
                // ✅ Now using your layout's active ToastContainer provider!
                toast.success(`Successfully booked a session with ${tutor.name}! 🎉`);
                
                // Redirect back to see active sessions smoothly
                router.push('/my-bookings');
                router.refresh();
            }
        } catch (err) {
            console.error("Booking verification breakdown:", err);
            toast.error(err.response?.data?.message || "Failed to save booking to database.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 text-center">
                <h2 className="text-xl font-bold text-base-content/60">Tutor profile details not found.</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="card max-w-4xl mx-auto bg-base-100 shadow-xl overflow-hidden md:card-side">
                <figure className="md:w-1/2 h-64 md:h-auto bg-base-300">
                    <img src={tutor.photo} alt={tutor.name} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body md:w-1/2 justify-between">
                    <div>
                        <span className="badge badge-primary font-bold">{tutor.subject}</span>
                        <h2 className="card-title text-3xl font-black mt-2">{tutor.name}</h2>
                        <p className="text-sm text-base-content/60 mt-1">🏫 Institution: {tutor.institution || "N/A"}</p>
                        
                        <div className="mt-6 space-y-3 border-t border-base-200 pt-4">
                            <div className="flex justify-between"><span className="text-base-content/60">Hourly Rate:</span><span className="font-bold text-primary text-lg">${tutor.price}/hr</span></div>
                            <div className="flex justify-between"><span className="text-base-content/60">Available Days:</span><span className="font-semibold">{tutor.days}</span></div>
                            <div className="flex justify-between"><span className="text-base-content/60">Time Slot Window:</span><span className="font-semibold">{tutor.time_slot}</span></div>
                            <div className="flex justify-between"><span className="text-base-content/60">Teaching Mode:</span><span className="badge badge-neutral">{tutor.teaching_mode}</span></div>
                            <div className="flex justify-between"><span className="text-base-content/60">Location:</span><span className="font-semibold">📍 {tutor.location}</span></div>
                            <div className="flex justify-between"><span className="text-base-content/60">Available Slots:</span><span className="font-bold text-error">{tutor.slots} remaining</span></div>
                        </div>
                    </div>

                    <div className="card-actions mt-6">
                        <button 
                            onClick={handleConfirmBooking}
                            disabled={tutor.slots <= 0}
                            className="btn btn-primary w-full text-lg font-bold"
                        >
                            {tutor.slots > 0 ? "Confirm My Booking" : "No Slots Available"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}