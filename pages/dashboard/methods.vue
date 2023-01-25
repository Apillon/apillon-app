<template>
  <Dashboard>
    <template #heading>
      <h4>Methods</h4>
    </template>
    <slot>
      <TableWeb3Methods />

      <Btn type="secondary" @click="showDrawerEmailConfiguration">
        {{ $t('dashboard.emailMethodConfiguration') }}
      </Btn>

      <!-- Drawer - Email method configuration -->
      <n-drawer v-model:show="drawerEmailConfigurationVisible" :width="495">
        <n-drawer-content>
          <template #header>
            <h5>{{ $t('dashboard.emailMethodConfiguration') }}</h5>
          </template>
          <FormEmailConfiguration />
        </n-drawer-content>
      </n-drawer>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
useHead({
  title: 'Dashboard (Methods)',
});

/**
 * Drawer - add payment
 */
const drawerEmailConfigurationVisible = ref(false);
const showDrawerEmailConfiguration = () => {
  drawerEmailConfigurationVisible.value = true;
};
</script>
