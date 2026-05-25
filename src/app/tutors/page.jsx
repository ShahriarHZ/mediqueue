"use client";
import { useEffect, useState } from "react";
import axiosSecure from "@/utils/axiosSecure";
import TutorCard from "../../components/TutorCard";
import { FaSearch, FaCalendarAlt, FaUndo } from "react-icons/fa";

export default function TutorsGallery() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTutors = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const response = await axiosSecure.get(`/tutors${queryString}`);
      setTutors(response.data);
    } catch (error) {
      console.error("Error loading filtered tutors data pool:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTutors();
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [search, startDate, endDate]);

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-base-content tracking-tight">Browse All Tutors</h1>
        <p className="text-sm text-base-content/60 mt-1">Find the absolute perfect match for your learning curriculum.</p>
      </div>

      <div className="bg-base-200 border border-base-300 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="form-control w-full">
          <label className="label-text font-bold mb-1 flex items-center gap-2">
            <FaSearch className="text-xs text-primary" /> Search Name / Subject
          </label>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type search terms..." 
            className="input input-bordered w-full rounded-xl bg-base-100" 
          />
        </div>

        <div className="form-control w-full">
          <label className="label-text font-bold mb-1 flex items-center gap-2">
            <FaCalendarAlt className="text-xs text-primary" /> Available From
          </label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100" 
          />
        </div>

        <div className="form-control w-full">
          <label className="label-text font-bold mb-1 flex items-center gap-2">
            <FaCalendarAlt className="text-xs text-primary" /> Available Until
          </label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100" 
          />
        </div>

        <div>
          <button 
            onClick={handleReset}
            className="btn btn-outline border-base-300 hover:bg-base-300 hover:text-base-content w-full rounded-xl font-bold gap-2"
          >
            <FaUndo className="text-xs" /> Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tutors.length === 0 ? (
        <div className="bg-base-100 border border-dashed border-base-300 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-md">
          <h3 className="text-xl font-bold text-base-content/70">No Matching Tutors Found</h3>
          <p className="text-sm text-base-content/50 mt-1">Try modifying your text syntax query or resetting your timeline filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}