<template>
  <!-- Referral - sharing -->

  <Tweet :tweet-id="(tweet as any).id" theme="dark" @tweet-load-success="loadSuccess()">
    <template #loading>
      <div class="h-[100px] relative">
        <Spinner />
      </div>
    </template>
    <template #error>
      <span>Sorry, that tweet doesn't exist!</span>
    </template>
  </Tweet>
  <div v-if="!(tweet as any).retweeted" class="grid grid-cols-2 gap-4">
    <Btn
      v-if="buttonsVisible"
      class="mt-3 mb-10 w-full"
      type="secondary"
      @click="shareTweet((tweet as any).id)"
    >
      {{ $t('referral.share') }}
    </Btn>
    <Btn
      v-if="buttonsVisible"
      :loading="loadingConfirm"
      class="mt-3 mb-10 w-full"
      type="primary"
      @click="confirmShareTweet((tweet as any).id)"
    >
      {{ $t('referral.confirm') }}
    </Btn>
  </div>
  <div v-else class="w-full bg-black flex justify-center py-[13px]">
    <IconSuccessful class="mr-2 h-auto" />
    {{ 'Point claimed' }}
  </div>
</template>

<script lang="ts" setup>
import Tweet from 'vue-tweet';
import { useMessage } from 'naive-ui';

const referralStore = useReferralStore();

const props = defineProps({
  tweet: { type: String, required: true },
});

const message = useMessage();

const loadingConfirm = ref(false);

const buttonsVisible = ref(false);

function loadSuccess() {
  buttonsVisible.value = true;
}

function shareTweet(id: String) {
  try {
    window.open('https://twitter.com/intent/retweet?tweet_id=' + id);
  } catch (e) {
    console.error(e);
  }
}

async function confirmShareTweet(id: String) {
  loadingConfirm.value = true;
  try {
    const res = await $api.post<{ data: { retweeted: boolean; player: ReferralInterface } }>(
      endpoints.referralRetweet,
      {
        tweet_id: id,
      }
    );
    if (res.data.retweeted) {
      referralStore.initReferral(res.data.player);
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
