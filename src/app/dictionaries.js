import 'server-only'

const dictionaries = {
  // en: () => import('@/dictionaries/en.json').then((module) => module.default),
  // cn: () => import('@/dictionaries/cn.json').then((module) => module.default),
  en: async () => {
    const home = await import('@/dictionaries/en/home.json').then((module) => module.default)
    const brand = await import('@/dictionaries/en/brand.json').then((module) => module.default)
    return {
      home,
      brand,
    }
  },
  cn: async () => {
    const home = await import('@/dictionaries/cn/home.json').then((module) => module.default)
    const brand = await import('@/dictionaries/cn/brand.json').then((module) => module.default)
    return {
      home,
      brand,
    }
  },

}

export const getDictionary = async (locale) => dictionaries[locale]()
