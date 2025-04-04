<template>
  <div class="flex flex-grow flex-col">
    <div class="flex flex-col gap-2">
      <h4>
        {{ $t('rpc.apiKey.headline') }}
      </h4>
      <p>
        {{ $t('rpc.apiKey.description') }}
      </p>
      <div class="flex flex-row gap-4 text-body">
        {{ $t('general.poweredBy') }}
        <img src="/assets/images/rpc/Dwellir.png" class="h-6 w-auto object-contain" alt="Dwellir" />
      </div>
    </div>

    <ul class="mt-6 flex-grow overflow-y-auto">
      <li v-for="(benefit, keyB) in benefits" :key="keyB" class="my-2">
        <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl text-green" />
        <span>
          <strong v-if="benefit.bolded">{{ benefit.bolded }}</strong>
          {{ benefit.text }}
        </span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
const { tm, rt } = useI18n();

const benefits = computed(() => {
  const rawBenefits =
    (tm('rpc.initial.benefits') as {
      text?: string;
      bolded?: string;
    }[]) || [];

  return rawBenefits.map(benefit => ({
    text: benefit.text ? rt(benefit.text) : undefined,
    bolded: benefit.bolded ? rt(benefit.bolded) : undefined,
  }));
});
</script>
