"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaArrowRightLong } from "react-icons/fa6";

export default function Banner() {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop",
      title: "Master Any Subject at Your Own Pace",
      description: "From Mathematics to Physics, our diverse range of expert tutors is here to help you succeed in your academic journey.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600&auto=format&fit=crop",
      title: "Eliminate Manual Scheduling Conflicts",
      description: "Book online learning sessions instantly with real-time slot tracking and automated digital session tokens.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      title: "Learn From Elite University Alumni",
      description: "Connect with verified professionals from top institutions and secure personalized guidance tailored for you.",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Optional: Auto-scrolling interval logic (changes slides every 5 seconds)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  return (
    <div className="relative w-full h-[65vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-2xl group border border-base-200">
      
      {/* Slides Mapping */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with Dark Overlay for clean contrast */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-transparent mix-blend-multiply" />

          {/* Content Box */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 text-neutral-content max-w-3xl z-20 gap-4 md:gap-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-sm md:text-lg text-gray-200 font-medium max-w-xl leading-relaxed drop-shadow-sm">
              {slide.description}
            </p>
            <div>
              {/* Assignment Call-to-action button linking directly to Tutors Page */}
              <Link href="/tutors" className="btn btn-primary btn-sm md:btn-md font-bold px-6 gap-2 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30">
                Find a Tutor <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Left Navigation Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Previous Slide"
      >
        <FaArrowLeft className="text-lg md:text-xl" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Next Slide"
      >
        <FaArrowRight className="text-lg md:text-xl" />
      </button>

      {/* Dynamic Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}