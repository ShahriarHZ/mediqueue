"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosSecure from "../../utils/axiosSecure";
import { toast } from "react-toastify";
import { FaGraduationCap, FaDollarSign, FaCalendarCheck, FaTrash, FaTriangleExclamation } from "react-icons/fa6";
import Link from "next/link";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which unique booking row item is currently chosen for deletion
  const [activeBookingForDelete, setActiveBookingForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user?.email) return;
      try {
        const response = await axiosSecure.get(`/my-bookings?email=${user.email}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Extraction error tracking", err);
        toast.error("Failed to load your booked sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user]);

  // Execute actual database deletion via securely signed interceptor instance
  const handleConfirmDelete = async () => {
    if (!activeBookingForDelete) return;
    setDeleteLoading(true);

    try {
      const response = await axiosSecure.delete(`/bookings/${activeBookingForDelete._id}`);
      if (response.data.success) {
        toast.success(`Successfully cancelled session with ${activeBookingForDelete.tutorName}.`);
        // Optimistically filter the matching row out of UI state instantly
        setBookings((prev) => prev.filter((b) => b._id !== activeBookingForDelete._id));
        setActiveBookingForDelete(null); // Close Modal
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Could not delete booking record.";
      toast.error(errMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="mt-4 animate-fade-in pb-12 max-w-6xl mx-auto px-2">
      <h2 className="text-3xl font-black text-base-content mb-6 tracking-tight">My Booked Sessions</h2>

      {bookings.length === 0 ? (
        <div className="bg-base-200 border border-dashed border-base-300 rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-sm">
          <h3 className="text-xl font-bold text-base-content/80 mb-1">No Active Bookings</h3>
          <p className="text-sm text-base-content/50">You haven`t reserved any scheduling blocks across the network catalog yet.</p>
        </div>
      ) : (
        /* Render Responsive Grid Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="card card-side bg-base-100 border border-base-200 shadow-md rounded-2xl p-4 items-center gap-5 hover:shadow-xl transition-all duration-300 min-h-[110px]"
            >
              {/* Perfectly Synced Image Container Frame (w-20 h-20) */}
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-base-200 shrink-0 border border-base-200 shadow-sm">
                <img 
                  src={booking.tutorImage} 
                  alt={booking.tutorName} 
                  className="w-full h-full object-cover object-top" 
                />
              </div>

              {/* Text metadata block */}
              <div className="flex-grow space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-secondary badge-outline font-bold text-xs truncate py-2 px-2.5 rounded-lg">
                    {booking.subject}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-success flex items-center gap-1 shrink-0 bg-success/10 py-1 px-2 rounded-md">
                    <FaCalendarCheck /> Verified
                  </span>
                </div>
                
                {/* Fixed Dynamic Route Interpolation Link Wrapper */}
                <Link href={`/tutors/${booking.tutorId}`}>
                  <h3 className="text-lg font-black text-base-content hover:text-primary transition-colors truncate tracking-tight leading-tight pt-0.5 cursor-pointer">
                    {booking.tutorName}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between gap-4 pt-0.5 w-full">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-base-content/60">
                    <span className="flex items-center gap-1">
                      <FaGraduationCap className="text-primary text-sm"/> Student: You
                    </span>
                    <span className="flex items-center text-primary font-bold">
                      <FaDollarSign className="text-xs -mr-0.5"/>{booking.hourlyFee}/hr Paid
                    </span>
                  </div>

                  {/* Red Trash Delete Button Trigger Option */}
                  <button
                    onClick={() => setActiveBookingForDelete(booking)}
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle text-base-content/30 hover:bg-error/10 hover:text-error transition-all shrink-0"
                    title="Cancel Booking"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* DAISYUI INTERACTIVE CANCELLATION MODAL */}
      {/* ------------------------------------------------------------------- */}
      {activeBookingForDelete && (
        <div className="modal modal-open modal-bottom sm:modal-middle z-[100] animate-fade-in">
          <div className="modal-box max-w-sm rounded-2xl border border-base-200 shadow-2xl p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-error/10 text-error rounded-full text-xl">
  <FaTriangleExclamation />
</div>
              <h3 className="font-black text-xl text-base-content tracking-tight">
                Cancel Session?
              </h3>
              <p className="text-sm font-medium text-base-content/60 leading-relaxed">
                Are you sure you want to drop your session slot reserved with{" "}
                <span className="font-bold text-base-content">
                  {activeBookingForDelete.tutorName}
                </span>
                ? This pipeline operation cannot be reversed.
              </p>
            </div>

            {/* Modal Actions Footer Bar Row */}
            <div className="modal-action grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setActiveBookingForDelete(null)}
                disabled={deleteLoading}
                type="button"
                className="btn btn-outline border-base-300 rounded-xl font-bold text-sm"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                type="button"
                className={`btn btn-error text-white rounded-xl font-bold text-sm ${
                  deleteLoading ? "loading" : ""
                }`}
              >
                {deleteLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
          
          {/* Click background wrapper frame shortcut to dismiss popup state safely */}
          <div 
            className="modal-backdrop bg-black/40" 
            onClick={() => !deleteLoading && setActiveBookingForDelete(null)}
          ></div>
        </div>
      )}
    </div>
  );
}