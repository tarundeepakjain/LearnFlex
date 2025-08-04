import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to LearnFlex!</h1>
      <p className="mt-4 text-gray-600">You are now signed in with Google ✅</p>
    </div>
  );
}

export default Dashboard;
