<template>
  <n-data-table
    v-bind="$attrs"
    :pagination="$attrs?.pagination?.itemCount > PAGINATION_LIMIT ? $attrs.pagination : undefined"
  />
</template>

<script lang="ts" setup></script>
