<template>
  <!-- Sidebar mask (page overlay for tablets that is used to close sidebar if user click on it) -->
  <div
    v-if="showOnMobile && !isLg"
    class="fixed left-0 top-0 w-full h-full z-1"
    @click="emit('toggleSidebar', false)"
  ></div>

  <!-- Sidebar -->
  <transition name="slide-left" :appear="isLg || showOnMobile">
    <div class="h-screen bg-bg transition-transform duration-300" :class="sidebarClasses">
      <n-scrollbar :style="sidebarStyle" class="scrollbar--menu">
        <!-- Close - only on mobile -->
        <button
          v-if="!isLg"
          class="flex items-center justify-center absolute top-4 right-4 w-8 h-8 z-50"
          @click="emit('toggleSidebar', false)"
        >
          <span class="icon-close text-body"></span>
        </button>

        <n-space class="py-8" :size="32" vertical>
          <!-- LOGO -->
          <div class="flex" :class="collapsed ? 'px-4 justify-center' : 'px-8 pt-1 justify-left'">
            <NuxtIcon v-if="collapsed" name="logo/apillon-icon" class="text-3xl" />
            <Logo v-else />
          </div>

          <!-- PROJECTS & NEW PROJECT -->
          <div
            v-if="isFeatureEnabled(Feature.PROJECT, authStore.getUserRoles())"
            :class="collapsed ? 'px-4' : 'px-8'"
          >
            <!-- Projects dropdown -->
            <div class="min-h-[48px]">
              <SidebarSelectProject v-if="dataStore.hasProjects" :collapsed="collapsed" />
              <Btn
                v-else-if="projectsLoaded && !authStore.isAdmin()"
                type="info"
                :size="collapsed ? 'small' : 'large'"
                @click="modalNewProjectVisible = true"
              >
                <template v-if="collapsed">
                  <span class="inline-block w-5 icon-add text-xl"></span>
                </template>
                <template v-else>
                  {{ $t('project.new') }}
                </template>
              </Btn>
            </div>
          </div>
          <div v-else class="h-8"></div>

          <!-- SIDEBAR NAVIGATION -->
          <MenuNav :collapsed="collapsed" @toggle-sidebar="hideNavOnMobile" />
        </n-space>

        <!-- APP INFO -->
        <div v-if="!collapsed" class="flex flex-col px-8 pb-8">
          <p class="text-sm text-body">
            {{ $t('general.copyrights') }}
            <span>{{ version }}</span>
          </p>
        </div>
      </n-scrollbar>

      <!-- FOOTER: SIDEBAR PRICING -->
      <div
        v-if="!collapsed && dataStore.hasProjects && !authStore.isAdmin()"
        ref="footerRef"
        class="relative flex border-t border-bg-lighter flex-col p-8"
      >
        <div class="flex items-end" :class="{ 'opacity-0': paymentStore.loading }">
          <div class="w-1/2">
            <span class="text-xs text-bodyDark">{{ $t('dashboard.payment.currentPlan') }}</span>
            <strong class="block">
              {{ paymentStore.getActiveSubscriptionPackage?.name }}
            </strong>
          </div>
          <div v-if="!dataStore.isProjectUser" class="w-1/2">
            <span class="text-xs text-bodyDark">
              {{ $t('dashboard.payment.costs') }}:
              {{ formatPrice(paymentStore.getActiveSubscriptionPackage?.price || 0) }}/{{
                $t('general.month')
              }}
            </span>
            <PaymentCardCurrentPlan
              v-if="route.name === 'dashboard-payments'"
              :show-card="false"
              btn-class="font-bold no-underline"
              btn-type="link"
            />
            <Btn
              v-else
              class="font-bold no-underline"
              type="link"
              @click="router.push({ name: 'dashboard-payments' })"
            >
              <template v-if="paymentStore.hasActiveSubscription">
                {{ $t('dashboard.payment.managePlan') }}
              </template>
              <template v-else>
                {{ $t('dashboard.payment.upgradePlan') }}
              </template>
            </Btn>
          </div>
        </div>
        <Spinner v-if="paymentStore.loading" />
      </div>
    </div>
  </transition>

  <!-- Modal - Create new project -->
  <modal v-model:show="modalNewProjectVisible" :title="$t('project.new')">
    <FormProject
      @submit-success="modalNewProjectVisible = false"
      @close="modalNewProjectVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { useDataStore } from '~~/stores/data';

const authStore = useAuthStore();

const props = defineProps({
  collapsed: { type: Boolean, default: false },
  showOnMobile: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const { isSm, isLg } = useScreen();
const { width } = useWindowSize();

const projectsLoaded = ref<boolean>(false);
const modalNewProjectVisible = ref<boolean>(false);
const emit = defineEmits(['toggleSidebar']);

/** App version */
const config = useRuntimeConfig();
const version = ref(config.public.VERSION);

/** Sidebar */
const footerRef = ref<HTMLElement | null>(null);
const footerHeight = ref<number>(footerRef.value?.clientHeight || 200);
const sidebarStyle = computed(() => {
  return { maxHeight: `calc(100dvh - ${footerHeight.value}px)` };
});

/** Classes */
const sidebarClasses = computed(() => {
  return [
    isLg.value || !isSm.value ? 'w-full' : 'w-80',
    {
      'fixed top-0 left-0': !isLg.value,
      'z-10 translate-x-0': props.showOnMobile && !isLg.value,
      'z-10 -translate-x-full': !props.showOnMobile && !isLg.value,
    },
  ];
});

onMounted(async () => {
  await initProject();

  setFooterHeight();
  projectsLoaded.value = true;
  if (
    !dataStore.hasProjects &&
    isFeatureEnabled(Feature.PROJECT_ON_STARTUP, authStore.getUserRoles()) &&
    !authStore.isAdmin()
  ) {
    modalNewProjectVisible.value = true;
  } else if (!authStore.isAdmin()) {
    paymentStore.getSubscriptionPackages();
    await paymentStore.fetchActiveSubscription();
    setFooterHeight();
  }
});

async function initProject() {
  projectsLoaded.value = false;
  if (authStore.isAdmin()) {
    const currentProject = await dataStore.getProject(dataStore.project.selected);
    dataStore.project.items = [currentProject];
    dataStore.updateCurrentProject(currentProject);
    projectsLoaded.value = true;
  } else {
    await dataStore.getProjects().then(async _ => {
      await dataStore.getProject(dataStore.project.selected);
      projectsLoaded.value = true;
    });
  }
}

/** Hide sidebar navigation on mobile if user open to different page */
function hideNavOnMobile() {
  if (!isLg.value) {
    emit('toggleSidebar');
  }
}

watch(
  () => width.value,
  _ => {
    setFooterHeight();
  }
);
function setFooterHeight() {
  footerHeight.value =
    footerRef.value && footerRef.value?.offsetHeight > 100 ? footerRef.value.offsetHeight : 0;
}
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply min-h-full flex flex-col justify-between;
}
</style>
