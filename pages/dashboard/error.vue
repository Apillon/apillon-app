<template>
  <Dashboard class="bg-bg">
    <template #heading>
      <n-space :size="24" align="center" class="h-12">
        <h4 class="">{{ $t('general.error') }}</h4>
        <div class="h-[13px] w-[1px] bg-white"></div>
        <strong class="body-sm">{{ $t('error.404') }}</strong>
      </n-space>
    </template>
    <slot>
      <div class="relative flex items-center justify-center px-4 pt-8 lg:min-h-[75vh]">
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
