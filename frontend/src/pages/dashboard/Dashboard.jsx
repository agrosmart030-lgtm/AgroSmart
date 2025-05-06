import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Link to="/" className="text-blue-500 underline">Voltar para Home</Link>
    </div>
  );
}

export default Dashboard;
