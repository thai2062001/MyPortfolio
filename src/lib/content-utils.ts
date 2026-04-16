
export type SupportedLang = "en" | "ja" | "vi";

/**
 * Gets a localized field from a database object based on the current language.
 * Falls back to English if the specific language field is missing.
 */
export const getLocalizedField = <T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldBase: string,
  lang: SupportedLang
): string => {
  if (!obj) return "";

  const fieldKey = `${fieldBase}_${lang}`;
  const enKey = `${fieldBase}_en`;

  return obj[fieldKey] || obj[enKey] || obj[fieldBase] || "";
};

/**
 * Formats a date based on the locale
 */
export const formatLocalizedDate = (
  date: string | Date | null | undefined,
  lang: SupportedLang
): string => {
  if (!date) return "";
  const d = new Date(date);
  
  const locales: Record<SupportedLang, string> = {
    en: "en-US",
    ja: "ja-JP",
    vi: "vi-VN"
  };

  return d.toLocaleDateString(locales[lang], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

/**
 * Bulk extracts localized fields from an object
 */
export const getLocalizedFields = <T extends Record<string, any>>(
  obj: T | null | undefined,
  fields: string[],
  lang: SupportedLang
): Record<string, string> => {
  const result: Record<string, string> = {};
  fields.forEach(f => {
    result[f] = getLocalizedField(obj, f, lang);
  });
  return result;
};
