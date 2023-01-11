<template>
  <Dashboard>
    <template #heading>
      <n-space :size="24" align="center" class="h-12">
        <h4 class="">{{ $t('error.error') }}</h4>
        <div class="w-[1px] h-[13px] bg-white"></div>
        <strong class="body-sm font-button">{{ $t('error.404') }}</strong>
      </n-space>
    </template>
    <slot>
      <div>
        <!-- Redirect to home page -->
        <Btn type="primary" :to="{ name: 'dashboard' }">
          {{ $t('general.goHome') }}
        </Btn>
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
