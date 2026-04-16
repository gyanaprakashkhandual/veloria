/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useId } from "react";
import type { ButtonGroupProps } from "./Button.ui";

interface ButtonGroupContextValue {
  size?: ButtonGroupProps["size"];
  variant?: ButtonGroupProps["variant"];
  colorScheme?: ButtonGroupProps["colorScheme"];
  disabled?: boolean;
  orientation?: ButtonGroupProps["orientation"];
  spacing?: ButtonGroupProps["spacing"];
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export function ButtonGroupProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ButtonGroupContextValue;
}) {
  return (
    <ButtonGroupContext.Provider value={value}>
      {children}
    </ButtonGroupContext.Provider>
  );
}

export function useButtonGroup(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

interface ButtonPressedContextValue {
  isPressed: boolean;
  setIsPressed: (v: boolean) => void;
}

const ButtonPressedContext = createContext<ButtonPressedContextValue | null>(
  null,
);

export function ButtonPressedProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ButtonPressedContextValue;
}) {
  return (
    <ButtonPressedContext.Provider value={value}>
      {children}
    </ButtonPressedContext.Provider>
  );
}

export function useButtonPressed(): ButtonPressedContextValue | null {
  return useContext(ButtonPressedContext);
}

export function useButtonId(externalId?: string): string {
  const generated = useId();
  return externalId ?? `btn-${generated}`;
}
