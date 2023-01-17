<template>
  <!-- Referral - sharing -->

  <h4 class="">{{ $t('referral.shoutout') }}</h4>
  <div class="flex justify-end mr-10">
    {{ '+2 per share' }}
  </div>

  <div v-if="loading" class="relative">
    <Spinner />
  </div>
  <div v-for="tweet in tweets" :key="tweet" class="relative">
    <!-- <div class="absolute right-[36%] top-5">
      <ReferralPoints :points="1" />
    </div> -->
    <Tweet :tweet-id="(tweet as any).id" theme="dark">
      <template #loading>
        <Spinner />
      </template>
      <template #error>
        <span>Sorry, that tweet doesn't exist!</span>
      </template>
    </Tweet>
    <Btn class="mt-5 mr-5" type="primary" @click="shareTweet((tweet as any).id)">
      {{ $t('referral.share') }}
    </Btn>
    <Btn
      :loading="loadingConfirm"
      class="mt-5"
      type="primary"
      @click="confirmShareTweet((tweet as any).id)"
    >
      {{ $t('referral.confirm') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import Tweet from 'vue-tweet';
import { createDiscreteApi, stepProps } from 'naive-ui';

const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

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
