<template>
  <ModalFullScreen
    :progress="progress"
    :steps="SimpletCreateStep"
    :active-step="
      simpletStore.stepSimpletCreate === SimpletCreateStep.SMTP
        ? SimpletCreateStep.FORM
        : simpletStore.stepSimpletCreate
    "
    trans-key="simplet.wizard.createStep"
    :title="$t('simplet.wizard.create')"
  >
    <slot>
      <FormSimpletTypeSelect
        v-if="simpletStore.stepSimpletCreate === SimpletCreateStep.TYPE"
        ref="simpletTypeRef"
        class="mx-auto max-w-lg"
      />
      <FormSimpletCollection
        v-if="simpletStore.stepSimpletCreate === SimpletCreateStep.COLLECTION"
        ref="simpletCollectionRef"
        class="mx-auto max-w-lg"
      />
      <FormSimplet
        v-else-if="simpletStore.stepSimpletCreate === SimpletCreateStep.FORM"
        ref="simpletFormRef"
        class="mx-auto max-w-lg"
      />
      <FormSimpletSmtp
        v-else-if="simpletStore.stepSimpletCreate === SimpletCreateStep.SMTP"
        ref="simpletFormSmtpRef"
        class="mx-auto max-w-lg"
        @skip="skipSmtp()"
      />
      <SimpletPreview
        v-else-if="simpletStore.stepSimpletCreate === SimpletCreateStep.REVIEW"
        @back="simpletStore.stepSimpletCreate = SimpletCreateStep.FORM"
        @deploy="deploy()"
      />
      <AnimationDeploy
        v-else-if="simpletStore.stepSimpletCreate === SimpletCreateStep.DEPLOYING"
        class="min-h-full"
        :title="$t('simplet.wizard.deploying')"
        :content="$t('simplet.wizard.deployingInfo')"
      />
      <SimpletDeployed
        v-else-if="simpletStore.stepSimpletCreate === SimpletCreateStep.DEPLOYED"
        class="mx-auto max-w-5xl"
      />
    </slot>
    <template v-if="simpletStore.stepSimpletCreate < SimpletCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn
            v-if="simpletStore.stepSimpletCreate !== SimpletCreateStep.TYPE"
            class="min-w-40"
            type="secondary"
            @click="back"
          >
            {{ $t('general.back') }}
          </Btn>
          <Btn class="min-w-40" @click="nextStep()">{{ $t('form.continue') }} </Btn>
        </div>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: Number, default: 0 },
});
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletStore = useSimpletStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const simpletTypeRef = useTemplateRef('simpletTypeRef');
const simpletCollectionRef = useTemplateRef('simpletCollectionRef');
const simpletFormRef = useTemplateRef('simpletFormRef');
const simpletFormSmtpRef = useTemplateRef('simpletFormSmtpRef');

const totalCredits = 150;
const progress = computed(() => Math.min(100, 20 * (simpletStore.stepSimpletCreate - 1)));

onMounted(async () => {
  await dataStore.waitOnPromises();
  paymentStore.getPriceList();
  simpletStore.getSimpletTemplates();
  embeddedWalletStore.getEmbeddedWallets();
  simpletStore.stepSimpletCreate = 7;
});

watch(
  () => props.type,
  newType => {
    if (newType > 0) {
      simpletStore.form.type = newType;
      simpletStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
    } else {
      simpletStore.stepSimpletCreate = SimpletCreateStep.TYPE;
    }
  }
);

async function submitForm() {
  if (await simpletFormRef.value?.handleSubmit()) {
    simpletStore.stepSimpletCreate =
      simpletStore.form.type === SimpletType.FREE_MINT ? SimpletCreateStep.REVIEW : SimpletCreateStep.SMTP;
  }
}
async function submitFormSmtp() {
  if (await simpletFormSmtpRef.value?.handleSubmit()) {
    simpletStore.stepSimpletCreate = SimpletCreateStep.REVIEW;
  }
}

function back() {
  switch (simpletStore.stepSimpletCreate) {
    case SimpletCreateStep.FORM:
      simpletStore.stepSimpletCreate -= 1;

      break;
    default:
      simpletStore.stepSimpletCreate -= 1;
  }
}
function nextStep() {
  switch (simpletStore.stepSimpletCreate) {
    case SimpletCreateStep.TYPE:
      simpletTypeRef.value?.nextStep();
      if (simpletStore.form.type) {
        simpletStore.stepSimpletCreate += 1;
      }
      break;
    case SimpletCreateStep.COLLECTION:
      simpletCollectionRef.value?.nextStep();
      if (simpletStore.form.collection) {
        simpletStore.stepSimpletCreate += 1;
      }
      break;
    case SimpletCreateStep.FORM:
      submitForm();
      break;
    case SimpletCreateStep.SMTP:
      submitFormSmtp();
      break;
    default:
      simpletStore.stepSimpletCreate += 1;
      break;
  }
}

async function skipSmtp() {
  simpletStore.form.smtp.host = '';
  simpletStore.form.smtp.username = '';
  simpletStore.form.smtp.password = '';
  simpletStore.form.smtp.senderName = '';
  simpletStore.form.smtp.senderEmail = '';
  simpletStore.stepSimpletCreate = SimpletCreateStep.REVIEW;
}

async function deploy() {
  simpletStore.stepSimpletCreate = SimpletCreateStep.DEPLOYING;

  const simpletUuid =
    simpletStore.templates.find(t => t.id === simpletStore.form.type)?.simplet_uuid ||
    simpletStore.templates[0].simplet_uuid;
  const simplet = await createSimplet(simpletUuid);

  simpletStore.stepSimpletCreate = simplet ? SimpletCreateStep.DEPLOYED : SimpletCreateStep.FORM;
}

const prepareVariablesBE = (): KeyValue[] => [
  { key: 'CLAIM_TYPE', value: simpletStore.form.type || SimpletType.AIRDROP },
  { key: 'ADMIN_WALLET', value: simpletStore.form.walletAddress || '' },
  ...(simpletStore.form.smtp.host
    ? [
        { key: 'SMTP_HOST', value: simpletStore.form.smtp.host },
        { key: 'SMTP_PORT', value: simpletStore.form.smtp.port },
        { key: 'SMTP_USERNAME', value: simpletStore.form.smtp.username },
        { key: 'SMTP_PASSWORD', value: simpletStore.form.smtp.password },
        { key: 'SMTP_NAME_FROM', value: simpletStore.form.smtp.senderName },
        { key: 'SMTP_EMAIL_FROM', value: simpletStore.form.smtp.senderEmail },
      ]
    : []),
];
const prepareVariablesFE = (embeddedWallet: string): KeyValue[] => {
  const frontendVariables: KeyValue[] = [
    { key: 'NUXT_PUBLIC_CLAIM_TYPE', value: simpletStore.form.type || SimpletType.AIRDROP },
    { key: 'NUXT_PUBLIC_EMBEDDED_WALLET_CLIENT', value: embeddedWallet },
    ...(simpletStore.form.type === SimpletType.POAP && simpletStore.form.startTime
      ? [{ key: 'NUXT_PUBLIC_CLAIM_START', value: simpletStore.form.startTime }]
      : []),
    ...(simpletStore.form.type === SimpletType.POAP && simpletStore.form.endTime
      ? [{ key: 'NUXT_PUBLIC_CLAIM_END', value: simpletStore.form.endTime }]
      : []),
  ];
  return frontendVariables;
};

async function createSimplet(simpletUuid: string) {
  try {
    const embeddedWallet = await getEmbeddedWallet(simpletStore.form.embeddedWallet);

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: simpletStore.form.name,
      description: simpletStore.form.description,
      apillonApiKey: simpletStore.form.apiKey || null,
      apillonApiSecret: simpletStore.form.apiSecret || null,
      nftCollection_uuid: simpletStore.form.collection,
      backendVariables: prepareVariablesBE(),
      frontendVariables: prepareVariablesFE(embeddedWallet),
    };

    const { data } = await $api.post<SimpletResponse>(endpoints.simpletDeploy(simpletUuid), bodyData);
    simpletStore.active = data;
    message.success(t('nft.collection.websiteDeploy.success'));

    return data;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }
  return null;
}

async function getEmbeddedWallet(integrationUuid?: string | null): Promise<string> {
  if (integrationUuid) return integrationUuid;

  const embeddedWallet = await createEmbeddedWallet();
  return embeddedWallet?.integration_uuid || '';
}

async function createEmbeddedWallet() {
  try {
    const bodyData = {
      title: `Embedded wallet: ${simpletStore.form.name}`,
      description: `Embedded wallet: ${simpletStore.form.description}`,
      project_uuid: dataStore.projectUuid,
    };
    const { data } = await $api.post<EmbeddedWalletResponse>(endpoints.embeddedWalletIntegration, bodyData);
    return data;
  } catch (error: ApiError | any) {
    message.error(userFriendlyMsg(error));
  }
}
</script>
