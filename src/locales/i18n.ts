import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Cookies from "js-cookie";

import id from "./id";
import en from "./en";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  id,
  en,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Cookies.get("locale") ?? "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
