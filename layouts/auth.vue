<template>
  <div class="relative z-1 min-h-screen overflow-hidden bg-bg-dark">
    <div
      class="container relative flex min-h-screen gap-x-12 px-22 py-12"
      :class="isRegister ? 'justify-between' : 'justify-center'"
    >
      <div class="relative flex flex-col justify-between" :class="isRegister ? 'items-start' : 'w-full items-center'">
        <AuthHeader :class="{ 'justify-center': !isRegister }" />

        <div class="relative w-full" :class="isRegister ? 'max-w-md' : 'max-w-2xl'">
          <div v-if="!isRegister" class="bg-ellipse absoluteCenter"></div>
          <router-view v-slot="{ Component, route }">
            <transition :name="(route.meta?.transition as string) || 'fadeBlur'" :duration="500">
              <div v-if="Component" class="relative z-1 w-full" :class="{ 'card-auth': !isRegister }">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </div>

        <AuthFooter />
      </div>
      <div
        v-if="isRegister"
        class="flex w-1/2 flex-col justify-between gap-8 rounded-lg bg-bg-dark px-10 py-16 text-center md:px-16 xl:px-20 xxl:px-28"
      >
        <div class="mx-auto max-w-sm px-5">
          <h1 class="mx-auto mb-6 max-w-64 font-heading">{{ $t('auth.register.banner.title') }}</h1>
          <p>{{ $t('auth.register.banner.content') }}</p>
        </div>
        <div class="flex-cc relative w-full">
          <div class="bg-ellipse left-1/2"></div>
          <img :src="PeopleSVG" class="lg:pb-14" width="436" height="176" :alt="$t('auth.register.banner.title')" />
        </div>
        <div>
          <div class="flex justify-center gap-1">
            <NuxtIcon v-for="i in [1, 2, 3, 4, 5]" :key="i" name="icon/star-filled" filled />
          </div>
          <p class="my-2">{{ $t('auth.register.banner.footer') }}</p>

          <div class="flex justify-center gap-2">
            <div v-for="(item, key) in statistics" :key="key" class="h-24 w-24 px-1 py-5 text-center">
              <h5 class="font-heading">{{ item.value }}</h5>
              <p class="text-xs">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PeopleSVG from '~/assets/icons/dashboard/people.svg';

const { isLg } = useScreen();
const router = useRouter();
const { statistics } = useStatistics();

const isRegister = computed(() => isLg.value && router.currentRoute.value.name === 'register');

/** Global messages */
const message = useMessage();
window.$message = message;
</script>
