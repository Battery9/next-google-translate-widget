# Google Translate Widget for NextJS/React
A React/Next.js component to integrate Google Translate Widget easily.

## ✨ Features
- ✅ Simple integration with React and Next.js
- 🌍 Supports multiple languages
- 🔄 Uses Google Translate's official widget
- ⚡ Automatically loads translation script
- 🎨 Customizable included languages

## ⚠️ Limitations
- 🏷 Displays Google Translate branding
- 🔧 Limited customization options due to Google Translate restrictions
## 📦 Installation

```bash
npm install next-google-translate-widget
# or
yarn add next-google-translate-widget
```

## 🚀 Usage/Examples
```tsx
"use client";
import GoogleTranslate from "next-google-translate-widget";

export default function App() {
  return <GoogleTranslate pageLanguage="en" includedLanguages="hi,en" />;
}
```

## ⚙️ Props
| Prop                | Type     | Default   | Description                           |
| ------------------- | -------- | --------- | ------------------------------------- |
| `pageLanguage`      | `string` | `"en"`    | The main language of the page.        |
| `includedLanguages` | `string` | `"hi,en"` | Comma-separated languages to include. |

## 🎥 Demo
[Live Demo](#)

## 🤝 Contributing
This package needs your contributions! Feel free to fork the repository and create a pull request. 🚀

**Your contributions make this project better. Thank you for your support! ❤️**

## 🧾 License

[MIT](https://choosealicense.com/licenses/mit/)