<template>
  <!-- Referral - sharing -->
  <div class="card-dark p-8">
    <div class="flex justify-between">
      <h3 class="mb-6">{{ $t('referral.shoutout.title') }}</h3>
      <n-tag type="info" round>
        <strong>{{ '+1 per share' }}</strong>
      </n-tag>
    </div>
    <div class="text-body mb-6">
      {{ $t('referral.shoutout.content') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const tweets = ref([] as { retweeted }[]);

const loading = ref(false);

onMounted(async () => {
  await getReferrals();
});

function changeTweetFirst(id) {
  firstArray.value[id].retweeted = true;
}

function changeTweetSecond(id) {
  secondArray.value[id].retweeted = true;
}

const length = ref(0);
const firstArray = ref([] as any[]);
const secondArray = ref([] as any[]);

async function getReferrals() {
  loading.value = true;
  try {
    const res = await $api.get(endpoints.referralTweets);
    tweets.value = res.data;
    length.value = Math.floor(tweets.value.length / 2);
    firstArray.value = tweets.value.slice(0, length.value);
    secondArray.value = tweets.value.slice(length.value);
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}
</script>
