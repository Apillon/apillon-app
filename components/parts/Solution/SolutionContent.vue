<template>
  <div>
    <div v-for="(item, key) in content" :key="key" class="mb-6" :class="innerClass">
      <h4 v-if="item.headline">{{ item.headline }}</h4>
      <h5 v-if="item.title" :class="{ 'mt-4': item.headline }">{{ item.title }}</h5>
      <strong
        v-if="item.subtitle"
        class="mb-4 block whitespace-break-spaces"
        :class="{ 'mt-3': item.headline || item.title }"
      >
        {{ item.subtitle }}
      </strong>

      <p v-if="item.p" class="mt-2 whitespace-break-spaces" v-html="transformLinks(item.p)"></p>

      <ul v-if="item.content && Array.isArray(item.content)" class="mb-4 mt-0 list-disc pl-5 text-white-secondary">
        <li v-for="(c, keyC) in item.content" :key="keyC" v-html="transformLinks(c)"></li>
      </ul>
      <p v-else-if="item.content" class="mb-4 mt-2 whitespace-break-spaces" v-html="transformLinks(item.content)"></p>

      <ul v-if="item.benefits" class="my-4 text-white-secondary">
        <li v-for="(benefit, keyB) in item.benefits" :key="keyB" class="my-2">
          <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl text-green" />
          <span v-html="benefit"></span>
        </li>
      </ul>

      <hr v-if="item.border" class="my-8 border-bg-lighter" />
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  content: { type: Array<SolutionContent>, default: [] },
  icons: { type: Boolean, default: false },
  innerClass: { type: String, default: '' },
});

const linkExpr = /\[(.*?)\]\((.*?)\)/gi;

const transformLinks = (str: string) => {
  return str.replace(linkExpr, (expr, text) => {
    try {
      const [_, link] = expr.substring(1, expr.length - 1).split('](');
      return text && link ? `<a href="${link}" class="link">${text}</a>` : expr;
    } catch (e: any) {
      console.error(e);
      return expr;
    }
  });
};
</script>
