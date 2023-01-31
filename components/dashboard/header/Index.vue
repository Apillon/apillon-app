<template>
  <transition name="slide-down" appear>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center pr-4">
          <!-- Hamburger btn to show sidebar on mobile -->
          <BtnHamburger class="flex lg:hidden mr-4" @click="emit('toggleSidebar')" />

          <!-- Search docs -->
          <div v-if="isFeatureEnabled(Feature.SEARCH, authStore.getUserRoles())" class="w-[20vw] max-w-xs">
            <n-input
              type="text"
              name="search"
              size="small"
              :placeholder="$t('dashboard.searchDocs')"
              clearable
            >
              <template #prefix>
                <span class="icon-search text-bodyDark text-xl"></span>
              </template>
            </n-input>
          </div>
        </div>
        <!-- User profile -->
        <HeaderProfile />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const emit = defineEmits(['toggleSidebar']);
const authStore = useAuthStore();
</script>
