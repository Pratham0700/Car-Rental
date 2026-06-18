import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";

type CancelModalProps = {
  setconfirm: Dispatch<SetStateAction<boolean>>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
};

const CancelModal = ({
  setconfirm,
  title = "Confirm delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}: CancelModalProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleCancel = () => {
    setconfirm(false);
    onClose?.();
  };

  const handleConfirm = () => {
    setconfirm(true);
    onConfirm?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 ">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
