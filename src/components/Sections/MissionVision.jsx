import React from 'react';
import { FaLightbulb, FaEye } from 'react-icons/fa';

const MissionVision = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
          <div className="w-20 h-1 bg-red-900 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 flex flex-col h-full border border-red-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-900 rounded-lg">
                <FaEye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-900">Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed flex-grow">
              Ang Barangay Santol ay isang progresibo at maunlad na barangay na may handa at 
              nagkakaisang mamamayan at matalag na pamumuhay. Mayroong tahimik, matiwasay at 
              malinis na kapaligiran na pinangangasiwaaan ng mga tapat at masigasig na lingkod barangay.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 flex flex-col h-full border border-red-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-900 rounded-lg">
                <FaLightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-900">Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed flex-grow">
              Maisaayos at maipatupad ang lahat ng mga plano at programa ng barangay upang 
              maging matagumpay at kapaki-pakinabang para sa mga mamamayan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
