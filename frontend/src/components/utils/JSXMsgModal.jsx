import { createPortal } from "react-dom";

export const JSXMsgModal = ({ onCancel, onConfirm, message }) => {
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-50">
      <div className="dark:bg-dark-bgColor-300 relative w-80 flex-col rounded-3xl bg-white p-6 shadow-lg xl:w-96">
        <div className="flex flex-col">
          <div className="text-md flex flex-col items-center space-y-2">
            <div className="font-natural text-md my-5">{message}</div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <button className="normal-btn" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-btn" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the modal content in the portal (no need to consider z-index issues with parent components)
  return createPortal(modalContent, document.body);
};

export default JSXMsgModal;
