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
  const { te, tm, rt } = useI18n();
  const simpletStore = useSimpletStore();

  let simpletsInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(simpletsInterval);
  });

  const simplets: Record<SimpletType, SimpletName> = {
    [SimpletType.AIRDROP]: SimpletName.AIRDROP,
    [SimpletType.POAP]: SimpletName.POAP,
    [SimpletType.FREE_MINT]: SimpletName.FREE_MINT,
  };

  const simpletNames: Record<SimpletName, SimpletType> = {
    [SimpletName.AIRDROP]: SimpletType.AIRDROP,
    [SimpletName.POAP]: SimpletType.POAP,
    [SimpletName.FREE_MINT]: SimpletType.FREE_MINT,
  };

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

  /** Simplet polling */
  function checkUnfinishedSimplets(archive = false) {
    clearInterval(simpletsInterval);

    const unfinishedSimplet = simpletStore.items.find(
      simplet => Math.min(simplet.backendStatus, simplet.frontendStatus) < ResourceStatus.ONLINE
    );
    if (unfinishedSimplet === undefined) return;

    simpletsInterval = setInterval(async () => {
      const simplets = await simpletStore.fetchSimplets(
        simpletStore.pagination.page,
        simpletStore.pagination.pageSize,
        archive,
        false
      );
      const simplet = simplets.find(simplet => simplet.simpletDeploy_uuid === unfinishedSimplet.simpletDeploy_uuid);
      if (!simplet || Math.min(simplet.backendStatus, simplet.frontendStatus) >= ResourceStatus.ONLINE) {
        clearInterval(simpletsInterval);
      }
    }, 10000);
  }

  return {
    simplets,
    simpletNames,
    checkUnfinishedSimplets,
    generateContent,
    translate,
  };
}
