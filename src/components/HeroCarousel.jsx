import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaClock } from "react-icons/fa";
import { getAnnouncements } from "../api/announcementApi";
import defaultImage from '../assets/background/santol_hall.jpg';
import logoOverlay from '../assets/logo/santol_logo.png';

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getAnnouncements({
        per_page: 10,
        page: 1,
        sort_by: 'created_at',
        order: 'desc'
        // Removed type filter to get all announcements
      });

      if (response.success && response.data.data) {

        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (announcements.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getImageUrl = (announcement) => {
    if (!announcement || !announcement.images) {
      return defaultImage;
    }

    try {
      // Handle array of images
      if (Array.isArray(announcement.images)) {
        const firstImage = announcement.images[0];
        if (!firstImage) return defaultImage;

        // Use environment variable for storage URL
        return `${import.meta.env.VITE_API_STORAGE_URL}/${firstImage}`;
      }

      // Handle single image string
      if (typeof announcement.images === 'string') {
        // Use environment variable for storage URL
        return `${import.meta.env.VITE_API_STORAGE_URL}/${announcement.images}`;
      }

      return defaultImage;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return defaultImage;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[600px] aspect-[16/9] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading announcements...</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="w-full max-w-[600px] aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 text-center">
        <div className="text-gray-500">No announcements available at the moment.</div>
      </div>
    );
  }

  const currentAnnouncement = announcements[index];

  return (
    <div className="w-full flex flex-col items-center mb-2 relative group">
      <div className="relative w-full">
        <div className="w-full max-w-[600px] aspect-[16/9] rounded-2xl shadow-lg overflow-hidden">
          {/* Background Image with fallback */}
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${getImageUrl(currentAnnouncement)})`,
              backgroundColor: 'rgb(243 244 246)', // fallback bg color
            }}
          >
            {/* Gradient Overlay - darker if no image */}
            <div className={`absolute inset-0 ${
              currentAnnouncement.images 
                ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent'
                : 'bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/30'
            }`}>
              {/* Logo Watermark */}
              <img 
                src={logoOverlay} 
                alt=""
                className="absolute top-4 right-4 w-12 h-12 opacity-50"
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <FaClock className="w-4 h-4" />
                  <span>{formatDate(currentAnnouncement.created_at)}</span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg font-medium text-white line-clamp-3 leading-relaxed">
                  {currentAnnouncement.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Previous announcement"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % announcements.length)}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Next announcement"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex gap-2 mt-4">
        {announcements.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index 
                ? 'bg-red-600 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to announcement ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
 
