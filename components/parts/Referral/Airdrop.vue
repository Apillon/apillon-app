<template>
  <!-- Referral - Airdrop -->
  <div class="card-dark p-8 mb-8">
    <div>
      <h3>{{ $t('referral.airdrop.welcome') }}</h3>
      <p class="mb-6">{{ $t('referral.airdrop.content') }}</p>
      <Btn
        :color="colors.blue"
        href="https://discord.com/channels/881835505120079912/882217141389099089"
        >{{ $t('referral.airdrop.btn') }}</Btn
      >
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
        {{ tab.title }}
        {{ tab.content }}
      </div>
    </div>

    <n-table class="bg-dark" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th></th>
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
          <td>
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
            <div class="flex-cc">
              <NuxtIcon
                v-if="task.collected"
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
  { category: 'register', name: 'Register to Apillon platform', type: 'One-time', reward: 10, collected: true },
  { category: 'learn', name: 'Project created', type: 'One-time', reward: 1, collected: referralStore.airdrop.projectCreated },
  { category: 'learn', name: 'Bucket created', type: 'One-time', reward: 1, collected: referralStore.airdrop.bucketCreated },
  { category: 'learn', name: 'Upload files to Apillon Web3 Storage bucket via IPFS', type: 'One-time', reward: 1, collected: referralStore.airdrop.fileUploaded },
  { category: 'learn', name: 'Website created', type: 'One-time', reward: 1, collected: referralStore.airdrop.websiteCreated },
  { category: 'learn', name: 'IPNS created', type: 'One-time', reward: 1, collected: referralStore.airdrop.ipnsCreated },
  { category: 'learn', name: 'Subscription plan', type: 'One-time', reward: 20, collected: referralStore.airdrop.onSubscriptionPlan },
  { category: 'learn', name: 'Credits purchased', type: 'One-time', reward: 5, collected: referralStore.airdrop.creditsPurchased },
  { category: 'learn', name: 'Spent 3000 credits', type: 'Repeatable', reward: 1, collected: referralStore.airdrop.creditsSpent },
  { category: 'learn', name: 'Grill chat created', type: 'One-time', reward: 1, collected: referralStore.airdrop.grillChatCreated },
  { category: 'learn', name: 'Deployed NFT collections via configurator', type: 'One-time', reward: 10, collected: referralStore.airdrop.nftCollectionCreated },
  { category: 'build', name: 'Hosting page linked with a domain', type: 'One-time', reward: 10, collected: referralStore.airdrop.domainLinked },
  { category: 'build', name: 'Website upload via API', type: 'One-time', reward: 5, collected: referralStore.airdrop.websiteUploadedApi },
  { category: 'build', name: 'File upload via API', type: 'One-time', reward: 5, collected: referralStore.airdrop.fileUploadedApi },
  { category: 'build', name: 'Schrodindgers NFT deployed ', type: 'One-time', reward: 2, collected: referralStore.airdrop.computingContractCreated },
  { category: 'build', name: 'Add a collaborator to your project', type: 'One-time', reward: 1, collected: referralStore.airdrop.collaboratorAdded },
  { category: 'build', name: 'Created KILT identity', type: 'One-time', reward: 10, collected: referralStore.airdrop.kiltIdentityCreated },
  { category: 'build', name: 'Checking onchain identity via identity SDK', type: 'One-time', reward: 2, collected: referralStore.airdrop.identitySdkUsed },
  { category: 'build', name: 'NFT minted via API', type: 'One-time', reward: 5, collected: referralStore.airdrop.nftMintedApi },  
  { category: 'refer', name: 'Refer a friend', type: 'Repeatable', reward: 2, collected: referralStore.airdrop.usersReferred },
];
</script>
