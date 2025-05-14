import type { MessageFunction, VueMessageType } from 'vue-i18n';

export type VueMsg = VueMessageType | MessageFunction<VueMessageType>;

export type SimpletContent = {
  headline?: string;
  title?: string;
  p?: string;
  content?: string | string[];
  benefits?: string[];
  subtitle?: string;
  border?: string;
};
type SimpletContentTrans = {
  headline?: VueMsg;
  title?: VueMsg;
  subtitle?: VueMsg;
  p?: VueMsg;
  content?: VueMsg;
  benefits?: VueMsg;
  border?: VueMsg;
};

export default function useSimplet() {
  const { t, te, tm, rt } = useI18n();
  const simpletStore = useSimpletStore();

  const simplets = {
    [SimpletType.AIRDROP]: SimpletName.AIRDROP,
    [SimpletType.POAP]: SimpletName.POAP,
    [SimpletType.FREE_MINT]: SimpletName.FREE_MINT,
  };

  const getSimpletType = (simplet_uuid: string) => {
    const simplet = simpletStore.templates.find(item => item.simplet_uuid === simplet_uuid)?.id || SimpletType.AIRDROP;
    return t(`simplet.${simplets[simplet]}.name`);
  };

  const simpletsContent: ServiceTypeItem[] = Object.entries(simplets).map(([id, simplet]) => {
    return {
      id,
      key: simplet,
      name: t(`simplet.${simplet}.name`),
      description: t(`simplet.${simplet}.description`),
      icon: `icon-${simplet}`,
      iconSvg: Number(id) !== SimpletType.POAP ? `menu/${simplet}` : '',
      usage: translateItems(`simplet.${simplet}.usage`),
    };
  });

  function generateContent(simplet: string, BASE = 'simplet') {
    if (te(`${BASE}.${simplet}.content`) || tm(`${BASE}.${simplet}.content`)) {
      const translations = (tm(`${BASE}.${simplet}.content`) as SimpletContentTrans[]) || [];

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
            } as SimpletContent;
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
    getSimpletType,
    translate,
  };
}
