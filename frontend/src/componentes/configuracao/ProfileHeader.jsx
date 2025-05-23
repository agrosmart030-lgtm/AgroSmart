import React from "react";
import { MapPin, Building, Users, User } from "lucide-react";

export default function ProfileHeader({ usuario }) {
  const getTypeIcon = () => {
    switch (usuario.tipo_usuario) {
      case "agricultor":
        return <MapPin className="w-5 h-5" />;
      case "empresario":
        return <Building className="w-5 h-5" />;
      case "cooperativa":
        return <Users className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="px-6 py-8 border-b border-green-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {usuario.nome_completo
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {usuario.nome_completo}
            </h2>
            <p className="text-gray-600">{usuario.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                {getTypeIcon()}
                <span className="text-sm font-medium capitalize">
                  {usuario.tipo_usuario}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
