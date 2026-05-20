"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import axiosSecure from "../../utils/axiosSecure";
import { toast } from "react-toastify";

export default function AddTutor() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "", image: "", subject: "Mathematics", days: "", timeSlot: "",
    hourlyFee: "", totalSlot: "", sessionStartDate: "", institution: "",
    experience: "", location: "", teachingMode: "Online"
  });

  // Strict Protection Check: If not logged in, redirect away upon load sequence completion
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access the add tutor workspace.");
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Structure the body object matching our backend requirements schema
    const tutorData = {
      ...formData,
      availability: { days: formData.days, timeSlot: formData.timeSlot },
      createdBy: user.email // Crucial link for management isolation tracing
    };

    try {
      const response = await axiosSecure.post("/tutors", tutorData);
      if (response.data.insertedId) {
        toast.success("Tutor profile registered successfully inside MongoDB!");
        router.push("/my-tutors");
      }
    } catch (err) {
      toast.error("Failed to append tutor database registry details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-base-100 p-8 rounded-2xl shadow-xl border border-base-200 mt-4 animate-fade-in">
      <h2 className="text-3xl font-black text-primary mb-6 tracking-tight">Add a Tutor Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="form-control">
          <label className="label-text font-semibold mb-1">Tutor Name</label>
          <input type="text" name="name" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: Dr. Sarah Johnson" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Photo Link / URL</label>
          <input type="url" name="image" required onChange={handleChange} className="input input-bordered w-full" placeholder="https://imgbb-link-or-unsplash" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Subject / Category</label>
          <select name="subject" onChange={handleChange} className="select select-bordered w-full font-medium">
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
            <option>Computer Science</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Hourly Fee ($)</label>
          <input type="number" name="hourlyFee" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: 45" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Available Days</label>
          <input type="text" name="days" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: Sun - Thu" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Available Time Slot</label>
          <input type="text" name="timeSlot" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: 5:00 PM - 8:00 PM" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Total Available Slots</label>
          <input type="number" name="totalSlot" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: 10" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Session Start Date</label>
          <input type="date" name="sessionStartDate" required onChange={handleChange} className="input input-bordered w-full" />
        </div>

        <div className="form-control md:col-span-2">
          <label className="label-text font-semibold mb-1">Institution & Experience</label>
          <input type="text" name="institution" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: 3 Years at University of Barishal" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Location (City)</label>
          <input type="text" name="location" required onChange={handleChange} className="input input-bordered w-full" placeholder="Ex: Barishal" />
        </div>

        <div className="form-control">
          <label className="label-text font-semibold mb-1">Teaching Mode</label>
          <select name="teachingMode" onChange={handleChange} className="select select-bordered w-full font-medium">
            <option>Online</option>
            <option>Offline</option>
            <option>Both</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary md:col-span-2 font-bold tracking-wide mt-3 rounded-xl shadow-lg shadow-primary/20">
          Publish Tutor Listing
        </button>
      </form>
    </div>
  );
}