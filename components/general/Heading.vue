<template>
  <!-- Heading template -->
  <div
    class="relative -mx-4 flex min-h-17 flex-col justify-end gap-2 px-4 text-sm sm:-mx-8 sm:px-8"
    :class="{ 'bg-bg-light/65': dataStore.project.selected }"
  >
    <div v-if="back && isLg" class="absolute -top-2 left-8 -translate-y-full">
      <NuxtLink :to="back">
        <span class="icon-back align-sub text-2xl"></span>
      </NuxtLink>
    </div>

    <div
      class="box-content flex min-h-12 w-full flex-wrap items-center justify-between gap-x-8 gap-y-2 sm:flex-nowrap"
      :class="{ 'pb-0': !!$slots?.submenu }"
    >
      <!-- Title - left side -->
      <slot>
        <div class="flex items-center gap-1">
          <NuxtLink v-if="back && !isLg" :to="back">
            <span class="icon-back align-sub text-xl"></span>
          </NuxtLink>
          <h3 v-if="headline">
            {{ headline }}
            <img v-if="beta" src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
          </h3>
          <template v-else>
            <small v-if="serviceName">{{ serviceName }}</small>
            <h5>
              <span v-if="serviceName">/</span>
              {{ name }}
            </h5>
            <img v-if="beta" src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
          </template>
        </div>
      </slot>

      <!-- Info bar - right side -->
      <template v-if="$slots.info">
        <!-- <div> </div> -->
        <slot name="info" class="align-self-end self-end" />
      </template>
    </div>

    <!-- Sub-menu -->
    <div class="flex justify-between">
      <div v-if="$slots.submenu || $slots.details" class="-mt-1 flex justify-between">
        <slot name="submenu" />
      </div>
      <div v-else></div>

      <div
        v-if="$slots.details || $slots.links || docs || technologies.length || info || $attrs.service"
        class="relative z-10"
        :class="[!$slots.info && !$slots.submenu ? '-mt-8' : '-mt-1', !!$slots.info ? 'bottom-1' : 'bottom-2']"
      >
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

    <PoweredBy v-if="technologies.length" :icons="technologies" />
    <PoweredBy
      v-else-if="[ServiceTypeName.HOSTING, ServiceTypeName.STORAGE].includes($attrs?.service as ServiceTypeName)"
      :icons="['logo/crust', 'library/python', 'library/javascript', 'library/nextjs']"
    />
    <PoweredBy v-else-if="$attrs?.service === ServiceTypeName.EMBEDDED_WALLET">
      <NuxtIcon name="logo/oasis_logo" class="icon-auto h-6 w-14 text-white" filled />
    </PoweredBy>
    <PoweredBy v-else-if="$attrs?.service === ServiceTypeName.NFT">
      <NftChains :chains="enumKeys(EvmChainMainnet)" />
    </PoweredBy>
    <hr v-if="technologies.length || $attrs?.service" class="my-10 border-bg-lighter" />

    <QuickLinks v-if="docs || $slots.links">
      <slot name="links" />
      <BtnDocumentation v-if="docs" :href="docs" />
    </QuickLinks>

    <slot name="detailsAdditional" />

    <template v-if="$slots.detailsIpfsGateway" #detailsIpfsGateway>
      <slot name="detailsIpfsGateway" />
    </template>
    <template v-if="$slots.detailsGenerate" #detailsGenerate>
      <slot name="detailsGenerate" />
    </template>

    <Notification v-if="info" type="warning" class="mt-10 w-full">
      {{ info }}
    </Notification>
  </SidebarDetails>
</template>

<script lang="ts" setup>
defineProps({
  back: { type: [String, Object], default: null },
  beta: { type: Boolean, default: false },
  docs: { type: String, default: null },
  headline: { type: String, default: null },
  info: { type: String, default: null },
  name: { type: String, default: null },
  serviceName: { type: String, default: null },
  technologies: { type: Array<string>, default: [] },
});
const { isLg } = useScreen();
const dataStore = useDataStore();

const modalDetailsVisible = ref<boolean>(false);
</script>
