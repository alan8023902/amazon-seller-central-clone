
import { useStore } from '../store';
import { translations, LangType } from '../i18n';

export const useI18n = () => {
  const language = useStore(state => state.session.language) as LangType;
  const t = (key: keyof typeof translations['zh-CN']) => {
    return translations[language][key] || key;
  };
  return { t, language };
};
