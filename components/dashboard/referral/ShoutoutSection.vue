<template>
  <!-- Referral - sharing -->
  <div class="bg-bg-light p-8">
    <div class="flex justify-between">
      <h3 class="mb-6">{{ $t('referral.shoutout') }}</h3>
      <n-tag type="info" size="large" round>
        <strong>{{ '+1 per share' }}</strong>
      </n-tag>
    </div>
    <div class="text-body mb-6">
      Sed tempor imperdiet cursus velit. Nulla viverra duis dictum eget eget. Scelerisque sit auctor
      lacus commodo id at consectetur netus donec. Pellentesque eu in et tristique. Porttitor sem
      aliquam.
    </div>

    <div v-if="loading" class="relative">
      <Spinner />
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div v-for="(tweet, idx) in tweets" :key="idx" class="">
        <ReferralTweet :tweet="tweet" @success="changeTweet" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const tweets = ref([] as { retweeted }[]);

const loading = ref(false);

onMounted(async () => {
  await getReferrals();
});

function changeTweet(id) {
  tweets.value[Number(id)].retweeted = true;
}

async function getReferrals() {
  loading.value = true;
  try {
    const res = await $api.get(endpoints.referralTweets);
    tweets.value = res.data;
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}
</script>
