import React from 'react';

const RegistrationProgress = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs sm:text-sm font-medium text-red-600">
          {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
        <div 
          className="bg-gradient-to-r from-red-500 to-red-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out shadow-sm" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      
      {/* Step Labels - Desktop */}
      <div className="hidden sm:flex justify-between mt-2 text-xs text-gray-500">
        {['Account', 'Personal', 'Address', 'Additional', 'Proof of Identity', 'Review'].map((step, index) => (
          <span key={step} className={currentStep >= index + 1 ? 'text-red-600 font-medium' : ''}>
            {step}
          </span>
        ))}
      </div>

      {/* Step Labels - Mobile */}
      <div className="flex sm:hidden justify-center mt-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium">
          {['Account Information', 'Personal Details', 'Address Information', 
            'Additional Details', 'Identity Verification', 'Final Review'][currentStep - 1]}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
