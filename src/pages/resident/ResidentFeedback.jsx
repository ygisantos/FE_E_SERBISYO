import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle, FaTag, FaPaperPlane, FaSpinner } from 'react-icons/fa';

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

  // TODO: Replace this with actual logged-in resident data from authentication
  const [resident, setResident] = useState({
    id: null,
    name: '',
    email: '',
   });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, isError: false, message: '' });

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // TODO: Fetch resident data when authentication is implemented
  useEffect(() => {
    // This will be replaced with actual API call to get resident data
    const fetchResidentData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with timeout to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        // const response = await getResidentData(userId);
        // setResident(response.data);
        
        // For now, we'll use dummy data
        // This will be removed when real authentication is implemented
        const dummyData = {
          id: 1,
          name: 'Juan Dela Cruz',
          email: 'juan@example.com'
        };
        setResident(dummyData);
        
        // Pre-fill the form with resident data
        setFeedback(prev => ({
          ...prev,
          name: dummyData.name,
          email: dummyData.email
        }));
      } catch (error) {
        console.error('Error fetching resident data:', error);
        setSubmitStatus({
          show: true,
          isError: true,
          message: 'Failed to load resident data. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidentData();
  }, []); // Will add dependencies when auth is implemented

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ show: false, isError: false, message: '' });

    // Validate category and custom subject if needed
    if (feedback.subject === 'Other Concerns' && !feedback.customSubject?.trim()) {
      setSubmitStatus({
        show: true,
        isError: true,
        message: 'Please specify your concern when selecting Other Concerns'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Add actual API call here
      // const feedbackData = {
      //   ...feedback,
      //   rating,
      //   residentId: resident.id,
      //   category: feedback.subject,
      //   subject: feedback.subject === 'Other Concerns' ? feedback.customSubject : feedback.subject
      // };
      // await submitFeedback(feedbackData);
      
      setSubmitStatus({
        show: true,
        isError: false,
        message: 'Thank you for your feedback! Your input helps us improve our services.'
      });

      // Clear form after successful submission
      setFeedback({
        name: resident.name,
        email: resident.email,
        subject: '',
        message: ''
      });
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({
        show: true,
        isError: true,
        message: 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show the status message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
              <p className="text-gray-600">Loading your information...</p>
            </div>
          ) : (
            <>
              {submitStatus.show && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.isError 
                    ? 'bg-red-50 text-red-800 border border-red-300' 
                    : 'bg-green-50 text-green-800 border border-green-300'
                }`}>
                  <p className="flex items-center gap-2">
                    {submitStatus.isError ? '❌' : '✅'} {submitStatus.message}
                  </p>
                </div>
              )}
              
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Submit Your Feedback</h2>
              <p className="text-gray-600 mb-8">Your feedback helps us improve our services for the community.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={feedback.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">@</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={feedback.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Feedback Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <select
                  name="subject"
                  value={feedback.subject}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="" disabled selected className="text-gray-500">
                    -- Select a feedback category --
                  </option>
                  {feedbackCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {feedback.subject === 'Other Concerns' && (
                <input
                  type="text"
                  name="customSubject"
                  value={feedback.customSubject || ''}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please specify your concern"
                  required={feedback.subject === 'Other Concerns'}
                />
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please share your thoughts..."
                required
              ></textarea>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <label className="text-sm font-medium text-gray-700">Rate your experience</label>
              <div className="flex space-x-1">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        className="transition-colors duration-200"
                        color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e5e7eb"}
                        size={24}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentFeedback;

 