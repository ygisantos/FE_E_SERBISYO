import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const sampleAnnouncements = [
  {
    id: 1,
    title: "Barangay Clean-up Drive",
    content: "Join us for our monthly clean-up drive this Saturday. Together, let's make our community cleaner and greener! Bring your own cleaning materials and meet at the barangay hall at 7 AM.",
    priority: "High",
    datePosted: "2024-07-25",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=600&q=80"
  },
  {
    id: 2,
    title: "COVID-19 Vaccination Schedule",
    content: "The next vaccination schedule will be on August 5th. Priority will be given to senior citizens and persons with comorbidities. Please bring a valid ID and your vaccination card.",
    priority: "High",
    datePosted: "2024-07-26",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=600&q=80"
  },
  {
    id: 3,
    title: "Barangay Sports Festival",
    content: "Get ready for our annual sports festival! Various sports events and competitions with exciting prizes. Register your team now at the barangay hall.",
    priority: "Medium",
    datePosted: "2024-07-27",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=600&q=80"
  }
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const handlePrevious = () => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentAnnouncement = announcements[index];

  return (
    <div className="w-full flex flex-col items-center mb-2 relative group">
      <div className="relative w-full">
        <img
          src={currentAnnouncement.image}
          alt={currentAnnouncement.title}
          className="w-full max-w-[600px] aspect-[16/9] h-auto object-cover rounded-2xl shadow-lg transition-all duration-700"
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{currentAnnouncement.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">{currentAnnouncement.content}</p>
            <div className="mt-2 text-xs text-gray-300">
              Posted on {new Date(currentAnnouncement.datePosted).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous announcement"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next announcement"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex gap-2 mt-3">
        {announcements.map((_, i) => ( 
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full border border-red-800 ${i === index ? 'bg-red-950' : 'bg-neutral-300'} transition-all`}
            aria-label={`Go to announcement ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
