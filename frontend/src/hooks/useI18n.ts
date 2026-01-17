import { useStore } from "../store";
import { translations, LangType } from "../i18n";

// 你的 store 里目前用的是 "EN" / "ZH"，但 i18n 表用的是 "en-US" / "zh-CN"
// 这里做一次兼容映射，避免切换语言时崩溃。
const normalizeLang = (raw: unknown): LangType => {
  if (raw === "ZH") return "zh-CN";
  if (raw === "EN") return "en-US";
  if (raw === "zh-CN" || raw === "en-US") return raw;
  return "en-US";
};

export const useI18n = () => {
  const rawLanguage = useStore((state: any) => state?.session?.language);
  const language = normalizeLang(rawLanguage);

  const t = (key: keyof (typeof translations)["zh-CN"] | string, params?: Record<string, any>) => {
    // translations[language] 一定存在（normalizeLang 兜底）
    let translation = (translations[language] as any)?.[key] ?? key;
    
    // 替换参数
    if (params && typeof translation === 'string') {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
    return translation;
  };

  return { t, language };
};
