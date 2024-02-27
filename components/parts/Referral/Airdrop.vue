<template>
  <!-- Referral - Airdrop -->
  <div class="card-dark p-8 mb-8">
    <div class="max-w-lg">
      <h3>{{ $t('referral.airdrop.welcome') }}</h3>
      <p class="mb-6 whitespace-break-spaces">{{ $t('referral.airdrop.content') }}</p>
      <Btn :color="colors.blue" href="https://discord.com/invite/yX3gTw36C4">
        {{ $t('referral.airdrop.btn') }}
      </Btn>
    </div>

    <div class="flex flex-wrap gap-4 mt-12 mb-4">
      <div
        v-for="(tab, key) in tabs"
        class="flex-1 p-6 min-w-[160px] rounded-lg border"
        :class="
          key % 3 === 0
            ? 'border-pink bg-pink/20'
            : key % 3 === 1
            ? 'border-orange bg-orange/20'
            : 'border-blue bg-blue/20'
        "
      >
        <h5 class="mb-2">{{ tab.title }}</h5>
        <span class="text-sm">{{ tab.content }}</span>
      </div>
    </div>

    <n-table class="bg-dark mobile:text-xs" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th class="mobile:hidden"></th>
          <th>
            {{ $t('referral.airdrop.task') }}
          </th>
          <th>
            {{ $t('referral.airdrop.type') }}
          </th>
          <th>
            {{ $t('referral.airdrop.reward') }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, key) in airdropTasks" :key="key">
          <td class="mobile:hidden">
            <span
              class="flex-cc icon-status text-xl"
              :class="[
                { 'text-bodyDark': task.category === 'register' },
                { 'text-orange': task.category === 'learn' },
                { 'text-blue': task.category === 'build' },
                { 'text-pink': task.category === 'refer' },
              ]"
            ></span>
          </td>
          <td>{{ task.name }}</td>
          <td>{{ task.type }}</td>
          <td>{{ task.reward }}</td>
          <td>
            <div class="flex-cc relative min-w-[24px]">
              <Spinner v-if="referralStore.loadingAirdrop" :size="18" />
              <NuxtIcon
                v-else-if="task.collected.value"
                name="icon/success"
                class="inline-block text-green text-2xl"
              />
              <NuxtIcon
                v-else
                name="icon/star-circled"
                class="inline-block text-bg-lighter text-2xl"
                filled
              />
            </div>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
import type { MessageFunction, VueMessageType } from '@nuxtjs/i18n/dist/runtime/composables';
import colors from '~/tailwind.colors';

type VueMsg = VueMessageType | MessageFunction<VueMessageType>;
type TabsContent = {
  headline?: string;
  title?: string;
  content?: string | string[];
  benefits?: string[];
};
type TabsContentTrans = {
  headline?: VueMsg;
  title?: VueMsg;
  content?: VueMsg;
  benefits?: VueMsg;
};

const { te, tm, rt } = useI18n();
const referralStore = useReferralStore();

const tabs = generateContent();

function generateContent() {
  const BASE = 'referral.airdrop.tabs';

  if (te(BASE)) {
    const translations = tm(BASE) as TabsContentTrans[];

    return translations.map(trans => {
      return {
        title: trans.title ? rt(trans['title']) : undefined,
        content: trans.content ? rt(trans['content']) : undefined,
      } as TabsContent;
    });
  }
  return [];
}

// prettier-ignore
const airdropTasks = [
  { category: 'register', name: 'Register to Apillon platform', type: 'One-time', reward: 10, collected: computed(() => (true)) },
  { category: 'refer', name: 'Refer Apillon to a friend', type: 'Repeatable', reward: 2, collected: computed(() => (referralStore.airdrop.usersReferred)) },
  { category: 'learn', name: 'Create new project ', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.projectCreated)) },
  { category: 'learn', name: 'Create Apillon Web3 Storage bucket', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.bucketCreated)) },
  { category: 'learn', name: 'Upload files to Apillon Web3 Storage bucket', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.fileUploaded)) },
  { category: 'learn', name: 'Upload website to Apillon Web3 Hosting', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.websiteCreated)) },
  { category: 'learn', name: 'Utilize IPNS record', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.ipnsCreated)) },
  { category: 'learn', name: 'Deploy Grill.chat', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.grillChatCreated)) },
  { category: 'learn', name: 'Deploy NFT collection', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.nftCollectionCreated)) },
  { category: 'build', name: 'Sign up for subscription plan', type: 'One-time', reward: 20, collected: computed(() => (referralStore.airdrop.onSubscriptionPlan)) },
  { category: 'build', name: 'Buy additional credits', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.creditsPurchased)) },
  { category: 'build', name: 'Spend 3,000 credits', type: 'Repeatable', reward: 1, collected: computed(() => (referralStore.airdrop.creditsSpent > 3000)) },
  { category: 'build', name: 'Host website and connect live domain via DNS', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.domainLinked)) },
  { category: 'build', name: 'Upload files to Web3 hosting via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.websiteUploadedViaApi)) },
  { category: 'build', name: 'Upload files to Web3 storage via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.fileUploadedViaApi)) },
  { category: 'build', name: 'Deploy Apillon’s Schrödinger’s NFT solution', type: 'One-time', reward: 2, collected: computed(() => (referralStore.airdrop.computingContractCreated)) },
  { category: 'build', name: 'Add another user to your project', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.collaboratorAdded)) },
  { category: 'build', name: 'Generate KILT-based Web3 identity', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.kiltIdentityCreated)) },
  { category: 'build', name: 'Retrieve on-chain Polkadot identity via Apillon SDK', type: 'One-time', reward: 2, collected: computed(() => (referralStore.airdrop.identitySdkUsed)) },
  { category: 'build', name: 'Mint NFTs via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.nftMintedApi)) },
];
</script>
