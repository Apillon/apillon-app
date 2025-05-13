<template>
  <!-- Heading template -->
  <div class="relative -mx-4 flex min-h-17 flex-col justify-end bg-bg-light/65 px-4 text-sm sm:-mx-8 sm:px-8">
    <div v-if="back && isLg" class="absolute -top-2 left-8 -translate-y-full">
      <NuxtLink :to="back">
        <span class="icon-back align-sub text-2xl"></span>
      </NuxtLink>
    </div>

    <n-space
      class="box-content min-h-[40px] w-full pb-2"
      :class="{ 'pb-4': !!$slots?.submenu }"
      justify="space-between"
      align="center"
      :size="32"
      :wrap="!isSm"
    >
      <!-- Title - left side -->
      <slot>
        <div class="flex items-center gap-1">
          <NuxtLink v-if="back && !isLg" :to="back">
            <span class="icon-back align-sub text-xl"></span>
          </NuxtLink>
          <small v-if="serviceName">{{ serviceName }}</small>
          <h5>
            <span v-if="serviceName">/</span>
            {{ name }}
          </h5>
        </div>
      </slot>

      <!-- Info bar - right side -->
      <template v-if="$slots.info">
        <slot name="info" />
      </template>
    </n-space>

    <!-- Sub-menu -->
    <div v-if="$slots.submenu || $slots.details" class="flex justify-between">
      <slot name="submenu" />
    </div>
    <div v-if="$slots.details" class="absolute bottom-2 right-4 sm:right-8">
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

  <SidebarDetails v-model:show="modalDetailsVisible" v-bind="$attrs">
    <slot name="details" />

    <template v-if="technologies.length">
      <PoweredBy :icons="technologies" />
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
  back: { type: [String, Object], default: null },
  docs: { type: String, default: null },
  info: { type: String, default: null },
  name: { type: String, default: null },
  serviceName: { type: String, default: null },
  technologies: { type: Array<string>, default: [] },
});
const { isSm, isLg } = useScreen();

const modalDetailsVisible = ref<boolean>(false);
</script>
