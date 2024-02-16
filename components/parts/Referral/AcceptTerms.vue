<template>
  <!-- Referral enter -->
  <div class="">
    <p class="mb-8 text-body">
      {{ $t('referral.enter.description') }}
    </p>
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <n-form-item
        path="country"
        :label="$t('referral.enter.country')"
        :label-props="{ for: 'country' }"
      >
        <n-select
          id="country"
          v-model:value="formData.country"
          class="mt-2 mb-1 max-w-[522px] bg-primary"
          :options="referralCountries"
        >
          <template #arrow>
            <span class="icon-down text-2xl"></span>
          </template>
        </n-select>
      </n-form-item>
      <n-form-item path="terms" :show-label="false">
        <div class="flex">
          <n-checkbox id="terms" v-model:checked="formData.terms" size="large" />
          <div class="cursor-pointer ml-2" @click="openModal()">
            {{ $t('referral.enter.terms.accept') }}
            <Tag color="yellow" :on-hover="true">
              {{ $t('referral.enter.terms.andConditions') }}
            </Tag>
          </div>
        </div>
      </n-form-item>

      <n-form-item>
        <input type="submit" class="hidden" :value="$t('form.login')" />
        <Btn :loading="loading" type="primary" class="-mt-4" size="large" @click="handleSubmit">
          {{ $t('referral.enter.btn') }}
        </Btn>
      </n-form-item>
    </n-form>

    <Modal v-model:show="showModal" title="Apillon Referral Program">
      <h3>Introduction</h3>
      <p>
        Apillon launches a Referral program to incentivize the Apillon followers and users to spread
        the word about Apillon and introduce the platform to new communities. For this purpose, the
        Apillon Referral program will issue various rewards, both physical and digital, claimable
        according to the number of points collected by program participants.
      </p>

      <h3>How does it work?</h3>
      <ul class="list-disc pl-4 mb-4">
        <li class="li-terms">Participant creates an account on apillon.io.</li>
        <li class="li-terms">Participant logs in.</li>
        <li class="li-terms">Participant clicks or lands on the Referral program page.</li>
        <li class="li-terms">
          Apillon's Referral program offers Apillon merch packs (T-shirts, stickers) as a reward for
          referring the Apillon platform to other users, linking to it on their Twitter or GitHub
          profiles, tweeting about Apillon or other tasks as defined by the Referral program.
        </li>
        <li class="li-terms">
          Participants execute different tasks in the Referral program to collect points.
        </li>
        <li class="li-terms">Participants start with 0 points in their account.</li>
        <li class="li-terms">
          Once a specific point marker is reached (i. e., the number of collected points either
          equals or is greater than the reward value), the "Order merch" button changes state from
          disabled to active, and the participant can click on it to claim earned rewards.
        </li>
        <li class="li-terms">
          Once a participant clicks the "Order merch" button, they need to enter their personal data
          and shipping address and file the order.
        </li>
        <li class="li-terms">
          The order shipping data is saved in a secure storage where the Apillon team can access it
          in order to process the orders.
        </li>
      </ul>

      <h3>Key terms</h3>
      <h4>Referral program</h4>
      <p>
        Apillon's Referral program is a campaign that allows eligible Apillon users and followers
        (i. e., Referral program participants) to earn rewards in exchange for the execution of
        specific tasks as described on the Referral program page.
      </p>
      <h4>Participant</h4>
      <p>
        A participant in Apillon's Referral program is a person who registers an account on
        apillon.io and performs tasks listed on the Referral program page in order to earn rewards.
        By participating in the Referral program, they agree to have read and understood the Terms
        and Conditions of the program and their participation in it.
      </p>

      <h3>Reward points</h3>
      <p>
        Apillon's Referral program implements two kinds of metrics to establish the relationship
        between Apillon and the program participant.
      </p>
      <h4>Points</h4>
      <p>
        Points are collected by participants for each task they complete. Points are the core metric
        and base for allocating rewards through the Apillon Referral program.
      </p>
      <p>
        Some points are delegated automatically by the system, while others are human-reviewed by
        appointed members of the Apillon team and are scored in the discretion of those members.
      </p>
      <p>
        Participants spend accumulated points to acquire different rewards. Upon spending their
        points on a specific reward, the value of the acquired reward is deducted from the total
        points they collected.
      </p>

      <h4>Experience points</h4>
      <p>
        Experience points represent an informative number of total points earned by a participant.
        When a participant claims a specific reward, only the “Points” from the previous article are
        deducted from the total amount by the value of the chosen reward, while Experience points
        remain the same.
      </p>

      <h3>Rewards</h3>
      <p>
        Participants can spend the points collected through Apillon's Referral program on rewards of
        their choice.
      </p>
      <p>
        The Reward section on the Referral program page always shows all available rewards at the
        time, ranging from merchandise rewards to digital rewards, NFTs, or even liquid assets. Each
        reward shows a total value, defined in the “Points” article in the “Reward points” chapter.
        Any participant is able to receive and/or claim rewards only up to the value of 5,000 EUR
        per calendar year. Any rewards in excess of the value of 5,000 EUR per year will be deemed
        null and void and cannot be redeemed.
      </p>

      <p>
        Eligible participants who decide to spend their collected points on rewards do not bear any
        other expenses associated with collecting their rewards - the whole process is free of
        charge, including shipping, handling, and other associated costs. Note however, that it is
        the sole responsibility of each participant to check for local tax regulation of his/her
        residence and if required register any received rewards with the local authorities. Apillon
        is not in any way responsible for any costs and/or taxes resulting from such local
        requirements.
      </p>

      <p>
        Upon claiming a chosen reward, a participant spends all or a part of the collected points
        and enters a claim process where an address of deliverability is defined. If a participant
        claims a reward that is later proven to be undeliverable (due to, but not limited to lack of
        stock or other technical difficulties), the Apillon team will provide the participant with
        an alternative reward or redemption of collected points to the value according to the
        timestamp before the points were spent.
      </p>

      <h3>Eligibility</h3>
      <p>
        Only participants with a registered account on
        <a href="https://app.apillon.io/dashboard">apillon.io/dashboard</a> may enter and
        participate in the Apillon Referral program.
      </p>

      <p>
        Persons who applied for or entered the Apillon Ambassador program are not eligible for
        collecting rewards from the Apillon Referral program but can earn rewards as defined in the
        Ambassador program.
      </p>

      <p>
        Upon entering the Apillon Referral program, participants agree to accept the present Terms
        and Conditions and pass the “Eligible country” check. Eligible countries of participants are
        defined on the Referral program page and are limited to the countries where Apillon can
        deliver the rewards. The list might be subject to amendment in the future.
      </p>

      <p>
        Apillon may suspend, terminate or modify, without liability, all or any part of the Apillon
        Referral Program (including the terms, type, and amount of rewards and eligibility criteria
        under the program), in its sole discretion, with or without notice. Apillon reserves the
        right to suspend or terminate any customer's participation in the Apillon Referral Program
        for fraud, abuse, misuse, harassment, or other inappropriate or suspicious activity that
        Apillon determines, in its sole discretion, compromises the fairness or integrity of the
        Program in any way. Apillon may change these Program Terms at any time, and by your
        participation in the Program, you agree to abide by the revised version of the Program
        Terms. If changes are made, the updated version of the Terms will be posted on the a
        website.
      </p>

      <p>
        For avoidance of doubt, participants can be denied eligibility for rewards at any time at
        the sole discretion of the Apillon team. In such cases, all collected points will be reset
        to 0 and the participant will not be eligible to claim any rewards or re-enter the Referral
        program.
      </p>

      <h3>Duration</h3>
      <p>
        The Apillon Referral program remains active indefinitely or until it is discontinued or
        removed by the Apillon team. In case of discontinuing the Referral program, all collected
        points become unclaimable in every way, with the exception of Experience points which remain
        attached to the participant's account as an informative value of their past achievements.
      </p>

      <h3>Reward deliverability</h3>
      <p>
        To claim physical rewards, participants should provide their delivery address, which has to
        be in the same country as initially selected by the participant in the “Eligible Country”
        check phase of the Referral program. Only participants from eligible countries are eligible
        to receive physical rewards.
      </p>
      <p>
        The delivery of digital rewards will be defined on a case-by-case basis, where the delivery
        channel could be defined as an Apillon platform-compatible blockchain address or any other
        digital channel, as defined by Apillon in the details of such rewards.
      </p>
      <p>
        The time in which rewards are delivered is at the discretion of the Apillon team without
        guarantees.
      </p>

      <h3>User data</h3>
      <p>
        Participant's private data collected during the duration of the Referral program is treated
        within our Privacy Policies as defined
        <a href="https://apillon.io/privacy-policy">here</a>
      </p>
      <div class="mb-8"></div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
const referralStore = useReferralStore();

const router = useRouter();

const $i18n = useI18n();
const formRef = ref<NFormInst | null>(null);
const message = useMessage();

const formData = ref({
  terms: undefined,
  country: undefined,
});

const loading = ref(false);

const showModal = ref(false);

const rules: NFormRules = {
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: $i18n.t('validation.terms'),
    },
  ],
  country: [
    {
      required: true,
      validator: validateRequiredDropdown,
      message: $i18n.t('validation.country'),
    },
  ],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      enterReferral();
    }
  });
}

async function enterReferral() {
  loading.value = true;
  try {
    const res = await $api.post<ReferralResponse>(endpoints.referral, {
      termsAccepted: true,
    });
    referralStore.initReferral(res.data);

    router.push('/dashboard/referral');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

function openModal() {
  showModal.value = true;
}
</script>

<style lang="postcss" scoped>
.li-terms {
  margin-bottom: 4px;
}
</style>
