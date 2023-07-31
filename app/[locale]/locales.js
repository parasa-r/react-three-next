
const locales = {
  en: () => import('../locales/en.json').then((module) => module.default),
  fr: () => import('../locales/fr.json').then((module) => module.default),
}
 
export const getDictionary = async (locale) => locales[locale]()