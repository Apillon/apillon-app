<template>
  <n-upload accept="image/*,video/*" :show-file-list="false">
    <n-upload-dragger class="h-40">
      <div class="py-2 text-center">
        <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
          <span class="icon-image text-2xl text-violet"></span>
        </div>

        <slot>
          <h6>{{ $t('nft.upload.images') }}</h6>
          <p class="text-white-terciary">{{ $t('nft.upload.dragAndDrop') }}</p>
        </slot>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup></script>
