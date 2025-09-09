import React from "react";
import { X } from "lucide-react";

type ToastProps = {
  toasts: { id: number; message: string; type: string }[];
  removeToast: (id: number) => void;
};

const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between px-4 py-2 rounded shadow-md text-white 
            ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-gray-800"
            }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)}>
            <X size={16} className="ml-2 hover:opacity-80" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
