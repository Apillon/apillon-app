<template>
  <div>
    <div v-for="(item, key) in content" :key="key" class="flex">
      <div class="w-1/2 pr-4">
        <h3 v-if="item.headline">{{ item.headline }}</h3>
        <p v-if="item.subtitle" class="mb-2 whitespace-break-spaces">{{ item.subtitle }}</p>
      </div>
      <div class="w-1/2 pl-4">
        <ul v-if="item.benefits" class="my-6 text-white">
          <li v-for="(benefit, keyB) in item.benefits" :key="keyB" class="my-2">
            <NuxtIcon
              name="icon/success"
              class="inline-block float-left mr-2 text-2xl text-green"
            />
            <span v-html="benefit"></span>
          </li>
        </ul>
      </div>
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  content: { type: Array<SolutionContent>, default: [] },
  icons: { type: Boolean, default: false },
});

const linkExpr = /\[(.*?)\]\((.*?)\)/gi;

const transformLinks = (str: string) => {
  return str.replace(linkExpr, (expr, text) => {
    try {
      const [_, link] = expr.substring(1, expr.length - 1).split('](');
      return text && link ? `<a href="${link}" class="link">${text}</a>` : expr;
    } catch (error) {
      return expr;
    }
  });
};
</script>
