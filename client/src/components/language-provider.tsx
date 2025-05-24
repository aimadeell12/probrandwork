import { ReactNode } from "react";
import { LanguageContext, useLanguageHook } from "@/hooks/useLanguage";

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const languageValue = useLanguageHook();

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
}