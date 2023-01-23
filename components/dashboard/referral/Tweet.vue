<template>
  <!-- Referral - sharing -->

  <Tweet :tweet-id="(tweet as any).id" theme="dark" @tweet-load-success="loadSuccess()">
    <template #loading>
      <div class="h-[100px]">
        <Spinner />
      </div>
    </template>
    <template #error>
      <span>Sorry, that tweet doesn't exist!</span>
    </template>
  </Tweet>
  <Btn
    v-if="buttonsVisible"
    class="mt-3 mb-10 mr-5"
    type="primary"
    @click="shareTweet((tweet as any).id)"
  >
    {{ $t('referral.share') }}
  </Btn>
  <Btn
    v-if="buttonsVisible"
    :loading="loadingConfirm"
    class="mt-3 mb-10"
    type="primary"
    @click="confirmShareTweet((tweet as any).id)"
  >
    {{ $t('referral.confirm') }}
  </Btn>
</template>

<script lang="ts" setup>
import Tweet from 'vue-tweet';
import { useMessage } from 'naive-ui';

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
