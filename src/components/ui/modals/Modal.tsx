import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "visible";
    }

    return () => {
      window.document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="flex justify-center items-center fixed left-0 top-0 w-full h-full bg-[#00143480] z-40">
          <div
            ref={modalRef}
            className="
              relative bg-white w-[94%] sm:min-w-[500px]
              rounded-[32px] sm:max-w-[70%] md:max-w-[60%]
              no-scrollbar p-[12px] sm:p-[20px]
            "
          >
            {title && <p className="text-[24px] font-semibold text-center text-dark-blue">{title}</p>}
            {children}
          </div>
        </div>
      )}
    </>
  );
};