/**
 * Translate text using Google Translate API (free)
 * Uses the unofficial Google Translate endpoint
 */

export const translateText = async (
  text: string,
  targetLang: "en" | "ja" | "vi",
): Promise<string> => {
  if (!text.trim()) return "";

  try {
    // Determine source language: if target is en, source is ja. Otherwise default source to en.
    const sourceLang = targetLang === "en" ? "ja" : "en";

    // Method 1: Using Google Translate gtx endpoint (Free and handles long text better)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text,
      )}`,
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();

    // The result is in data[0][i][0] for each segment
    if (data && data[0] && Array.isArray(data[0])) {
      return data[0].map((segment: any[]) => segment[0]).join("");
    } else {
      throw new Error("Invalid response format from translation API");
    }
  } catch (error) {
    console.warn("Google Translate failed, falling back to MyMemory:", error);

    // Fallback: MyMemory Translation API
    try {
      const sourceLang = targetLang === "en" ? "ja" : "en";
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text,
        )}&langpair=${sourceLang}|${targetLang}`,
      );

      if (!response.ok) throw new Error("MyMemory API error");

      const data = await response.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error("MyMemory translation failed");
      }
    } catch (fallbackError) {
      console.error("All translation methods failed:", fallbackError);
      throw new Error("Failed to translate text. Please try again.");
    }
  }
};

/**
 * Translate multiple fields at once
 */
export const translateFields = async (
    fields: Record<string, string>,
    targetLang: "en" | "ja" | "vi"
): Promise<Record<string, string>> => {
    const translated: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields)) {
        if (value && value.trim()) {
            // Skip translation for JSON strings to avoid breaking structure
            const trimmedValue = value.trim();
            if (trimmedValue.startsWith('[') || trimmedValue.startsWith('{')) {
                translated[key] = value;
                continue;
            }

            try {
                translated[key] = await translateText(value, targetLang);
                // Add small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to translate ${key}:`, error);
                translated[key] = value; // Keep original if translation fails
            }
        } else {
            translated[key] = "";
        }
    }

    return translated;
};
