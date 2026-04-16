import { createContext, useContext, useState, ReactNode } from "react";
import { en } from "@/locales/en";
import { ja } from "@/locales/ja";
import { vi } from "@/locales/vi";

type Lang = "en" | "ja" | "vi";
const DEFAULT_LANG: Lang = "en";
const LANG_STORAGE_KEY = "preferred_language";
const SUPPORTED_LANGS: readonly Lang[] = ["en", "ja", "vi"] as const;

const translations = { en, ja, vi } as const;

const isLang = (value: string | null): value is Lang =>
  value !== null && SUPPORTED_LANGS.includes(value as Lang);

const getInitialLang = (): Lang => {
  if (typeof window === "undefined") {
    return DEFAULT_LANG;
  }

  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return isLang(saved) ? saved : DEFAULT_LANG;
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, ja: string, vi?: string) => string;
  translations: typeof translations;
}

const LangContext = createContext<LangContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (en) => en,
  translations,
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    }
  };

  const t = (en: string, ja: string, viContent?: string) => {
    switch (lang) {
      case "vi":
        return viContent || en;
      case "ja":
        return ja;
      case "en":
      default:
        return en;
    }
  };

  return (
    <LangContext.Provider
      value={{ lang, setLang: handleSetLang, t, translations }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
