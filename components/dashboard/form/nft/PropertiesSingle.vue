<template>
  <div class="bg-bg-light p-4 w-full rounded-md">
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.properties') }}</span>
        <p>{{ $t('nft.single.propertiesInfo') }}</p>
      </div>

      <button class="ml-auto">
        <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
      </button>
    </div>
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.levels') }}</span>
        <p>{{ $t('nft.single.levelsInfo') }}</p>
      </div>

      <button class="ml-auto">
        <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
      </button>
    </div>
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.stats') }}</span>
        <p>{{ $t('nft.single.statsInfo') }}</p>
      </div>

      <button class="ml-auto">
        <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
      </button>
    </div>
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.boosts') }}</span>
        <p>{{ $t('nft.single.boostsInfo') }}</p>
      </div>

      <button class="ml-auto">
        <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
      </button>
    </div>
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.date') }}</span>
        <p>{{ $t('nft.single.dateInfo') }}</p>
      </div>

      <button class="ml-auto">
        <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
      </button>
    </div>
    <div class="mb-4 flex">
      <div>
        <span class="mr-4">{{ $t('nft.single.unlockableContent') }}</span>
        <p>{{ $t('nft.single.unlockableContentInfo') }}</p>
      </div>
      <div class="ml-auto">
        <n-switch />
      </div>
    </div>
    <div class="w-full border-b-1 bg-bg-lightest mb-4"></div>
    <div class="mb-4">
      <span class="mr-4">{{ $t('nft.single.displaySettings') }}</span>
      <br />
      <n-radio-group v-model:value="value" name="radiogroup">
        <n-radio :label="$t('nft.single.showDisplay')" :value="1" /><br />
        <n-radio :label="$t('nft.single.hideDisplay')" :value="2" />
      </n-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
const value = ref<number>(1);
</script>
