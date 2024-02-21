type ServiceTypeItem = {
  id: number;
  name: string;
  icon: string;
  link: string;
  disabled?: boolean | null;
  usage: String[];
};

export default function useService() {
  const authStore = useAuthStore();

  /** Web3 Services */
  const web3Services: Array<ServiceTypeItem> = [
    {
      id: ServiceType.STORAGE,
      name: 'storage',
      icon: 'icon-storage',
      link: 'dashboard-service-storage',
      disabled: !isFeatureEnabled(Feature.STORAGE, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.storage.usage'),
    },
    {
      id: ServiceType.HOSTING,
      name: 'hosting',
      icon: 'icon-hosting',
      link: 'dashboard-service-hosting',
      disabled: !isFeatureEnabled(Feature.HOSTING, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.hosting.usage'),
    },
    {
      id: ServiceType.AUTHENTICATION,
      name: 'authentication',
      icon: 'icon-authentication',
      link: 'dashboard-service-authentication',
      disabled: !isFeatureEnabled(Feature.AUTHENTICATION, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.authentication.usage'),
    },
    {
      id: ServiceType.NFT,
      name: 'nft',
      icon: 'icon-nft',
      link: 'dashboard-service-nft',
      disabled: !isFeatureEnabled(Feature.NFT, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.nft.usage'),
    },
    {
      id: ServiceType.COMPUTING,
      name: 'computing',
      icon: 'icon-computing',
      link: 'dashboard-service-computing',
      disabled: !isFeatureEnabled(Feature.COMPUTING, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.computing.usage'),
    },
    {
      id: ServiceType.SOCIAL,
      name: 'social',
      icon: 'icon-social',
      link: 'dashboard-service-social',
      disabled: !isFeatureEnabled(Feature.SOCIAL, authStore.getUserRoles()),
      usage: translateItems('dashboard.service.social.usage'),
    },
  ];

  return {
    web3Services,
  };
}
