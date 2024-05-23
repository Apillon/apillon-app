const options = ref([
  { label: '10s', key: 0, value: 10 },
  { label: '20s', key: 1, value: 20 },
  { label: '30s', key: 2, value: 30 },
  { label: '40s', key: 3, value: 40 },
]);

const activeServices = ref([
  { title: 'Sch1', id: 0 },
  { title: 'Sch2', id: 1 },
  { title: 'Sch3', id: 2 },
]);

export default function useRefreshStatus() {
  const progressStep = ref(10);

  function log() {
    console.log('composable activated');
  }

  return {
    log,
    options,
    activeServices,
    progressStep,
  };
}
