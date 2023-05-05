import { toast } from "react-toastify";

export const showSuccessToast = (message, autoClose) => {
  toast.success(message, {
    position: "top-center",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const showErrorToast = (message, autoClose) => {
  toast.error(message, {
    position: "top-center",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const showInfoToast = (message, autoClose) => {
  toast.info(message, {
    position: "top-center",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
