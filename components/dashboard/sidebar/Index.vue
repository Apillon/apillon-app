<template>
  <!-- Sidebar mask (page overlay for tablets that is used to close sidebar if user click on it) -->
  <div
    v-if="showOnMobile && !isLg"
    class="fixed left-0 top-0 w-full h-full z-1"
    @click="emit('toggleSidebar', false)"
  ></div>

  <!-- Sidebar -->
  <transition name="slide-left" appear>
    <div class="w-full min-h-full transition-transform duration-300" :class="sidebarClasses">
      <n-scrollbar style="max-height: 100vh" class="scrollbar--menu">
        <!-- Close - only on mobile -->
        <button v-if="!isLg" class="absolute top-4 right-4" @click="emit('toggleSidebar', false)">
          <span class="icon-close text-grey"></span>
        </button>

        <n-space class="py-8" :size="32" vertical>
          <!-- LOGO -->
          <div class="flex justify-left px-8">
            <Logo />
          </div>

          <!-- PROJECTS & NEW PROJECT -->
          <div v-if="isFeatureEnabled(Feature.PROJECT)" class="px-8">
            <n-space :size="20" vertical>
              <!-- Projects dropdown -->
              <div class="min-h-[48px]">
                <SidebarSelectProject />
              </div>

              <!-- Create new project -->
              <Btn type="info" size="large" @click="showModalNewProject = true">
                {{ $t('project.new') }}
              </Btn>
            </n-space>
          </div>

          <!-- SIDEBAR NAVIGATION -->
          <MenuNav @toggleSidebar="hideNavOnMobile" />
        </n-space>

        <!-- SIDEBAR FOOTER -->
        <div class="flex flex-col p-8">
          <p class="text-sm text-body">
            {{ $t('general.copyrights') }}
            <span>{{ version }}</span>
          </p>
        </div>
      </n-scrollbar>
    </div>
  </transition>

  <!-- Modal - Create new project -->
  <modal v-model:show="showModalNewProject" :title="$t('project.new')">
    <FormProject @submit-success="showModalNewProject = false" />
  </modal>
</template>

<script lang="ts" setup>
import { useDataStore } from '~~/stores/data';

const props = defineProps({
  showOnMobile: { type: Boolean, default: false },
});

const { isLg } = useScreen();
const dataStore = useDataStore();
const showModalNewProject = ref(false);
const emit = defineEmits(['toggleSidebar']);

/** App version */
const config = useRuntimeConfig();
const version = ref(config.public.VERSION);

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      if (!dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT_ON_STARTUP)) {
        showModalNewProject.value = true;
      }
    });
  }, 100);
});

/** Classes */
const sidebarClasses = computed(() => {
  return [
    {
      'z-10 translate-x-0': props.showOnMobile && !isLg.value,
      'z-10 -translate-x-full': !props.showOnMobile && !isLg.value,
    },
  ];
});

/** Hide sidebar navigation on mobile if user open to different page */
function hideNavOnMobile() {
  if (!isLg.value) {
    emit('toggleSidebar');
  }
}
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply min-h-full flex flex-col justify-between;
}
</style>
