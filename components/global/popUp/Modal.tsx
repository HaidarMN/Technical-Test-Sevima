import { ModalType } from "@/src/types";
import React, { FC, useState } from "react";

const Modal: FC<ModalType> = ({ children, width = "lg", isOpen }) => {
  const getWidth = () => {
    switch (width) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        break;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex min-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 p-6">
          <div
            className={`flex max-h-full w-full flex-col gap-4 overflow-y-auto overflow-x-hidden ${getWidth()} animate__animated animate__zoomIn animate__fastest rounded-lg bg-white p-6`}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
