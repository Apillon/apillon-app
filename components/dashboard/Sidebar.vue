<template>
  <!-- Sidebar mask (page overlay for tablets that is used to close sidebar if user click on it) -->
  <div
    v-if="showOnMobile && !isLg"
    class="fixed left-0 top-0 w-full h-full z-1"
    @click="emit('toggleSidebar', false)"
  ></div>

  <!-- Sidebar -->
  <transition name="slide-left" appear>
    <div
      class="absolute left-0 top-0 bottom-0 w-full sm:w-64 min-h-full bg-dark transition-transform duration-300"
      :class="sidebarClasses"
    >
      <n-scrollbar style="max-height: 100vh" class="scrollbar--menu">
        <!-- Close - only on mobile -->
        <button v-if="!isLg" class="absolute top-4 right-4" @click="emit('toggleSidebar', false)">
          <span class="icon-close text-grey"></span>
        </button>

        <n-space class="py-6" :size="24" vertical>
          <!-- LOGO -->
          <div class="flex justify-center">
            <Logo />
          </div>

          <!-- NEW PROJECT -->
          <div v-if="isFeatureEnabled(Feature.PROJECT)" class="text-center">
            <Btn type="builders" size="tiny" @click="showModalNewProject = true">
              {{ $t('project.new') }}
            </Btn>
          </div>

          <!-- PROJECT OVERVIEW -->
          <div class="pl-4 mt-6">
            <NuxtLink
              :to="{ name: 'dashboard' }"
              class="block p-2 h-[38px] w-full text-left border-primary"
              :class="{ 'bg-grey-dark border-l-3': currentRoute.name === 'dashboard' }"
              @click.native="hideNavOnMobile"
            >
              <span class="icon-home text-primary"></span>
              <strong class="ml-1">{{ $t('project.overview') }}</strong>
            </NuxtLink>
          </div>

          <!-- SIDEBAR NAVIGATION -->
          <SidebarNav class="pl-4" @toggleSidebar="hideNavOnMobile" />
        </n-space>

        <!-- SIDEBAR FOOTER -->
        <SidebarFooter />
      </n-scrollbar>
    </div>
  </transition>

  <!-- Modal - Create new project -->
  <n-modal v-model:show="showModalNewProject">
    <n-card
      style="width: 660px"
      :title="$t('project.new')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <FormProject @submit-success="showModalNewProject = false" />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { useDataStore } from '~~/stores/data';

const props = defineProps({
  showOnMobile: { type: Boolean, default: false },
});

const { isLg } = useScreen();
const emit = defineEmits(['toggleSidebar']);

const sidebarClasses = computed(() => {
  return [
    {
      'z-10 translate-x-0': props.showOnMobile && !isLg.value,
      'z-10 -translate-x-full': !props.showOnMobile && !isLg.value,
    },
  ];
});

const dataStore = useDataStore();
const { currentRoute } = useRouter();
const showModalNewProject = ref(false);

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    if (!dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT_ON_STARTUP)) {
      showModalNewProject.value = true;
    }
  });
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
