<template>
  <!-- Referral - Airdrop -->
  <div class="card-dark p-8 mb-8">
    <div>
      <h3>{{ $t('referral.airdrop.welcome') }}</h3>
      <p class="mb-6">{{ $t('referral.airdrop.content') }}</p>
      <Btn :color="colors.blue">{{ $t('referral.airdrop.btn') }}</Btn>
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
        <tr v-for="(task, key) in tasks" :key="key">
          <td>
            <NuxtIcon name="icon/status" class="inline-block text-green text-xl" filled />
          </td>
          <td>{{ task.task }}</td>
          <td>{{ task.type }}</td>
          <td>{{ task.reward }}</td>
          <td>
            <NuxtIcon name="icon/success" class="inline-block text-green text-2xl" />
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
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

const tasks = [
  { task: 'Register to the Apillon platform', type: 'One-time', reward: 10 },
  { task: 'Register to the Apillon platform', type: 'One-time', reward: 10 },
  { task: 'Register to the Apillon platform', type: 'One-time', reward: 10 },
  { task: 'Register to the Apillon platform', type: 'One-time', reward: 10 },
  { task: 'Register to the Apillon platform', type: 'One-time', reward: 10 },
];
const tabs = generateContent();

onMounted(() => {
  referralStore.fetchAirdropTasks();
});

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
</script>
