<template>
  <transition name="slide-down" appear>
    <div class="px-4 sm:px-8 py-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center pr-4">
          <!-- Hamburder btn to show sidebar on mobile -->
          <BtnHamburger class="flex lg:hidden mr-4" @click="emit('toggleSidebar')" />

          <!-- Projects dropdown -->
          <HeaderSelectProject />
        </div>
        <n-space align="center" :size="32">
          <div v-if="isFeatureEnabled(Feature.SEARCH)" class="w-[20vw] max-w-xs">
            <n-input
              type="text"
              name="search"
              size="small"
              class="bg-grey-lightBg"
              placeholder="Search the docs"
            />
          </div>
          <HeaderProfile />
        </n-space>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const emit = defineEmits(['toggleSidebar']);
</script>
