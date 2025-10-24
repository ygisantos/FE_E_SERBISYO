import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  prevStep, 
  nextStep, 
  handleSubmit, 
  isLoading, 
  isValid 
}) => {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(true);  
  useEffect(() => {
    const handler = (e) => {
      setTermsAccepted(Boolean(e?.detail?.accepted));
    };
    window.addEventListener('terms:changed', handler);
    return () => window.removeEventListener('terms:changed', handler);
  }, []);

  const handleFormSubmit = async () => {
    try {
      const success = await handleSubmit();
      if (success) {
        // Add delay before navigation
        setTimeout(() => {
          navigate('/');
        }, 3000); // 3 second delay
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${
          currentStep === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {currentStep === totalSteps ? (
        <button
          type="button"
          onClick={handleFormSubmit}
          disabled={!isValid || isLoading || !termsAccepted}
          className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-bold transition-all duration-200 text-white cursor-pointer ${
            isValid && !isLoading && termsAccepted
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed opacity-75'
          }`}
        >
          {isLoading ? 'Submitting...' : (!termsAccepted ? 'Accept Terms' : 'Submit')}
        </button>
      ) : (
        <button
          type="button"
          onClick={nextStep}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
