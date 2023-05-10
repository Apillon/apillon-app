<template>
  <transition name="slide-down" appear>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center pr-4">
          <!-- Hamburger btn to show sidebar on mobile -->
          <BtnHamburger class="flex lg:hidden mr-4" @click="emit('toggleSidebar')" />

          <!-- Search docs -->
          <div
            v-if="isFeatureEnabled(Feature.SEARCH, authStore.getUserRoles())"
            class="w-[20vw] max-w-xs"
          >
            <a
              class="flex items-center"
              href="https://wiki.apillon.io/build/3-apillon-api.html"
              target="_blank"
            >
              <n-input
                type="text"
                name="search"
                size="small"
                :placeholder="$t('dashboard.searchDocs')"
                clearable
              >
                <template #prefix>
                  <span class="icon-search text-2xl text-bodyDark"></span>
                </template>
              </n-input>
            </a>
          </div>
          <div class="w-[20vw] max-w-xs">
            <a
              class="flex items-center"
              href="https://wiki.apillon.io/build/3-apillon-api.html"
              target="_blank"
            >
              <n-button size="small" :bordered="false">
                <span class="icon-file text-xl mr-2"></span>
                {{ $t('dashboard.readDocs') }}
              </n-button>
            </a>
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
