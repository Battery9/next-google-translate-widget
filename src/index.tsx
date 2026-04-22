"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import "./styles.css";

interface GoogleTranslateElement {
  new (
    options: {
      pageLanguage: string;
      autoDisplay?: boolean;
    },
    elementId: string,
  ): void;
}

interface GoogleTranslate {
  translate: {
    TranslateElement: GoogleTranslateElement;
  };
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: GoogleTranslate;
  }
}

export interface LanguageOption {
  label: string;
  value: string;
  flag?: string;
}

export interface GoogleTranslateProps {
  /** BCP-47 language code of the source page. Default: "en" */
  pageLanguage?: string;
  /** List of languages to show in the dropdown. Default: English + Hindi */
  languages?: LanguageOption[];
  /** Called after language cookie is set, before page reload */
  onLanguageChange?: (lang: string) => void;
  /** Which side the dropdown menu aligns to. Default: "left" */
  menuAlign?: "left" | "right";
  /** Extra CSS class on the root container — use to override CSS variables for theming */
  className?: string;
}

export const LANGUAGES: LanguageOption[] = [
  { label: "English",              value: "en",    flag: "us" },
  { label: "Spanish",              value: "es",    flag: "es" },
  { label: "French",               value: "fr",    flag: "fr" },
  { label: "German",               value: "de",    flag: "de" },
  { label: "Portuguese",           value: "pt",    flag: "pt" },
  { label: "Italian",              value: "it",    flag: "it" },
  { label: "Dutch",                value: "nl",    flag: "nl" },
  { label: "Polish",               value: "pl",    flag: "pl" },
  { label: "Russian",              value: "ru",    flag: "ru" },
  { label: "Japanese",             value: "ja",    flag: "jp" },
  { label: "Korean",               value: "ko",    flag: "kr" },
  { label: "Chinese (Simplified)", value: "zh-CN", flag: "cn" },
  { label: "Chinese (Traditional)",value: "zh-TW", flag: "tw" },
  { label: "Arabic",               value: "ar",    flag: "sa" },
  { label: "Hindi",                value: "hi",    flag: "in" },
  { label: "Bengali",              value: "bn",    flag: "bd" },
  { label: "Turkish",              value: "tr",    flag: "tr" },
  { label: "Vietnamese",           value: "vi",    flag: "vn" },
  { label: "Thai",                 value: "th",    flag: "th" },
  { label: "Indonesian",           value: "id",    flag: "id" },
  { label: "Swahili",              value: "sw",    flag: "ke" },
  { label: "Ukrainian",            value: "uk",    flag: "ua" },
];

const defaultLanguages: LanguageOption[] = [
  { label: "English", value: "en", flag: "us" },
  { label: "Hindi",   value: "hi", flag: "in" },
];

const getFlagUrl = (code: string) =>
  `https://flagcdn.com/20x15/${code.toLowerCase()}.png`;

const setCookie = (name: string, value: string, domain?: string, path = "/") => {
  document.cookie = `${name}=${value}${domain ? `;domain=${domain}` : ""};path=${path}`;
};

export function GoogleTranslate({
  pageLanguage = "en",
  languages = defaultLanguages,
  onLanguageChange,
  menuAlign = "left",
  className,
}: GoogleTranslateProps) {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ngt_lang");
    setCurrentLang(saved || pageLanguage);
  }, [pageLanguage]);

  // Load Google Translate script
  useEffect(() => {
    // Remount case: widget API already available — re-instantiate directly
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        { pageLanguage, autoDisplay: false },
        "google_translate_element",
      );
      setIsLoading(false);
      return;
    }

    // Script tag exists but API not ready yet — callback will fire on its own
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage, autoDisplay: false },
        "google_translate_element",
      );
      setIsLoading(false);
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      console.error("[next-google-translate-widget] Failed to load Google Translate script");
      setIsLoading(false);
    };

    document.body.appendChild(script);
  }, [pageLanguage]);

  // Hide Google top bar — MutationObserver alone is sufficient, no polling needed
  useEffect(() => {
    if (document.getElementById("ngt-style")) return;

    const style = document.createElement("style");
    style.id = "ngt-style";
    style.textContent = `
      .skiptranslate { display: none !important; }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);

    const removeBanner = () => {
      document.querySelector(".goog-te-banner-frame")?.remove();
      document.body.style.top = "0px";
      document.querySelectorAll("skiptranslate").forEach((el) => el.remove());
    };

    removeBanner();

    const observer = new MutationObserver(removeBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.getElementById("ngt-style")?.remove();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeLanguage = (lang: string) => {
    setOpen(false);
    if (currentLang === lang) return;

    const cookieValue = `/auto/${lang}`;
    setCookie("googtrans", cookieValue);
    setCookie("googtrans", cookieValue, window.location.hostname);
    localStorage.setItem("ngt_lang", lang);
    setCurrentLang(lang);

    onLanguageChange?.(lang);
    window.location.reload();
  };

  const { current, currentFlag } = useMemo(() => {
    const current = languages.find((l) => l.value === currentLang);
    return { current, currentFlag: current?.flag ? getFlagUrl(current.flag) : null };
  }, [languages, currentLang]);

  if (!currentLang)
    return (
      <div className={`ngtContainer notranslate${className ? ` ${className}` : ""}`} translate="no">
        <button className="ngtButton" disabled>
          <span className="ngtSpinner" />
          <span>Loading...</span>
        </button>
      </div>
    );

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      <div
        ref={dropdownRef}
        className={`ngtContainer notranslate${className ? ` ${className}` : ""}`}
        translate="no"
      >
        <button
          className="ngtButton"
          onClick={() => setOpen(!open)}
          aria-label="Select language"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={isLoading}
        >
          {currentFlag && (
            <img src={currentFlag} width={16} alt={`${current?.label} flag`} />
          )}
          <span>{current?.value.toUpperCase()}</span>
          <span className="ngtArrow" data-open={open || undefined}>▾</span>
        </button>

        {open && (
          <div
            className={`ngtMenu${menuAlign === "right" ? " ngtMenu--right" : ""}`}
            role="listbox"
          >
            {languages.map((lang) => {
              const flagSrc = lang.flag ? getFlagUrl(lang.flag) : null;
              const isActive = lang.value === currentLang;

              return (
                <div
                  key={lang.value}
                  className={`ngtOption ${isActive ? "ngtOptionActive" : ""}`}
                  onClick={() => changeLanguage(lang.value)}
                  role="option"
                  aria-selected={isActive}
                >
                  {flagSrc && (
                    <img src={flagSrc} width={16} height={12} alt="" />
                  )}
                  <span>{lang.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default GoogleTranslate;
