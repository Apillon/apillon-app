<template>
  <div class="flex min-h-full flex-col justify-center text-center">
    <div class="mx-auto my-8 max-w-lg lg:my-16">
      <IconSuccess class="text-3xl" />
      <h4 class="mt-6">{{ $t('dashboard.simplet.wizard.deployed.title') }}</h4>
      <p>{{ $t('dashboard.simplet.wizard.deployed.info') }}</p>

      <div class="my-8 inline-block">
        <Btn size="large" :to="`/dashboard/simplets/${simpletsStore.active.simplet_uuid}`">
          {{ $t('dashboard.simplet.wizard.deployed.proceed') }}
        </Btn>
      </div>
    </div>
    <div class="mx-auto my-8 max-w-lg lg:my-16">
      <h6 class="mb-1">{{ $t('dashboard.simplet.wizard.deployed.domain') }}</h6>
      <i18n-t keypath="dashboard.simplet.wizard.deployed.addDomain" tag="p">
        <NuxtLink :to="`/dashboard/simplets/${simpletsStore.active.simplet_uuid}`" class="underline">
          {{ $t('dashboard.simplet.settings') }}
        </NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>

<script setup lang="ts">
const simpletsStore = useSimpletsStore();
</script>
