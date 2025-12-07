import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { ToastProps, ToastType } from '../types/toast'

export const Toast = ({ type, message, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 4000);
    return () => clearTimeout(timer);
  }, []);

  const icons: Record<ToastType, React.ReactElement> = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: "border-l-green-600",
    error: "border-l-red-600",
    warning: "border-l-yellow-600",
    info: "border-l-blue-600",
  };

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-4 rounded-lg 
        bg-white border-l-4 ${borderColors[type]}
        shadow-lg
        transition-all duration-300 
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0 animate-slideIn"}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-900 leading-relaxed">
        {message}
      </p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
