declare global {
  type ServiceTypeItem = {
    id: number | string;
    key: string;
    name: string;
    description: string;
    icon: string;
    link?: string;
    disabled?: boolean | null;
    usage?: String[];
  };
}

export default function useService() {
  const { t } = useI18n();
  const authStore = useAuthStore();

  const services = {
    authentication: ServiceType.AUTHENTICATION,
    computing: ServiceType.COMPUTING,
    hosting: ServiceType.HOSTING,
    nft: ServiceType.NFT,
    social: ServiceType.SOCIAL,
    storage: ServiceType.STORAGE,
  };

  /** Web3 Services */
  const web3Services: Array<ServiceTypeItem> = Object.entries(services).map(([service, id]) => {
    return {
      id,
      key: service,
      name: t(`dashboard.service.${service}.name`),
      description: t(`dashboard.service.${service}.description`),
      icon: `icon-${service}`,
      link: `dashboard-service-${service}`,
      disabled: !isFeatureEnabled(Feature[ServiceType[id]], authStore.getUserRoles()),
      usage: translateItems(`dashboard.service.${service}.usage`),
    };
  });

  return {
    web3Services,
  };
}
