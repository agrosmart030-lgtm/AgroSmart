import React from "react";

const StatusBadge = ({ status }) => {
  const isActive = status === "ativo";
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
};

export default StatusBadge;
