import React from "react";

const ResidentDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Resident Dashboard</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li>Claim your resident account</li>
        <li>Log in to your existing account</li>
        <li>Change your password</li>
        <li>Use the chatbot assistant</li>
        <li>Access your records</li>
        <li>Submit an incident report or complaint</li>
        <li>Fill out documents (e.g., barangay clearance)</li>
        <li>Track the status of your requests</li>
      </ul>
     </div>
  );
};

export default ResidentDashboard;
