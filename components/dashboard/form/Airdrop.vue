<template>
  <n-form ref="formTasksReviewRef" :model="formData" :rules="rules" :disabled="isDisabled">
    <!-- <Notification v-if="referralStore.tokenClaim.claimCompleted" type="warning" class="w-full mb-8">
      {{ $t('referral.info.claim.alreadyClaimed') }}
    </Notification>
    <Notification v-else-if="isDisabled" type="warning" class="w-full mb-8">
      {{ $t('referral.info.claim.inReview') }}
    </Notification> -->

    <!-- <n-form-item path="terms" :show-label="false" :show-feedback="formErrors && !formData.terms">
      <n-checkbox v-model:checked="formData.terms" size="medium" :label="termsLabel" />
      <IconInfo v-if="isDisabled" size="sm" :tooltip="$t('referral.info.claim.tooltipDisabled')" />
    </n-form-item> -->

    <!--  Signup submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('referral.info.claim.btn')" />

      <Btn
        type="primary"
        size="large"
        class="mt-2"
        :loading="loading"
        :disabled="isDisabled"
        @click="handleSubmit"
      >
        {{ $t('referral.info.claim.btn') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';
import { load as loadFingerprint } from '@fingerprintjs/fingerprintjs';
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

type AirdropForm = {
  terms?: boolean;
};

const { t } = useI18n();
const message = useMessage();
const referralStore = useReferralStore();
const { connectAndSign } = useWallet();

const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { address, isConnected } = useAccount({ onConnect: onWalletConnected });

const formTasksReviewRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);
const loading = ref<boolean>(false);

const formData = ref<AirdropForm>({
  terms: false,
});

const rules: NFormRules = {
  terms: [
    {
      validator: (_: FormItemRule, value: string) => !!value,
      message: t('validation.terms'),
      trigger: 'change',
    },
  ],
};

const isDisabled = computed(
  () =>
    referralStore.inReview ||
    !!referralStore.tokenClaim.wallet ||
    referralStore.tokenClaim.claimCompleted
);

/** Terms label with link  */
const termsLabel = computed<any>(() => {
  return h('span', {}, [
    t('auth.terms.consent'),
    h(
      'a',
      { href: 'https://apillon.io/privacy-policy', target: '_blank' },
      { default: () => t('auth.terms.app') }
    ),
    '.',
  ]);
});

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formErrors.value = false;
  formTasksReviewRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      formErrors.value = true;
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await airdropReview();
    }
  });
}

async function airdropReview() {
  loading.value = true;

  try {
    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
      return;
    }

    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
      return;
    }

    const res = await $api.post<GeneralResponse<AirdropStatsInterface>>(
      endpoints.airdropReviewTasks,
      {
        fingerprint: await getFingerprint(),
        wallet: address.value,
        signature: sign.signature,
        timestamp: sign.timestamp,
        isEvmWallet: true,
      }
    );
    referralStore.inReview = true;
    referralStore.airdrop = res.data;

    message.success(t('referral.info.claim.inReview'));
    localStorage.removeItem(LsCacheKeys.REFERRAL_AIRDROP);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function getFingerprint() {
  try {
    const { visitorId } = await loadFingerprint().then(fp => fp.get());
    return visitorId;
  } catch (err) {
    return null;
  }
}

function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else if (connector.ready) {
    connect({ connector });
  }
}

async function onWalletConnected() {
  await sleep(200);
  if (loading.value && !referralStore.inReview) {
    airdropReview();
  }
}
</script>
