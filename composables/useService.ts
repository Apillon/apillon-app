export type ServiceTypeItem = {
  id: ServiceType | SimpletType | number | string;
  key: string;
  name: string;
  description: string;
  icon: string;
  iconSvg?: string;
  link?: string;
  disabled?: boolean | null;
  usage?: string[];
};
export type OnboardingService = {
  key: string;
  name: string;
  description: string;
  link?: string;
  tags?: string[];
  codingRequired?: boolean;
};
type OnboardingServiceTrans = {
  title?: VueMsg;
  content?: VueMsg;
  tags?: VueMsg;
};
type IntroductionTrans = {
  title?: VueMsg;
  content?: VueMsg;
};
export type IntroductionContent = {
  title?: string;
  content?: string | string[];
};

export default function useService() {
  const { t, te, rt, tm } = useI18n();
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const { translate } = useSimplet();

  const services = {
    storage: ServiceType.STORAGE,
    hosting: ServiceType.HOSTING,
    embeddedWallet: ServiceType.EMBEDDED_WALLET,
    cloudFunctions: ServiceType.CLOUD_FUNCTIONS,
    rpc: ServiceType.RPC,
    indexing: ServiceType.INDEXING,
    nft: ServiceType.NFT,
    smartContracts: ServiceType.SMART_CONTRACTS,
    assetHub: ServiceType.ASSET_HUB,
    computing: ServiceType.COMPUTING,
    authentication: ServiceType.AUTHENTICATION,
    social: ServiceType.SOCIAL,
  };

  const generateLink = (service: string) => {
    switch (service) {
      case 'embeddedWallet':
        return 'dashboard-service-embedded-wallet';
      case 'cloudFunctions':
        return 'dashboard-service-cloud-functions';
      case 'smartContracts':
        return 'dashboard-service-smart-contracts';
      case 'assetHub':
        return 'dashboard-service-asset-hub';
      default:
        return `dashboard-service-${service}`;
    }
  };
  const generateIcon = (service: string) => {
    switch (service) {
      case 'embeddedWallet':
        return 'icon-wallet';
      case 'cloudFunctions':
        return 'icon-cloud-functions';
      case 'smartContracts':
        return 'icon-file';
      default:
        return `icon-${service}`;
    }
  };
  const generateSvgIcon = (service: string) => {
    switch (service) {
      case 'assetHub':
        return 'icon/asset-hub';
      default:
        return '';
    }
  };

  /** Web3 Services */
  const web3Services: ServiceTypeItem[] = Object.entries(services).map(([service, id]) => {
    return {
      id,
      key: service,
      name: t(`service.${service}.name`),
      description: t(`service.${service}.description`),
      icon: generateIcon(service),
      iconSvg: generateSvgIcon(service),
      link: generateLink(service),
      disabled: !isFeatureEnabled(Feature[ServiceType[id]], authStore.getUserRoles()),
      usage: translateItems(`service.${service}.usage`),
    };
  });

  const onboardingServices =
    Object.entries(tm('dashboard.onboarding.services') as Record<string, OnboardingServiceTrans>).map(
      ([key, trans]) => {
        return {
          key,
          link: generateLink(key),
          name: trans?.title ? rt(trans.title) : '',
          description: trans?.content ? rt(trans.content) : '',
          codingRequired: ['embedded-wallet', 'cloud-functions', 'smart-contracts'].includes(key),
        } as OnboardingService;
      }
    ) || [];

  function generateIntroduction(service: string, BASE = 'service') {
    if (te(`${BASE}.${service}.introduction`) || tm(`${BASE}.${service}.introduction`)) {
      const translations = (tm(`${BASE}.${service}.introduction`) as IntroductionTrans[]) || [];

      return (
        (Array.isArray(translations) &&
          translations?.map(trans => {
            return {
              title: trans.title ? translate(trans.title) : undefined,
              content: trans.content ? translate(trans.content) : undefined,
            } as IntroductionContent;
          })) ||
        []
      );
    }
    return [];
  }

  const isDev = () => {
    return config.public.ENV === AppEnv.DEV || config.public.ENV === AppEnv.LOCAL;
  };

  return {
    onboardingServices,
    web3Services,
    generateIntroduction,
    isDev,
  };
}
