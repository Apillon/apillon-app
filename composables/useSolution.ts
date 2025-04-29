import type { MessageFunction, VueMessageType } from 'vue-i18n';

export type VueMsg = VueMessageType | MessageFunction<VueMessageType>;

export type SolutionContent = {
  headline?: string;
  title?: string;
  p?: string;
  content?: string | string[];
  benefits?: string[];
  subtitle?: string;
  border?: string;
};
type SolutionContentTrans = {
  headline?: VueMsg;
  title?: VueMsg;
  subtitle?: VueMsg;
  p?: VueMsg;
  content?: VueMsg;
  benefits?: VueMsg;
  border?: VueMsg;
};

export default function useSolution() {
  const { t, te, tm, rt } = useI18n();

  const simplets = {
    [SimpletType.AIRDROP]: SimpletName.AIRDROP,
    [SimpletType.POAP]: SimpletName.POAP,
    [SimpletType.FREE_MINT]: SimpletName.FREE_MINT,
  };

  const simpletsContent: ServiceTypeItem[] = Object.entries(simplets).map(([id, simplet]) => {
    return {
      id,
      key: simplet,
      name: t(`dashboard.simplet.${simplet}.name`),
      description: t(`dashboard.simplet.${simplet}.description`),
      icon: `icon-${simplet}`,
      iconSvg: Number(id) !== SimpletType.POAP ? `menu/${simplet}` : '',
      usage: translateItems(`dashboard.simplet.${simplet}.usage`),
    };
  });

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
              p: trans.p ? translate(trans.p) : undefined,
              content: trans.content ? translate(trans.content) : undefined,
              benefits: trans.benefits ? translate(trans.benefits) : undefined,
              border: trans.border ? translate(trans.border) : undefined,
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
    simplets,
    simpletsContent,
    generateContent,
    translate,
  };
}
