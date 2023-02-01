<template>
  <div class="my-6">
    <p class="mb-4 text-sm">
      <strong>{{ $t('dashboard.clientLibraries') }}</strong>
    </p>
    <n-space size="small">
      <span v-for="(library, key) in libraries" v-show="library.show" :key="key">
        <n-tooltip v-if="library.show" placement="bottom" trigger="hover">
          <template #trigger>
            <div
              class="bg-white border-grey border-[1px] inline-flex justify-center items-center w-12 h-12"
            >
              <NuxtIcon :name="library.icon" class="icon-library text-[22px]" filled />
            </div>
          </template>
          <span>{{ library.name }}</span>
        </n-tooltip>
      </span>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  react: { type: Boolean, default: true },
  vue: { type: Boolean, default: true },
  java: { type: Boolean, default: true },
  python: { type: Boolean, default: true },
  ts: { type: Boolean, default: true },
});

const libraries = [
  { name: 'AT-React', show: props.react, icon: 'libraries/react' },
  { name: 'AT-Vue', show: props.vue, icon: 'libraries/vue' },
  { name: 'AT-Java', show: props.java, icon: 'libraries/java' },
  { name: 'AT-Python', show: props.python, icon: 'libraries/python' },
  { name: 'AT-Typescript', show: props.ts, icon: 'libraries/ts' },
];
</script>

<style lang="postcss">
.icon-library > svg rect {
  width: 22px;
  height: 22px;
}
</style>
