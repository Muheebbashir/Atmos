import type  {LogoutResponse}  from "../types/Logout";
import { AlertCircle } from "lucide-react";

function ConfirmLogout(props: LogoutResponse) {
    const { isOpen, title, onConfirm, onCancel, message } = props;
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fadeIn">
        <div 
          className="bg-[#282828] rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#404040] animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-3 text-center">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-400 mb-8 text-center text-sm sm:text-base leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-full bg-transparent border-2 border-gray-500 text-white hover:bg-white/10 hover:border-white transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all font-semibold shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}</style>
      </div>
    );
}

export default ConfirmLogout;