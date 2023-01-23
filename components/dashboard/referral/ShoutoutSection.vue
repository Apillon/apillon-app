<template>
  <!-- Referral - sharing -->
  <div class="bg-bg-light p-8">
    <div class="flex justify-between">
      <h3 class="mb-6">{{ $t('referral.shoutout') }}</h3>
      <n-tag type="info" size="large" round>
        <strong>{{ '+2 per share' }}</strong>
      </n-tag>
    </div>

    <div v-if="loading" class="relative">
      <Spinner />
    </div>
    <div v-for="tweet in tweets" :key="tweet" class="relative mx-auto w-auto">
      <!-- <div class="absolute right-[36%] top-5">
      <ReferralPoints :points="1" />
    </div> -->
      <ReferralTweet :tweet="tweet" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Tweet from 'vue-tweet';
import { useMessage } from 'naive-ui';

const message = useMessage();

const tweets = ref([]);

const loading = ref(false);
const loadingConfirm = ref(false);

getReferrals();

async function getReferrals() {
  loading.value = true;
  try {
    const res = await $api.get(endpoints.referralTweets);
    tweets.value = res.data;
    console.log(tweets.value);
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

function shareTweet(id: String) {
  try {
    window.open('https://twitter.com/Apillon/status/' + id);
  } catch (e) {
    console.error(e);
  }
}

async function confirmShareTweet(id: String) {
  loadingConfirm.value = true;
  try {
    const res = await $api.post<{ data: { retweeted: boolean } }>(endpoints.referralRetweet, {
      tweet_id: id,
    });
    console.log('My res share tweet: ', res);
    if (res.data.retweeted) {
      message.success('Tweet share confirmed!');
    } else {
      message.error('Tweet is not shared');
    }
  } catch (e) {
    console.error(e);
  }
  loadingConfirm.value = false;
}
</script>
