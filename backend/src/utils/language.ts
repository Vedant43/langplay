import { Language } from "@prisma/client"

export const getLanguageEnum = (lang: string): Language | null => {
    const languageMap: { [key: string]: Language } = {
        english: Language.ENGLISH,
        hindi: Language.HINDI,
        japanese: Language.JAPANESE,
        french: Language.FRENCH,
        spanish: Language.SPANISH,
        chinese: Language.CHINESE,
        german: Language.GERMAN,
    }

    return languageMap[lang?.toLowerCase()] || null
}
