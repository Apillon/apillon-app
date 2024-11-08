import type { MessageFunction, VueMessageType } from 'vue-i18n';

export type VueMsg = VueMessageType | MessageFunction<VueMessageType>;

export type SolutionContent = {
  headline?: string;
  title?: string;
  content?: string | string[];
  benefits?: string[];
  subtitle?: string;
};
type SolutionContentTrans = {
  headline?: VueMsg;
  title?: VueMsg;
  subtitle?: VueMsg;
  content?: VueMsg;
  benefits?: VueMsg;
};

export default function useSolution() {
  const { te, tm, rt } = useI18n();

  function generateContent(solution: string, BASE = 'dashboard.solution') {
    if (te(`${BASE}.${solution}.content`) || tm(`${BASE}.${solution}.content`)) {
      const translations = (tm(`${BASE}.${solution}.content`) as SolutionContentTrans[]) || [];

      return (
        (Array.isArray(translations) &&
          translations?.map(trans => {
            return {
              headline: trans.headline ? translate(trans.headline) : undefined,
              title: trans.title ? translate(trans.title) : undefined,
              subtitle: trans.subtitle ? translate(trans.subtitle) : undefined,
              content: trans.content ? translate(trans.content) : undefined,
              benefits: trans.benefits ? translate(trans.benefits) : undefined,
            } as SolutionContent;
          })) ||
        []
      );
    }
    return [];
  }

  function translate(trans: VueMsg): string | string[] {
    if (Array.isArray(trans)) {
      return trans.map(item => rt(item));
    }
    return rt(trans);
  }

  return {
    generateContent,
    translate,
  };
}
