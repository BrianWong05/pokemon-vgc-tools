function PopUp ({isOpen, onClose, children}) {
  console.log(isOpen)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose}></div>
      <div className="relative max-w-2xl p-0 bg-white rounded shadow-lg max-h-[calc(90vh)] overflow-auto">
        {children}
        <button
          className="mt-4 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PopUp