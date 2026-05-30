# Google Translate Widget for Next.js / React

A polished React/Next.js language switcher powered by Google Translate — custom glassmorphism dropdown, flag icons, dark mode, and zero API key required.

## ✨ Features

- 🎨 Custom dropdown UI — Google's default banner is completely hidden
- 🏳️ Flag icons via [flagcdn.com](https://flagcdn.com)
- 🌑 Automatic dark mode via `prefers-color-scheme`
- 🎨 CSS variable theming — override any color with a single `className`
- 🔀 `menuAlign` prop — align dropdown to `left` or `right`
- 🔔 `onLanguageChange` callback — hook in before the page reloads
- 🌍 22 built-in languages via the exported `LANGUAGES` constant
- 💾 Persistent selection across reloads via `localStorage`
- ✅ Supports React 17, 18, and 19

## 📦 Installation

```bash
npm install next-google-translate-widget
# or
bun add next-google-translate-widget
```

## 🚀 Quick Start

```tsx
"use client";
import "next-google-translate-widget/styles";
import GoogleTranslate from "next-google-translate-widget";

export default function Navbar() {
  return <GoogleTranslate pageLanguage="en" />;
}
```

<!-- > **Next.js App Router:** add `"use client"` to any component that renders `<GoogleTranslate />`. -->

## 🌍 Custom Language List

Use the built-in `LANGUAGES` constant and filter to what you need:

```tsx
"use client";
import "next-google-translate-widget/styles";
import GoogleTranslate, { LANGUAGES } from "next-google-translate-widget";

const langs = LANGUAGES.filter((l) =>
  ["en", "es", "fr", "de", "ar", "hi"].includes(l.value),
);

export default function Navbar() {
  return <GoogleTranslate pageLanguage="en" languages={langs} />;
}
```

Or pass a fully custom list with your own labels and flag codes:

```tsx
<GoogleTranslate
  pageLanguage="en"
  languages={[
    { label: "English", value: "en" }, // No Flag Icon.
    { label: "Français", value: "fr", flag: "fr" },
    { label: "日本語", value: "ja", flag: "jp" },
  ]}
/>
```

Flag codes follow [ISO 3166-1 alpha-2](https://flagcdn.com) (e.g. `"us"`, `"fr"`, `"jp"`). Omit `flag` to show no icon.

## ⚙️ Props

| Prop               | Type                     | Default         | Description                                              |
| ------------------ | ------------------------ | --------------- | -------------------------------------------------------- |
| `pageLanguage`     | `string`                 | `"en"`          | BCP-47 code of the page's source language.               |
| `languages`        | `LanguageOption[]`       | English + Hindi | Languages shown in the dropdown.                         |
| `menuAlign`        | `"left" \| "right"`      | `"left"`        | Which edge the dropdown aligns to.                       |
| `onLanguageChange` | `(lang: string) => void` | —               | Called after the cookie is set, before the page reloads. |
| `className`        | `string`                 | —               | Extra class on the root element — use for CSS theming.   |

### `LanguageOption`

```ts
interface LanguageOption {
  label: string; // displayed name
  value: string; // BCP-47 language code
  flag?: string; // ISO 3166-1 alpha-2 country code (optional)
}
```

## 🎨 Theming

Override the CSS variables via the `className` prop:

```css
/* globals.css */
.my-translate {
  --ngt-bg: rgba(15, 23, 42, 0.9);
  --ngt-bg-hover: rgba(30, 41, 59, 0.95);
  --ngt-border: rgba(255, 255, 255, 0.1);
  --ngt-text: #e2e8f0;
  --ngt-menu-bg: rgba(15, 23, 42, 0.85);
  --ngt-menu-border: rgba(255, 255, 255, 0.08);
  --ngt-active-bg: rgba(139, 92, 246, 0.3);
}
```

```tsx
<GoogleTranslate className="my-translate" pageLanguage="en" />
```

| Variable                 | Default (light)          | Purpose                   |
| ------------------------ | ------------------------ | ------------------------- |
| `--ngt-bg`               | `rgba(255,255,255,0.6)`  | Button background         |
| `--ngt-bg-hover`         | `rgba(255,255,255,0.8)`  | Button hover background   |
| `--ngt-border`           | `rgba(255,255,255,0.3)`  | Button border             |
| `--ngt-text`             | `#111`                   | Text color                |
| `--ngt-menu-bg`          | `rgba(255,255,255,0.65)` | Dropdown background       |
| `--ngt-menu-border`      | `rgba(255,255,255,0.25)` | Dropdown border           |
| `--ngt-active-bg`        | `rgba(99,102,241,0.15)`  | Active language highlight |
| `--ngt-disabled-opacity` | `0.6`                    | Opacity while loading     |

## 🗂 Built-in Languages

The exported `LANGUAGES` array includes:

English · Spanish · French · German · Portuguese · Italian · Dutch · Polish · Russian · Japanese · Korean · Chinese (Simplified) · Chinese (Traditional) · Arabic · Hindi · Bengali · Turkish · Vietnamese · Thai · Indonesian · Swahili · Ukrainian

## ⚙️ How it works

The component loads Google's translate script and mounts the widget in a hidden `<div>`. When a language is selected it writes the `googtrans` cookie (`/auto/{lang}`) and reloads the page — Google's script then translates the content on load. The selection is persisted in `localStorage`. No API key required.

## ⚠️ Limitations

- 🔄 Full page reload on every language change (required by Google Translate's cookie mechanism)
- 🌐 Translation quality depends on Google's engine
- 🖥 Browser-only — uses `document`, `window`, and `localStorage`

## 🎥 Demo

[Live Demo](https://codesandbox.io/p/devbox/m8psjz)

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and open a pull request. 🚀

**Your contributions make this project better. Thank you for your support! ❤️**

## 🧾 License

[MIT](https://choosealicense.com/licenses/mit/)
