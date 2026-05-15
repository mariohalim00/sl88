import { useState } from "react";
import { GlobeIcon } from "lucide-react";

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<"en" | "id">("en");

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase text-[#504533] hover:text-[#1c1c15] transition-colors"
        aria-label="Language selection"
      >
        <GlobeIcon className="size-4" />
        <span>{language.toUpperCase()}</span>
      </button>

      <div className="absolute top-full right-0 mt-2 hidden rounded-lg bg-white border border-[#d4c4ac] shadow-lg group-hover:block">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`block w-full px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide transition-colors ${
            language === "en"
              ? "bg-[#f4b400] text-[#1c1c15]"
              : "text-[#504533] hover:bg-[#f7f4e9]"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("id")}
          className={`block w-full px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide transition-colors border-t border-[#d4c4ac] ${
            language === "id"
              ? "bg-[#f4b400] text-[#1c1c15]"
              : "text-[#504533] hover:bg-[#f7f4e9]"
          }`}
        >
          Bahasa
        </button>
      </div>
    </div>
  );
}
