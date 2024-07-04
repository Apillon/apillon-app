<template>
  <div class="flex items-center gap-x-2 mb-8">
    <h5>{{ $t('embeddedWallet.codeSnippets') }}</h5>
    <div class="bg-bg-lighter rounded-full p-0.4">
      <n-button
        size="small"
        round
        :class="selectedLanguage === 'react' ? '!bg-bg-dark' : ''"
        @click="select('react')"
      >
        <span class="px-2">React</span>
      </n-button>
      <n-button
        size="small"
        round
        :class="selectedLanguage === 'vue' ? '!bg-bg-dark' : ''"
        @click="select('vue')"
      >
        <span class="px-2">VueJS</span>
      </n-button>
    </div>
  </div>

  <CodeBlock :code="currentCode" lang="js" theme="github-dark" highlightjs :style="codeSize" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import CodeBlock from 'vue3-code-block';

const props = defineProps({
  spaceId: { type: String, default: 'spaceID' },
  postId: { type: String, default: '' },
});

const darkTheme = ref<boolean>(true);
const enableBackButton = ref<boolean>(false);
const enableLoginButton = ref<boolean>(true);
const enableInputAutofocus = ref<boolean>(true);

// State to manage the selected code language
const selectedLanguage = ref('react');

const select = (language: string) => {
  selectedLanguage.value = language;
};

// Settings computed property
const settings = computed(() => {
  return props.postId
    ? {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
        channel: {
          type: 'channel',
          id: props.postId,
          settings: {
            enableBackButton: enableBackButton.value,
            enableLoginButton: enableLoginButton.value,
            enableInputAutofocus: enableInputAutofocus.value,
          },
        },
      }
    : {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
      };
});

// VueJS code block
const codeVue = computed(() => {
  return `// 1. Installation
  yarn add @subsocial/grill-widget
  
  // 2. Add the div HTML tag with an id of grill to your app.
  <div id="grill"></div>
  
  // 3. Setup config
  const config = ${JSON.stringify(settings.value, null, 2)}
  
`;
});

// React code block
const codeReact = computed(() => {
  return `// 1. Installation react
  yarn add @subsocial/grill-widget react
  
  // 2. Add the div HTML tag with an id of grill to your app.
  <div id="grill"></div>
  
  // 3. Setup config
  const config = ${JSON.stringify(settings.value, null, 2)}
  
`;
});

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  return selectedLanguage.value === 'react' ? codeReact.value : codeVue.value;
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>

<style lang="postcss">
.active {
  background-color: #f0f0f0;
}
</style>
