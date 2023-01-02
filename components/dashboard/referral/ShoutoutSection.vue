<template>
  <!-- Referral - sharing -->
  <h4 class="">{{ $t('referral.shoutout') }}</h4>
  <div></div>
  <div v-for="tweet in tweets" :key="tweet" class="relative">
    <div class="absolute right-[36%] top-5">
      <ReferralPoints :points="1" />
    </div>
    <Tweet :tweet-id="tweet" theme="dark">
      <template #loading>
        <Spinner />
      </template>
      <template #error>
        <span>Sorry, that tweet doesn't exist!</span>
      </template>
    </Tweet>
    <Btn class="mt-5" type="primary" @click="shareTweet(tweet)">{{ $t('referral.share') }}</Btn>
  </div>
</template>

<script lang="ts" setup>
import Tweet from 'vue-tweet';

const tweets = ref([]);

onMounted(async () => {
  try {
    const res = await $api.get(endpoints.referralTweets);
    tweets.value = res.data;
    console.log(tweets.value);
  } catch (e) {
    console.error(e);
  }
});

async function shareTweet(id: String) {
  try {
    const res = await $api.post(endpoints.referralRetweet, {
      tweet_id: id,
    });
    console.log('My res share tweet: ', res);
  } catch (e) {
    console.error(e);
  }
}
</script>
