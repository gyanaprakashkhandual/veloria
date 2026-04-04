"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import React, { useState } from "react";

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ForgotPasswordUIProps {
  onSubmit?: (values: ForgotPasswordFormValues) => void | Promise<void>;
  onBackToLogin?: () => void;

  isLoading?: boolean;
  error?: string;
  successMessage?: string;

  title?: string;
  subtitle?: string;
  submitLabel?: string;
  backLabel?: string;

  showSuccessState?: boolean;
  successTitle?: string;
  successSubtitle?: string;
  successSlot?: React.ReactNode;

  className?: string;
  formClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  containerClassName?: string;
  backLinkClassName?: string;

  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  aboveSubmitSlot?: React.ReactNode;
  belowFormSlot?: React.ReactNode;

  emailLabel?: string;
  emailPlaceholder?: string;

  animationProps?: {
    initial?: object;
    animate?: object;
    transition?: object;
  };

  inputSize?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled";
}

const inputSizeMap = {
  sm: "py-2 text-xs",
  md: "py-2.5 text-sm",
  lg: "py-3 text-base",
};

const variantMap = {
  default: "border border-gray-300 bg-white",
  outlined: "border-2 border-gray-400 bg-transparent",
  filled: "border border-transparent bg-gray-100",
};

export function ForgotPasswordUI({
  onSubmit,
  onBackToLogin,

  isLoading = false,
  error,
  successMessage,

  title = "Reset Password",
  subtitle = "Enter your email to receive a reset link",
  submitLabel = "Send Reset Link",
  backLabel = "Back to Sign In",

  showSuccessState = false,
  successTitle = "Check Your Email",
  successSubtitle = "We sent a password reset link to your email address.",
  successSlot,

  className = "",
  formClassName = "",
  inputClassName = "",
  labelClassName = "",
  buttonClassName = "",
  errorClassName = "",
  successClassName = "",
  containerClassName = "",
  backLinkClassName = "",

  headerSlot,
  footerSlot,
  aboveSubmitSlot,
  belowFormSlot,

  emailLabel = "Email Address",
  emailPlaceholder = "contact@example.com",

  animationProps,

  inputSize = "md",
  variant = "default",
}: ForgotPasswordUIProps) {
  const [email, setEmail] = useState("");

  const defaultAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  };

  const animation = animationProps ?? defaultAnimation;

  const baseInput = `w-full pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all ${inputSizeMap[inputSize]} ${variantMap[variant]}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.({ email });
  };

  if (showSuccessState) {
    return (
      <motion.div
        {...animation}
        className={`bg-white border border-gray-200 rounded-xl p-8 ${containerClassName}`}
      >
        {successSlot ?? (
          <div className={`text-center ${successClassName}`}>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{successTitle}</h2>
            <p className="text-gray-500 text-sm mb-6">{successSubtitle}</p>
            {successMessage && (
              <p className="text-sm text-green-600 mb-4">{successMessage}</p>
            )}
            {onBackToLogin && (
              <button
                onClick={onBackToLogin}
                className={`text-sm font-medium text-black hover:underline cursor-pointer ${backLinkClassName}`}
              >
                {backLabel}
              </button>
            )}
          </div>
        )}
        <div className={className} />
      </motion.div>
    );
  }

  return (
    <motion.div
      {...animation}
      className={`bg-white border border-gray-200 rounded-xl p-8 ${containerClassName}`}
    >
      {headerSlot ?? (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      )}

      {error && (
        <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${errorClassName}`}>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {successMessage && !showSuccessState && (
        <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-lg ${successClassName}`}>
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-4 ${formClassName}`}>
        <div>
          <label className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}>
            {emailLabel}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${baseInput} ${inputClassName}`}
              placeholder={emailPlaceholder}
              required
            />
          </div>
        </div>

        {aboveSubmitSlot}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
        >
          {isLoading ? <span>Loading...</span> : submitLabel}
        </button>
      </form>

      {belowFormSlot}

      {footerSlot ?? (
        onBackToLogin && (
          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className={`text-sm font-medium text-black cursor-pointer hover:underline ${backLinkClassName}`}
            >
              {backLabel}
            </button>
          </div>
        )
      )}

      <div className={className} />
    </motion.div>
  );
}