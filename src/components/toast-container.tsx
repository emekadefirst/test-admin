import { useEffect, useState } from "react";
import { Toast } from "./toast";
import { useToast } from "../contexts/toast-context";

export const ToastContainer = () => {
  const [isClient, setIsClient] = useState(false);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 w-96">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
