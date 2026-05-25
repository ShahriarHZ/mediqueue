import React from 'react';
import Link from 'next/link';

export default function TutorCard({ tutor }) {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <figure className="h-48 overflow-hidden bg-base-200 relative">
        <img 
          src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600"} 
          alt={tutor.name} 
          className="w-full h-full object-cover"
        />
      </figure>
      
      <div className="card-body p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-xl font-bold text-base-content">{tutor.name}</h2>
            <span className="badge badge-primary font-semibold text-xs mt-1">{tutor.subject}</span>
          </div>
          <div className="text-right">
            <p className="text-primary font-black text-lg">${tutor.price}/hr</p>
          </div>
        </div>
        
        <div className="space-y-1 my-4 text-sm font-medium text-base-content/70 border-t border-b border-base-100 py-3">
          <p className="flex justify-between">
            <span>Slots Remaining:</span>
            <span className="badge badge-ghost font-bold">{tutor.slots} left</span>
          </p>
          <p className="text-xs mt-1">🏫 <span className="font-semibold">Institution:</span> {tutor.institution || "N/A"}</p>
          <p className="text-xs">📍 <span className="font-semibold">Location:</span> {tutor.location}</p>
          <p className="text-xs">📅 <span className="font-semibold">Days:</span> {tutor.days} ({tutor.time_slot})</p>
        </div>
        
        <div className="card-actions justify-end">
          {/* ✅ Redirects dynamically to the unique tutor profile folder view */}
          <Link href={`/tutors/${tutor.id}`} className="w-full">
            <button className="btn btn-sm btn-primary w-full rounded-xl font-bold tracking-wide">
              Book Session
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}