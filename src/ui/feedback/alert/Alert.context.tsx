/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

export type AlertType = "success" | "error" | "warning" | "info" | "message";
export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "auto";

export interface AlertConfig {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  position?: AlertPosition;
  showCloseButton?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  link?: {
    label: string;
    href: string;
  };
  customClassName?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

interface AlertContextType {
  alerts: AlertConfig[];
  addAlert: (config: Omit<AlertConfig, "id">) => string;
  removeAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);

  const addAlert = useCallback((config: Omit<AlertConfig, "id">) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: AlertConfig = {
      ...config,
      id,
      duration: config.duration ?? 5000,
      position: config.position ?? "top-right",
      showCloseButton: config.showCloseButton !== false,
    };

    setAlerts((prev) => [...prev, newAlert]);

    if (newAlert.duration && newAlert.duration > 0) {
      return id;
    }

    return id;
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAll }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};
