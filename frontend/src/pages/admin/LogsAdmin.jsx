import React from "react";
import Navbar from "../../componentes/navbar";

export default function LogsAdmin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-28">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">
          Tabelas Logs
        </h1>
        <p className="text-gray-600">
          Consulte os registros da página aqui.
        </p>
      </main>
    </div>
  );
}
