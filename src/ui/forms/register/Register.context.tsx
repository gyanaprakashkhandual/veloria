"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export interface RegisterFormValues {
  userName: string;
  userEmail: string;
  userPassword: string;
  confirmPassword: string;
}

export interface RegisterUIProps {
  onSubmit?: (values: RegisterFormValues) => void | Promise<void>;
  onSwitchToLogin?: () => void;
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  onMagicLinkLogin?: (email: string) => void | Promise<void>;

  isLoading?: boolean;
  isMagicLinkLoading?: boolean;
  error?: string;

  title?: string;
  subtitle?: string;
  submitLabel?: string;

  showSocialLogins?: boolean;
  showMagicLink?: boolean;

  showNameField?: boolean;
  showConfirmPassword?: boolean;

  passwordMinLength?: number;
  passwordValidation?: (password: string) => string | null;
  emailValidation?: (email: string) => string | null;

  className?: string;
  formClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  errorClassName?: string;
  socialButtonClassName?: string;
  containerClassName?: string;

  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  aboveSubmitSlot?: React.ReactNode;
  belowFormSlot?: React.ReactNode;
  socialLoginSlot?: React.ReactNode;
  aboveNameSlot?: React.ReactNode;

  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;

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

export function RegisterUI({
  onSubmit,
  onSwitchToLogin,
  onGoogleLogin,
  onGithubLogin,
  onMagicLinkLogin,

  isLoading = false,
  isMagicLinkLoading = false,
  error,

  title = "Create Account",
  subtitle = "Get started today",
  submitLabel = "Create Account",

  showSocialLogins = true,
  showMagicLink = true,

  showNameField = true,
  showConfirmPassword = true,

  passwordMinLength = 8,
  passwordValidation,
  emailValidation,

  className = "",
  formClassName = "",
  inputClassName = "",
  labelClassName = "",
  buttonClassName = "",
  errorClassName = "",
  socialButtonClassName = "",
  containerClassName = "",

  headerSlot,
  footerSlot,
  aboveSubmitSlot,
  belowFormSlot,
  socialLoginSlot,
  aboveNameSlot,

  nameLabel = "Full Name",
  namePlaceholder = "John Doe",
  emailLabel = "Email Address",
  emailPlaceholder = "contact@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "••••••••",
  confirmPasswordLabel = "Confirm Password",
  confirmPasswordPlaceholder = "••••••••",

  animationProps,

  inputSize = "md",
  variant = "default",
}: RegisterUIProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [internalError, setInternalError] = useState("");

  const defaultAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  };

  const animation = animationProps ?? defaultAnimation;

  const baseInput = `w-full pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all ${inputSizeMap[inputSize]} ${variantMap[variant]}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError("");

    if (showNameField && !userName) {
      setInternalError("Full name is required");
      return;
    }

    if (emailValidation) {
      const emailError = emailValidation(userEmail);
      if (emailError) {
        setInternalError(emailError);
        return;
      }
    }

    if (passwordValidation) {
      const pwdError = passwordValidation(userPassword);
      if (pwdError) {
        setInternalError(pwdError);
        return;
      }
    } else if (userPassword.length < passwordMinLength) {
      setInternalError(`Password must be at least ${passwordMinLength} characters`);
      return;
    }

    if (showConfirmPassword && userPassword !== confirmPassword) {
      setInternalError("Passwords do not match");
      return;
    }

    await onSubmit?.({ userName, userEmail, userPassword, confirmPassword });
  };

  const displayError = error || internalError;

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

      {displayError && (
        <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${errorClassName}`}>
          <p className="text-sm text-red-600">{displayError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-4 ${formClassName}`}>
        {aboveNameSlot}

        {showNameField && (
          <div>
            <label className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}>
              {nameLabel}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`${baseInput} ${inputClassName}`}
                placeholder={namePlaceholder}
                required={showNameField}
              />
            </div>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}>
            {emailLabel}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={`${baseInput} ${inputClassName}`}
              placeholder={emailPlaceholder}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}>
            {passwordLabel}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className={`${baseInput} pr-12 ${inputClassName}`}
              placeholder={passwordPlaceholder}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showConfirmPassword && (
          <div>
            <label className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}>
              {confirmPasswordLabel}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPasswordField ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${baseInput} pr-12 ${inputClassName}`}
                placeholder={confirmPasswordPlaceholder}
                required={showConfirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPasswordField ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

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

      {showSocialLogins && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {socialLoginSlot ?? (
            <div className={`grid gap-3 ${showMagicLink ? "grid-cols-3" : "grid-cols-2"}`}>
              {onGoogleLogin && (
                <button
                  type="button"
                  onClick={onGoogleLogin}
                  className={`w-full py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 ${socialButtonClassName}`}
                >
                  Google
                </button>
              )}
              {onGithubLogin && (
                <button
                  type="button"
                  onClick={onGithubLogin}
                  className={`w-full py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 ${socialButtonClassName}`}
                >
                  GitHub
                </button>
              )}
              {showMagicLink && onMagicLinkLogin && (
                <button
                  type="button"
                  onClick={() => onMagicLinkLogin(userEmail)}
                  disabled={isMagicLinkLoading}
                  className={`w-full py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${socialButtonClassName}`}
                >
                  <Mail className="w-4 h-4" />
                  Email Link
                </button>
              )}
            </div>
          )}
        </>
      )}

      {footerSlot ?? (
        onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-black cursor-pointer hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        )
      )}

      <div className={className} />
    </motion.div>
  );
}