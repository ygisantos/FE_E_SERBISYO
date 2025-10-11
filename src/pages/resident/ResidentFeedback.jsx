import React, { useState } from 'react';
import { FaStar, FaTag, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { createFeedback } from '../../api/feedbackApi';
import Select from '../../components/reusable/Select';
import { showCustomToast } from '../../components/Toast/CustomToast';

const ResidentFeedback = () => {
  const feedbackCategories = [
    'Barangay Services',
    'Document Request',
    'Staff Assistance',
    'Facilities',
    'Community Programs',
    'Emergency Response',
    'Cleanliness and Sanitation',
    'Security Concerns',
    'Events and Activities',
    'Other Concerns'
  ];

  const [resident] = useState({ id: 1 }); // Simplified to just id
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    category: null,
    remarks: '',
  });
  const [rating, setRating] = useState(0);

  const resetForm = () => {
    setFeedback({
      category: null,
      remarks: ''
    });
    setRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedbackData = {
        user: resident.id,
        remarks: feedback.remarks,
        category: feedback.category,
        rating: rating.toString()
      };

      await createFeedback(feedbackData);
      showCustomToast('Thank you for your feedback! Your input helps us improve our services.', 'success');
      resetForm();

    } catch (error) {
      showCustomToast(error.message || 'Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = feedbackCategories.map(category => ({
    value: category,
    label: category
  }));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-red-50">
      <div className="container mx-auto max-w-4xl">
        {/* Feedback Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative border border-gray-100">
          {/* Remove loading state for simplification */}
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Share Your Experience</h2>
            <p className="text-gray-600">Help us serve you better by providing your valuable feedback</p>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <label className="text-lg font-medium text-gray-800">How was your experience?</label>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`cursor-pointer transform transition-transform hover:scale-110 ${
                      index < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    size={32}
                    onClick={() => setRating(index + 1)}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {rating === 0 ? "Select your rating" : 
                 rating === 5 ? "Excellent!" :
                 rating === 4 ? "Very Good!" :
                 rating === 3 ? "Good" :
                 rating === 2 ? "Fair" : "Poor"}
              </p>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Select
                label="Category"
                options={categoryOptions}
                value={categoryOptions.find(opt => opt.value === feedback.category) || null} // Add null fallback
                onChange={(option) => setFeedback(prev => ({ 
                  ...prev, 
                  category: option?.value || null 
                }))}
                placeholder="Select a category..."
                required
                isClearable={true}
              />
            </div>

            {/* Feedback Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                value={feedback.remarks}
                onChange={(e) => setFeedback(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 transition-colors"
                rows="5"
                required
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Card */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span>Rate our service</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <FaTag className="text-red-900" />
              <span>Choose a category</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <FaPaperPlane className="text-red-900" />
              <span>Share your thoughts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentFeedback;
   