"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

export interface ToastProps {
  title: string;
  message: string;
  variant?: "error" | "warning" | "success" | "info";
  duration?: number; // 持续时间(毫秒)
  onClose?: () => void;
  className?: string;
  isOpen?: boolean;
}

export function Toast({
  title,
  message,
  variant = "error",
  duration = 5000,
  onClose,
  className,
  isOpen = false,
}: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(isOpen);

  // 不同变体的样式配置
  const variantStyles = {
    error: {
      border: "border-red-700",
      bg: "bg-red-50",
      textColor: "text-red-700",
    },
    warning: {
      border: "border-yellow-700",
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    success: {
      border: "border-green-700",
      bg: "bg-green-50",
      textColor: "text-green-700",
    },
    info: {
      border: "border-blue-700",
      bg: "bg-blue-50",
      textColor: "text-blue-700",
    },
  };

  const styles = variantStyles[variant];

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setVisible(isOpen);
    
    if (isOpen && duration !== Infinity) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!mounted) return null;

  const toastContent = (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transform transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none",
        className
      )}
    >
      <div
        role="alert"
        className={cn(
          "border-s-4 p-4 shadow-lg rounded-md",
          styles.border,
          styles.bg
        )}
      >
        <div className={cn("flex items-center gap-2", styles.textColor)}>
          {variant === "error" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {variant === "warning" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {variant === "success" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {variant === "info" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          )}

          <strong className="font-medium">{title}</strong>

          <button
            onClick={handleClose}
            className="ml-auto hover:opacity-70"
            aria-label="关闭"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <p className={cn("mt-2 text-sm", styles.textColor)}>{message}</p>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
}

// Toast上下文提供者，用于管理全局Toast状态
interface ToastContextType {
  showToast: (props: Omit<ToastProps, "isOpen" | "onClose">) => void;
  hideToast: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (props: Omit<ToastProps, "isOpen" | "onClose">) => {
    setToast({ ...props, isOpen: true, onClose: () => setToast(null) });
  };

  const hideToast = () => {
    setToast((prev) => (prev ? { ...prev, isOpen: false } : null));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 