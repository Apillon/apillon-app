<template>
  <n-button v-bind="$attrs" class="w-11 h-11 p-0" type="primary" ghost>
    <slot>
      <span class="icon-hamburger text-white text-2xl"></span>
    </slot>
  </n-button>
</template>
