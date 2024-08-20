export default function useSmartContractsStore() {
  const formRef = ref<NFormInst | null>(null);
  const settings = ref([false, false, false, false]);
  const form = ref<{ [key: string]: any }>({
    name: '',
    description: '',
    chain: null,
  });

  const isSpecialField = (input: any) => input.name === '_dropStart';

  function addSettingsOption(e) {
    e.preventDefault();
    settings.value.push(false);
    console.log(settings);
  }

  function disablePastDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePastTime(ts: number) {
    return ts < Date.now();
  }

  return {
    formRef,
    form,
    settings,
    addSettingsOption,
    disablePastDate,
    disablePastTime,
    isSpecialField,
  };
}
