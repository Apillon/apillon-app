<template>
  <!-- Sidebar mask (page overlay for tablets that is used to close sidebar if user click on it) -->
  <div
    v-if="showOnMobile && !isLg"
    class="fixed left-0 top-0 z-1 h-full w-full"
    @click="emit('toggleSidebar', false)"
  ></div>

  <!-- Sidebar -->
  <transition name="slide-left" :appear="isLg || showOnMobile">
    <div class="h-screen bg-bg transition-transform duration-300" :class="sidebarClasses">
      <n-scrollbar :style="sidebarStyle" class="scrollbar--menu">
        <!-- Close - only on mobile -->
        <button
          v-if="!isLg"
          class="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center"
          @click="emit('toggleSidebar', false)"
        >
          <span class="icon-close text-body"></span>
        </button>

        <n-space class="py-8" :size="32" vertical>
          <!-- LOGO -->
          <div class="flex" :class="collapsed ? 'justify-center px-4' : 'justify-left px-8 pt-1'">
            <NuxtIcon v-if="collapsed" name="logo/apillon-icon" class="text-3xl" />
            <Logo v-else />
          </div>

          <!-- PROJECTS & NEW PROJECT -->
          <div :class="collapsed ? 'px-4' : 'px-8'">
            <!-- Projects dropdown -->
            <div class="min-h-[48px]">
              <SidebarSelectProject :collapsed="collapsed" />
              <Btn
                v-if="!dataStore.hasProjects && projectsLoaded && !authStore.isAdmin()"
                type="info"
                :size="collapsed ? 'small' : 'large'"
                @click="modalNewProjectVisible = true"
              >
                <template v-if="collapsed">
                  <span class="icon-add inline-block w-5 text-xl"></span>
                </template>
                <template v-else>
                  {{ $t('project.new') }}
                </template>
              </Btn>
            </div>
          </div>

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
        class="relative z-2 flex flex-col border-t border-bg-lighter p-8"
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
              {{ formatPrice(paymentStore.getActiveSubscriptionPackage?.price || 0) }}/{{ $t('general.month') }}
            </span>
            <PaymentCardPlan
              v-if="route.name === 'dashboard-payments'"
              :show-card="false"
              btn-class="font-bold no-underline"
              btn-type="link"
            />
            <Btn v-else class="font-bold no-underline" type="link" @click="router.push({ name: 'dashboard-payments' })">
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
    <FormProject @submit-success="modalNewProjectVisible = false" @close="modalNewProjectVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
import { formatPrice } from '~/lib/utils/helpers';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
  showOnMobile: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
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
const sidebarStyle = ref<any>({ maxHeight: `100dvh` });

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

  if (dataStore.hasProjects && !authStore.isAdmin()) {
    paymentStore.getSubscriptionPackages();
    await paymentStore.fetchActiveSubscription();

    setTimeout(() => setFooterHeight(), 1000);
  } else if (!sessionStorage.getItem(DataLsKeys.ONBOARDING)) {
    dataStore.project.showOnboarding = true;
    sessionStorage.setItem(DataLsKeys.ONBOARDING, Date.now().toString());
  }
});

async function initProject() {
  projectsLoaded.value = false;
  await sleep(1);
  await dataStore.waitOnPromises(false);

  if (authStore.isAdmin() && dataStore.project.selected) {
    const currentProject = await dataStore.getProject(dataStore.project.selected);
    dataStore.project.items = [currentProject];
    dataStore.updateCurrentProject(currentProject);
    projectsLoaded.value = true;
  } else {
    await dataStore.getProjects();

    if (dataStore.project.selected) {
      await dataStore.getProject(dataStore.project.selected);
    }
    projectsLoaded.value = true;
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
  footerHeight.value = footerRef.value && footerRef.value?.offsetHeight > 100 ? footerRef.value.offsetHeight : 0;
  updateSidebarStyle();
}

watch(
  () => props.collapsed,
  _ => {
    updateSidebarStyle();
  }
);

function updateSidebarStyle() {
  sidebarStyle.value = props.collapsed
    ? { maxHeight: `100dvh` }
    : { maxHeight: `calc(100dvh - ${footerHeight.value}px)` };
}
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply flex min-h-full flex-col justify-between;
}
</style>
