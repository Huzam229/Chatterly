const ConfirmModal = ({ isOpen, onClose, onConfirm, friendName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-2xl p-6 w-80 shadow-xl flex flex-col items-center gap-4">
        <div className="text-4xl">🤔</div>
        <h3 className="text-lg font-bold text-center">Remove Friend?</h3>
        <p className="text-sm opacity-70 text-center">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-white">{friendName}</span> from
          your friends?
        </p>
        <div className="flex gap-3 w-full">
          <button className="btn btn-outline flex-1" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-warning flex-1" onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
