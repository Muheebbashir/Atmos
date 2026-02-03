import type  {LogoutResponse}  from "../types/Logout";

function ConfirmLogout(props: LogoutResponse) {
    const { isOpen, title, onConfirm, onCancel, message } = props;
    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#282828] rounded-lg p-6 max-w-sm">
        <h2 className="text-white text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-[#404040] text-white hover:bg-[#505050] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    );
}

export default ConfirmLogout;