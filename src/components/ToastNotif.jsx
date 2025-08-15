import { toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastTypes = { success: toast.success, error: toast.error, info: toast.info, warn: toast.warn };

const defaultOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    theme: "light",
    transition: Zoom,
};

export const showToast = (message, type = "success", options = {}) => {
    const toastFunc = toastTypes[type] || toast.success;
    toastFunc(message, { ...defaultOptions, ...options });
};
