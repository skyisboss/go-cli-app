import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'

export const defaultLang: string = localStorage.getItem('lang') || 'zh'

const resources = {
  zh: {
    translation: zh,
  },
  en: {
    translation: en,
  },
}
i18n.use(initReactI18next).init({
  resources,
  lng: defaultLang,
  fallbackLng: defaultLang,
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
})

export default i18n
