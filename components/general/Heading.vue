<template>
  <!-- Heading template -->
  <div class="-mx-4 bg-bg-light/65 px-4 text-sm sm:-mx-8 sm:px-8">
    <n-space class="box-content min-h-[40px] pb-4" justify="space-between" align="center" :size="32" :wrap="!isSm">
      <!-- Title - left side -->
      <slot />

      <!-- Info bar - right side -->
      <template v-if="$slots.info">
        <slot name="info" />
      </template>
    </n-space>

    <!-- Sub-menu -->
    <div v-if="$slots.submenu || $slots.details" class="flex justify-between">
      <div v-if="$slots.submenu">
        <slot name="submenu" />
      </div>
      <div v-if="$slots.details" class="relative -top-1">
        <Btn
          type="secondary"
          inner-class="flex items-center gap-2 text-white-primary"
          :bordered="false"
          @click="modalDetailsVisible = true"
        >
          {{ $t('general.details') }}

          <NuxtIcon name="action/details" class="text-xl text-yellow" filled />
        </Btn>
      </div>
    </div>
  </div>

  <SidebarDetails v-model:show="modalDetailsVisible" v-bind="$attrs">
    <slot name="details" />

    <template v-if="technologies.length">
      <div class="flex items-center justify-between">
        <span class="text-xs">{{ $t('general.poweredBy') }}</span>
        <div class="flex items-center gap-2">
          <NuxtIcon v-for="tech in technologies" :key="tech" :name="`${tech}`" class="text-2xl" filled />
        </div>
      </div>
      <hr class="my-10 border-bg-lighter" />
    </template>
    <div v-if="docs || $slots.links" class="flex items-center justify-between">
      <span class="text-xs">{{ $t('dashboard.quickLinks') }}</span>
      <div class="flex items-center gap-4">
        <slot name="links" />
        <BtnDocumentation v-if="docs" :href="docs" />
      </div>
    </div>
    <slot name="detailsAdditional" />

    <Notification v-if="info" type="warning" class="mt-10 w-full">
      {{ info }}
    </Notification>
  </SidebarDetails>
</template>

<script lang="ts" setup>
defineProps({
  docs: { type: String, default: null },
  info: { type: String, default: null },
  technologies: { type: Array<string>, default: [] },
});
const { isSm } = useScreen();

const modalDetailsVisible = ref<boolean>(false);
</script>
