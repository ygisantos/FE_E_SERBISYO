import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ icon, label, value, color = "bg-white border-gray-200", trend, percentage }) => (
  <div className={`${color} rounded-lg p-4 border hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-center justify-between mb-3">
      <div className="text-lg">{icon}</div>
      {typeof trend === 'number' && (
        <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}> 
          <TrendingUp className={`mr-1 w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(percentage)}%
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

export default StatCard;
