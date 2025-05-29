import React from "react";

const UserTypeBadge = ({ type }) => {
  const colors = {
    agricultor: "bg-green-100 text-green-800",
    empresario: "bg-blue-100 text-blue-800",
    cooperativa: "bg-orange-100 text-orange-800",
  };

  const labels = {
    agricultor: "Agricultor",
    empresario: "Empresário",
    cooperativa: "Cooperativa",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}
    >
      {labels[type]}
    </span>
  );
};

export default UserTypeBadge;
