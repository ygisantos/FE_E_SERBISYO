import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

const toastTypeStyles = {
  success: {
    bg: "!bg-green-50",
    text: "!text-green-900",
    border: "!border-green-400",
    icon: <FiCheckCircle className="text-green-500 text-xl mr-2" />,
  },
  error: {
    bg: "!bg-red-50",
    text: "!text-red-900",
    border: "!border-red-400",
    icon: <FiXCircle className="text-red-500 text-xl mr-2" />,
  },
  info: {
    bg: "!bg-blue-50",
    text: "!text-blue-900",
    border: "!border-blue-400",
    icon: <FiInfo className="text-blue-500 text-xl mr-2" />,
  },
  default: {
    bg: "!bg-white",
    text: "!text-[var(--color-secondary)]",
    border: "!border-[var(--color-accent)]",
    icon: <FiInfo className="text-[var(--color-secondary)] text-xl mr-2" />,
  },
};

// Toast Styles
export const showCustomToast = (message, type = "success") => {
  const style = toastTypeStyles[type] || toastTypeStyles.default;
  toast[type](message, {
    className: `${style.bg} ${style.text} !rounded-xl !font-semibold !shadow-lg !border-l-4 ${style.border} !px-3 sm:!px-6 !py-3 sm:!py-4 !max-w-[90vw] sm:!max-w-xs md:!max-w-sm !text-xs sm:!text-sm`,
    bodyClassName: "flex items-center gap-2 !text-xs sm:!text-sm",
    progressClassName: "!bg-[var(--color-accent)]",
    icon: style.icon,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const CustomToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={true}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    toastClassName={(context) => {
      const style = toastTypeStyles[context?.type] || toastTypeStyles.default;
      return `${style.bg} ${style.text} !rounded-xl !font-semibold !shadow-lg !border-l-4 ${style.border} !px-3 sm:!px-6 !py-3 sm:!py-4 !max-w-[90vw] sm:!max-w-xs md:!max-w-sm !text-xs sm:!text-sm`;
    }}
    bodyClassName="flex items-center gap-2 !text-xs sm:!text-sm"
    progressClassName="!bg-[var(--color-accent)]"
  />
);

export default CustomToastContainer;
