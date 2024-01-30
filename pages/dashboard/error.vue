<template>
  <Dashboard class="bg-bg">
    <template #heading>
      <n-space :size="24" align="center" class="h-12">
        <h4 class="">{{ $t('general.error') }}</h4>
        <div class="w-[1px] h-[13px] bg-white"></div>
        <strong class="body-sm">{{ $t('error.404') }}</strong>
      </n-space>
    </template>
    <slot>
      <div
        class="flex justify-center items-center relative pt-8 px-4"
        style="height: calc(100dvh - 88px)"
      >
        <div class="text-center">
          <!-- customise 404 message from template section -->
          <n-h4>{{ $t('error.404') }}</n-h4>

          <!-- Redirect to home page -->
          <NuxtLink :to="{ name: 'dashboard' }">
            <Btn type="secondary">
              {{ $t('general.goHome') }}
            </Btn>
          </NuxtLink>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('dashboard.error'),
});
</script>
