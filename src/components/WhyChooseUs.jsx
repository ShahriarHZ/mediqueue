"use client";

import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaClock,
  FaStar,
} from "react-icons/fa6";

const features = [
  {
    icon: <FaUserCheck />,
    title: "Verified Tutors",
    description:
      "All our tutors go through a strict verification process to ensure trusted and high-quality learning experiences.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Scheduling",
    description:
      "Book sessions anytime that matches your routine. Learning should adapt to your lifestyle.",
  },
  {
    icon: <FaStar />,
    title: "Personalized Learning",
    description:
      "Every student learns differently. Tutors customize lessons based on your goals and learning pace.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
            WHY STUDENTS LOVE US
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight leading-tight">
            Why Choose{" "}
            <span className="text-primary">MediQueue?</span>
          </h2>

          <p className="mt-5 text-base md:text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            We make learning smarter, easier, and more personalized by
            connecting students with trusted tutors through a modern platform.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur-xl p-8 shadow-md hover:shadow-2xl transition-all duration-500"
            >
              
              {/* Hover Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>

              {/* Icon */}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-extrabold text-base-content mt-6 tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base-content/60 text-sm leading-relaxed mt-4">
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <div className="mt-6 w-14 h-1 rounded-full bg-primary/30 group-hover:w-24 group-hover:bg-primary transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}