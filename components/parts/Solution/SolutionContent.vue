<template>
  <div>
    <div v-for="(item, key) in content" :key="key">
      <h3 v-if="item.headline">{{ item.headline }}</h3>

      <p v-if="item.headline && item.title" :class="{ 'mt-6': item.headline }">{{ item.title }}</p>
      <h4 v-else-if="item.title" :class="{ 'mt-6': item.headline }">{{ item.title }}</h4>
      <p v-if="item.subtitle" class="mb-2 whitespace-break-spaces">{{ item.subtitle }}</p>

      <template v-if="icons">
        <ul v-if="item.content && Array.isArray(item.content)" class="mb-4 text-green">
          <li v-for="(c, keyC) in item.content" :key="keyC">
            <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
            <span class="text-body" v-html="transformLinks(c)"></span>
          </li>
        </ul>
      </template>
      <template v-else>
        <ul
          v-if="item.content && Array.isArray(item.content)"
          class="list-disc pl-4 mb-4 text-body"
        >
          <li v-for="(c, keyC) in item.content" :key="keyC" v-html="transformLinks(c)"></li>
        </ul>
        <p
          v-else-if="item.content"
          class="mt-2 mb-6 whitespace-break-spaces"
          v-html="transformLinks(item.content)"
        ></p>

        <ul v-if="item.benefits" class="my-6 text-white">
          <li v-for="(benefit, keyB) in item.benefits" :key="keyB" class="my-2">
            <NuxtIcon
              name="icon/success"
              class="inline-block float-left mr-2 text-2xl text-green"
            />
            <span v-html="benefit"></span>
          </li>
        </ul>
      </template>
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
