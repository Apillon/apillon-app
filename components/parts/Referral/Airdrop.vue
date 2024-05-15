<template>
  <!-- Referral - Airdrop -->
  <div class="card-dark p-8 mb-8">
    <div class="max-w-lg mb-12">
      <h3>{{ $t('referral.airdrop.welcome') }}</h3>
      <p class="mb-6 whitespace-break-spaces">{{ $t('referral.airdrop.content') }}</p>
      <Btn :color="colors.blue" href="https://discord.com/invite/yX3gTw36C4">
        {{ $t('referral.airdrop.btn') }}
      </Btn>
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
import colors from '~/tailwind.colors';

const referralStore = useReferralStore();

// prettier-ignore
const airdropTasks = [
  { category: 'register', name: 'Register to Apillon platform', type: 'One-time', reward: 10, collected: computed(() => (true)) },
  { category: 'refer', name: 'Refer Apillon to a friend', type: 'Repeatable', reward: 2, collected: computed(() => (referralStore.airdrop.usersReferred)) },
  { category: 'learn', name: 'Create new project ', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.projectCreated)) },
  { category: 'learn', name: 'Create Apillon Web3 Storage bucket', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.bucketCreated)) },
  { category: 'learn', name: 'Upload files to Apillon Web3 Storage bucket', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.fileUploaded)) },
  { category: 'learn', name: 'Deploy a website through Apillon Web3 Hosting', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.websiteCreated)) },
  { category: 'learn', name: 'Utilize an IPNS record in a storage bucket', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.ipnsCreated)) },
  { category: 'learn', name: 'Deploy a Grill.chat Social Channel', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.grillChatCreated)) },
  { category: 'learn', name: 'Deploy an NFT collection', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.nftCollectionCreated)) },
  { category: 'build', name: 'Sign up for a subscription plan', type: 'One-time', reward: 20, collected: computed(() => (referralStore.airdrop.onSubscriptionPlan)) },
  { category: 'build', name: 'Buy additional credits', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.creditsPurchased)) },
  { category: 'build', name: 'Spend 3,000 credits', type: 'Repeatable', reward: 1, collected: computed(() => (referralStore.airdrop.creditsSpent > 3000)) },
  { category: 'build', name: 'Host a website and connect a live domain via DNS', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.domainLinked)) },
  { category: 'build', name: 'Upload files to Web3 hosting via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.websiteUploadedViaApi)) },
  { category: 'build', name: 'Upload files to Web3 storage via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.fileUploadedViaApi)) },
  { category: 'build', name: 'Deploy Apillon’s Schrödinger’s NFT solution', type: 'One-time', reward: 2, collected: computed(() => (referralStore.airdrop.computingContractCreated)) },
  { category: 'build', name: 'Add another user to your project', type: 'One-time', reward: 1, collected: computed(() => (referralStore.airdrop.collaboratorAdded)) },
  { category: 'build', name: 'Generate KILT-based Web3 identity', type: 'One-time', reward: 10, collected: computed(() => (referralStore.airdrop.kiltIdentityCreated)) },
  { category: 'build', name: 'Retrieve on-chain Polkadot identity via Apillon SDK', type: 'One-time', reward: 2, collected: computed(() => (referralStore.airdrop.identitySdkUsed)) },
  { category: 'build', name: 'Mint NFTs via API', type: 'One-time', reward: 5, collected: computed(() => (referralStore.airdrop.nftMintedApi)) },
];
</script>
