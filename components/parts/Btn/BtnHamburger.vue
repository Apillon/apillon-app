<template>
  <n-button v-bind="$attrs" class="h-11 w-11 p-0" type="primary" ghost>
    <slot>
      <span class="icon-hamburger text-2xl text-white"></span>
    </slot>
  </n-button>
</template>
