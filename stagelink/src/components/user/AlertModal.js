const AlertModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

   return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <p className="mb-4 text-base text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;