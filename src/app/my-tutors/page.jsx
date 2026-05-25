"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import axiosSecure from "../../utils/axiosSecure";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

export default function MyTutors() {
  const { user } = useContext(AuthContext);
  const [myTutors, setMyTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for handling the edit modal action flow
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const fetchMyTutors = async () => {
    if (!user?.email) return;
    try {
      const response = await axiosSecure.get(`/my-tutors?email=${user.email}`);
      setMyTutors(response.data);
    } catch (err) {
      console.error("Error retrieving custom profile extractions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTutors();
  }, [user]);

  // Handle opening the modal and capturing the tutor record data copy
  const handleEditClick = (tutor) => {
    setSelectedTutor({ ...tutor });
  };

  // Synchronize field keystrokes straight to the local modal state container
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTutor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit the changes through your secured backend endpoint pipeline
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdateLoading(true);

    try {
      // Swapped out selectedTutor._id to use selectedTutor.id for MySQL endpoint mapping
      const response = await axiosSecure.put(`/tutors/${selectedTutor.id}`, {
        ...selectedTutor,
        price: parseFloat(selectedTutor.price || 0),
        slots: parseInt(selectedTutor.slots || 0)
      });
      
      if (response.data.success) {
        toast.success("Tutor configurations customized successfully!");
        setSelectedTutor(null); // Close modal cleanly
        fetchMyTutors(); // Instantly synchronize underlying grid values
      }
    } catch (error) {
      console.error("Failed to commit database structural modifications:", error);
      toast.error("An execution fault error occurred during update operations.");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // Handle Entry Deletion with SweetAlert2 confirmation modal framework mapping
 // Handle Entry Deletion with SweetAlert2 confirmation modal framework mapping
const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This tutor dashboard entry data registry will be erased permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/tutors/${id}`);
        
        // Match the backend payload schema (.success verification)
        if (response.data.success) {
          setMyTutors(myTutors.filter(t => t.id !== id));
          Swal.fire("Deleted!", "The entry has been extracted successfully.", "success");
        }
      } catch (error) {
        console.error("Deletion lifecycle exception:", error);
        toast.error("An execution fault error occurred during deletion.");
      }
    }
  });
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="mt-4 animate-fade-in pb-12">
      <h2 className="text-3xl font-black text-base-content mb-6 tracking-tight">My Listed Tutors</h2>

      {/* Assignment Empty State Handling Requirement Rule */}
      {myTutors.length === 0 ? (
        <div className="bg-base-200 border border-dashed border-base-300 rounded-2xl p-16 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-base-content/80 mb-1">No Listings Registered Yet</h3>
          <p className="text-sm text-base-content/50">You haven`t published any tutor profiles under your current account email session details.</p>
        </div>
      ) : (
        /* Structural Multi-column Dashboard Data Grid Display mapping */
        <div className="overflow-x-auto shadow-xl rounded-2xl border border-base-200">
          <table className="table bg-base-100">
            <thead className="bg-base-200 text-base-content/80 font-bold text-sm">
              <tr>
                <th>Profile</th>
                <th>Subject</th>
                <th>Hourly Rate</th>
                <th>Slots Available</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm">
              {myTutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-base-200/50 transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          {/* Updated Image tag targeting to match flat MySQL field name: .photo */}
                          <img src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600"} alt={tutor.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base">{tutor.name}</div>
                        <div className="text-xs text-base-content/60">{tutor.location}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary font-semibold text-xs py-2 px-3 rounded-lg">{tutor.subject}</span>
                  </td>
                  {/* Updated fields mapping to align perfectly with backend data outputs */}
                  <td className="font-bold text-primary">${tutor.price}/hr</td>
                  <td>
                    <span className="badge badge-ghost font-bold">{tutor.slots} slots</span>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      {/* Interactive Edit Action Trigger */}
                      <button 
                        onClick={() => handleEditClick(tutor)}
                        className="btn btn-warning btn-sm btn-square rounded-xl text-amber-950 shadow-md shadow-warning/10 hover:scale-105"
                        aria-label="Edit Tutor Entry"
                      >
                        <FaEdit />
                      </button>
                      
                      {/* Secure Deletion Action Trigger */}
                      <button 
                        onClick={() => handleDelete(tutor.id)}
                        className="btn btn-error btn-sm btn-square rounded-xl text-white shadow-md shadow-error/10 hover:scale-105"
                        aria-label="Delete Tutor Entry"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          MODAL COMPONENT WORKFLOW LAYER (Mounts dynamically via state)
         --------------------------------------------------------------------- */}
      {selectedTutor && (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm flex items-center justify-center fixed inset-0 z-50 transition-all">
          <div className="modal-box max-w-lg bg-base-100 p-6 rounded-2xl border border-base-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-2xl text-base-content mb-1 tracking-tight">Update Tutor Profile</h3>
            <p className="text-xs text-base-content/50 mb-6">Modify entry logs for {selectedTutor.name}.</p>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="form-control w-full">
                <label className="label-text font-bold text-base-content/70 mb-1.5 text-xs uppercase tracking-wider">Tutor Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={selectedTutor.name || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl text-sm font-medium" 
                  required 
                />
              </div>

              <div className="form-control w-full">
                <label className="label-text font-bold text-base-content/70 mb-1.5 text-xs uppercase tracking-wider">Subject Specialty</label>
                <input 
                  type="text" 
                  name="subject"
                  value={selectedTutor.subject || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl text-sm font-medium" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label-text font-bold text-base-content/70 mb-1.5 text-xs uppercase tracking-wider">Hourly Fee ($)</label>
                  <input 
                    type="number" 
                    name="price" // Updated property binder targeting field: price
                    value={selectedTutor.price || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full rounded-xl text-sm font-medium" 
                    required 
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label-text font-bold text-base-content/70 mb-1.5 text-xs uppercase tracking-wider">Available Slots</label>
                  <input 
                    type="number" 
                    name="slots" // Updated property binder targeting field: slots
                    value={selectedTutor.slots || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full rounded-xl text-sm font-medium" 
                    required 
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label-text font-bold text-base-content/70 mb-1.5 text-xs uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={selectedTutor.location || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl text-sm font-medium" 
                />
              </div>

              <div className="modal-action flex justify-end gap-3 pt-4 border-t border-base-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => setSelectedTutor(null)} 
                  className="btn btn-ghost btn-sm rounded-xl px-4 font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdateLoading}
                  className="btn btn-primary btn-sm rounded-xl px-5 font-bold text-xs shadow-md shadow-primary/20"
                >
                  {isUpdateLoading ? "Saving Changes..." : "Save Modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}