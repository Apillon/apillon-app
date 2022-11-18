<template>
  <transition name="slide-left" appear>
    <div class="absolute left-0 top-0 bottom-0 w-64 min-h-full">
      <n-scrollbar style="max-height: 100vh" class="scrollbar--menu">
        <n-space class="py-6" :size="24" vertical>
          <!-- LOGO -->
          <div class="flex justify-center">
            <NuxtLink :to="{ name: 'dashboard' }">
              <span class="icon-apillon text-2xl"></span>
            </NuxtLink>
          </div>

          <!-- NEW PROJECT -->
          <div class="text-center">
            <Btn size="tiny" quaternary @click="showModalNewProject = true">
              {{ $t('project.new') }}
            </Btn>
          </div>

          <!-- PROJECT OVERVIEW -->
          <div class="pl-4 mt-6">
            <NuxtLink
              :to="{ name: 'dashboard' }"
              class="block p-2 h-[38px] w-full text-left border-primary"
              :class="{ 'bg-grey-dark border-l-3': currentRoute.name === 'dashboard' }"
            >
              <span class="icon-home text-primary"></span>
              <strong class="ml-1">{{ $t('project.overview') }}</strong>
            </NuxtLink>
          </div>

          <!-- SIDEBAR NAVIGATION -->
          <SidebarNav class="pl-4" />
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

const dataStore = useDataStore();
const { currentRoute } = useRouter();
const showModalNewProject = ref(false);

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    if (!dataStore.hasProjects) {
      showModalNewProject.value = true;
    }
  });
});
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply min-h-full flex flex-col justify-between;
}
</style>
