type Statistics = {
  totalProjects: number;
  totalUsers: number;
  totalWalletTransactions: number;
};
type StatisticsResponse = GeneralResponse<Statistics>;

const stats = reactive({
  totalUsers: '85,000+',
  totalProjects: '67,000+',
  totalWalletTransactions: '61,000+',
});

const roundedNumber = (num: number) => `${num > 1000 ? `${Math.floor(num / 1000)}K+` : num}`;

export default function useStatistics() {
  const statistics = computed(() => [
    {
      name: 'Builders',
      value: stats.totalUsers,
    },
    {
      name: 'Web3 projects',
      value: stats.totalProjects,
    },
    {
      name: 'Transactions',
      value: stats.totalWalletTransactions,
    },
  ]);

  onMounted(() => {
    if (stats.totalUsers === '85,000+') {
      fetchPlatformStatistics();
    }
  });

  async function fetchPlatformStatistics() {
    try {
      const { data } = await $api.get<StatisticsResponse>(endpoints.statistics);

      stats.totalUsers = roundedNumber(data.totalUsers);
      stats.totalProjects = roundedNumber(data.totalProjects);
      stats.totalWalletTransactions = roundedNumber(data.totalWalletTransactions);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    statistics,
  };
}
