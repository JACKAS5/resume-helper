import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeToast, type Toast as ToastType } from '../../store/slices/uiSlice';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: ToastType }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const colors = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-900",
    error: "bg-red-50 border-red-100 text-red-900",
    info: "bg-blue-50 border-blue-100 text-blue-900",
    warning: "bg-amber-50 border-amber-100 text-amber-900",
  };

  return (
    <div className={cn(
      "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-full duration-300",
      colors[toast.type]
    )}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
}
