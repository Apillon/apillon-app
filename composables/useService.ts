declare global {
  type ServiceTypeItem = {
    id: number | string;
    key: string;
    name: string;
    description: string;
    icon: string;
    iconSvg?: string;
    link?: string;
    disabled?: boolean | null;
    usage?: String[];
  };
}

export default function useService() {
  const { t } = useI18n();
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

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
      name: t(`dashboard.service.${service}.name`),
      description: t(`dashboard.service.${service}.description`),
      icon: generateIcon(service),
      iconSvg: generateSvgIcon(service),
      link: generateLink(service),
      disabled: !isFeatureEnabled(Feature[ServiceType[id]], authStore.getUserRoles()),
      usage: translateItems(`dashboard.service.${service}.usage`),
    };
  });

  const isDev = () => {
    return config.public.ENV === AppEnv.DEV || config.public.ENV === AppEnv.LOCAL;
  };

  return {
    web3Services,
    isDev,
  };
}
