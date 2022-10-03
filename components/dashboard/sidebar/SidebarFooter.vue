<template>
  <div class="flex flex-col px-6 py-2">
    <p class="mb-2"><strong>Your plan:</strong> Free plan</p>
    <Btn type="outline-primary" size="sm">
      <span class="icon-star text-pink-purple"></span>
      <strong>Upgrade to PRO</strong>
    </Btn>
    <span class="mt-8 text-grey-bright">{{ $t('general.copyrights') }}</span>
  </div>
</template>

<script lang="ts" setup></script>
