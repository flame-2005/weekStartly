import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastProps = {
  toasts: { id: number; message: string; type: string }[];
  removeToast: (id: number) => void;
};

const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-500",
          border: "border-green-400",
          icon: <CheckCircle className="w-5 h-5 text-white" />,
          shadow: "shadow-green-500/25"
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-500",
          border: "border-red-400",
          icon: <AlertCircle className="w-5 h-5 text-white" />,
          shadow: "shadow-red-500/25"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-800 to-gray-700",
          border: "border-gray-600",
          icon: <Info className="w-5 h-5 text-white" />,
          shadow: "shadow-gray-800/25"
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-w-sm w-full">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        
        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-5 py-4 rounded-xl border backdrop-blur-sm
              text-white shadow-xl transform transition-all duration-300
              hover:scale-[1.02] hover:shadow-2xl animate-in slide-in-from-right
              ${styles.bg} ${styles.border} ${styles.shadow}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {styles.icon}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed text-white/95">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 
                       transition-colors duration-200 focus:outline-none 
                       focus:ring-2 focus:ring-white/30 group"
            >
              <X className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;