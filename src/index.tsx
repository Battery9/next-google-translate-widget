import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: unknown;
          },
          element: string,
        ) => void;
      };
    };
  }
}

interface GoogleTranslateProps {
  pageLanguage?: string;
  includedLanguages?: string;
}

const GoogleTranslate = ({
  pageLanguage = "en",
  includedLanguages = "hi,en",
}: GoogleTranslateProps) => {
  useEffect(() => {
    // Initialize Google Translate widget
    window.googleTranslateElementInit = function () {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: pageLanguage,
          includedLanguages: includedLanguages,
          layout: (window.google.translate.TranslateElement as any).InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // Inject Google Translate script
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
