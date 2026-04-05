import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type AlertConfig,
  type AlertPosition,
  useAlert,
} from "./Alert.context";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";


interface AlertItemProps {
  alert: AlertConfig;
  onClose: () => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onClose }) => {
  const typeConfig = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      messageColor: "text-green-700",
      actionBgColor: "bg-green-600 hover:bg-green-700",
      actionTextColor: "text-white",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
      actionBgColor: "bg-red-600 hover:bg-red-700",
      actionTextColor: "text-white",
      icon: <XCircle className="w-5 h-5" />,
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
      messageColor: "text-yellow-700",
      actionBgColor: "bg-yellow-600 hover:bg-yellow-700",
      actionTextColor: "text-white",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
      actionBgColor: "bg-blue-600 hover:bg-blue-700",
      actionTextColor: "text-white",
      icon: <Info className="w-5 h-5" />,
    },
    message: {
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      iconColor: "text-gray-600",
      titleColor: "text-gray-900",
      messageColor: "text-gray-700",
      actionBgColor: "bg-gray-600 hover:bg-gray-700",
      actionTextColor: "text-white",
      icon: <Info className="w-5 h-5" />,
    },
  };

  const config = typeConfig[alert.type];

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    return baseVariants;
  };

  return (
    <motion.div
      key={alert.id}
      variants={getAnimationVariants()}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-full max-w-md ${alert.customClassName || ""}`}
    >
      <div
        className={`
          relative border ${config.borderColor} rounded-lg shadow-lg
          ${config.bgColor} overflow-hidden transition-all duration-300
          hover:shadow-xl
        `}
      >

        <div className="p-4 flex gap-3 items-start">
          <div className={`shrink-0 ${config.iconColor} mt-0.5`}>
            {alert.icon || config.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-sm ${config.titleColor} wrap-break-word`}
            >
              {alert.title}
            </h3>
            {alert.message && (
              <p
                className={`text-sm mt-1 ${config.messageColor} wrap-break-word`}
              >
                {alert.message}
              </p>
            )}

            {(alert.action || alert.link) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {alert.action && (
                  <button
                    onClick={() => {
                      alert.action?.onClick();
                      onClose();
                    }}
                    className={`
                      text-xs font-medium px-3 py-1.5 rounded transition-colors whitespace-nowrap
                      ${config.actionBgColor} ${config.actionTextColor}
                    `}
                  >
                    {alert.action.label}
                  </button>
                )}
                {alert.link && (
                  <a
                    href={alert.link.href}
                    className={`
                      text-xs font-medium px-3 py-1.5 rounded transition-colors whitespace-nowrap
                      ${config.actionBgColor} ${config.actionTextColor}
                    `}
                  >
                    {alert.link.label}
                  </a>
                )}
              </div>
            )}
          </div>

          {alert.showCloseButton && (
            <button
              onClick={onClose}
              className={`shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
              aria-label="Close alert"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getPositionClasses = (position: AlertPosition): string => {
  const positionMap: Record<AlertPosition, string> = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "middle-left": "top-1/2 left-4 -translate-y-1/2",
    "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "middle-right": "top-1/2 right-4 -translate-y-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    auto: "top-4 right-4",
  };

  return positionMap[position];
};

const groupAlertsByPosition = (
  alerts: AlertConfig[],
): Record<AlertPosition, AlertConfig[]> => {
  const grouped: Record<AlertPosition, AlertConfig[]> = {
    "top-left": [],
    "top-center": [],
    "top-right": [],
    "middle-left": [],
    "middle-center": [],
    "middle-right": [],
    "bottom-left": [],
    "bottom-center": [],
    "bottom-right": [],
    auto: [],
  };

  alerts.forEach((alert) => {
    const position = alert.position || "top-right";
    grouped[position].push(alert);
  });

  return grouped;
};

export const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();
  const groupedAlerts = groupAlertsByPosition(alerts);

  return (
    <>
      {Object.entries(groupedAlerts).map(([position, positionAlerts]) =>
        positionAlerts.length > 0 ? (
          <div
            key={position}
            className={`fixed ${getPositionClasses(position as AlertPosition)} pointer-events-auto flex flex-col gap-3 z-50`}
          >
            <AnimatePresence>
              {positionAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onClose={() => {
                    removeAlert(alert.id);
                    alert.onClose?.();
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : null,
      )}
    </>
  );
};

export default AlertContainer;
