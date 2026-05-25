'use client';
import React, { useContext } from 'react';
import axiosSecure from '@/utils/axiosSecure'; 
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddTutorPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const handlePublishTutor = async (e) => {
        e.preventDefault();
        const form = e.target;

        const tutorData = {
            name: form.tutorName.value,
            photo: form.photoLink.value,
            subject: form.subjectCategory.value,
            price: parseFloat(form.hourlyFee.value || 0),               
            days: form.availableDays.value,                              
            time_slot: form.availableTimeSlot.value,                     
            slots: parseInt(form.totalAvailableSlots.value || 0),       
            start_date: form.sessionStartDate.value,                     
            institution: form.experience.value,                          
            location: form.location.value,                               
            teaching_mode: form.teachingMode.value,                      
            email: user?.email                                           
        };

        if (!tutorData.email) {
            toast.error("You must be logged in to register a tutor profile.");
            return;
        }

        try {
            const response = await axiosSecure.post('/tutors', tutorData);
            
            if (response.data.success) {
                toast.success("Tutor listing successfully published to MySQL! 🎉");
                form.reset();
                router.push("/tutors");
                router.refresh();
            }
        } catch (err) {
            console.error("Submission pipeline error:", err);
            toast.error(err.response?.data?.message || "Failed to append tutor database registry details.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-3xl font-bold text-primary mb-6">Add a Tutor Profile</h2>
                    
                    <form onSubmit={handlePublishTutor} className="space-y-6">
                        {/* Row 1: Name & Photo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Tutor Name</span></label>
                                <input type="text" name="tutorName" placeholder="Zisan" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Photo Link / URL</span></label>
                                <input type="url" name="photoLink" placeholder="https://example.com/image.jpg" className="input input-bordered w-full" required />
                            </div>
                        </div>

                        {/* Row 2: Subject & Fee */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Subject / Category</span></label>
                                <select name="subjectCategory" className="select select-bordered w-full" defaultValue="Physics">
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Hourly Fee ($)</span></label>
                                <input type="number" name="hourlyFee" placeholder="34" className="input input-bordered w-full" required />
                            </div>
                        </div>

                        {/* Row 3: Days & Slots */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Available Days</span></label>
                                <input type="text" name="availableDays" placeholder="Sun, Tue" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Available Time Slot</span></label>
                                <input type="text" name="availableTimeSlot" placeholder="5-7 PM" className="input input-bordered w-full" required />
                            </div>
                        </div>

                        {/* Row 4: Total Slots & Start Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Total Available Slots</span></label>
                                <input type="number" name="totalAvailableSlots" placeholder="23" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Session Start Date</span></label>
                                <input type="date" name="sessionStartDate" className="input input-bordered w-full" required />
                            </div>
                        </div>

                        {/* Row 5: Experience */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Institution & Experience</span></label>
                            <input type="text" name="experience" placeholder="University of Barishal" className="input input-bordered w-full" required />
                        </div>

                        {/* Row 6: Location & Mode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Location (City)</span></label>
                                <input type="text" name="location" placeholder="Barishal, BD" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Teaching Mode</span></label>
                                <select name="teachingMode" className="select select-bordered w-full" defaultValue="Both">
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full text-lg tracking-wider">
                                Publish Tutor Listing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}