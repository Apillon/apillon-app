<template>
  <ModalFullScreen
    :progress="progress"
    :steps="SimpletCreateStep"
    :active-step="simpletStore.stepSimpletCreate"
    trans-key="simplet.wizard.createStep"
    :title="$t('simplet.wizard.create')"
  >
    <slot>
      <FormSimpletTypeSelect v-if="isStep(SimpletCreateStep.TYPE)" ref="simpletTypeRef" class="mx-auto max-w-lg" />
      <FormSimpletCollection
        v-if="isStep(SimpletCreateStep.COLLECTION)"
        ref="simpletCollectionRef"
        class="mx-auto max-w-lg"
      />
      <FormSimplet v-else-if="isStep(SimpletCreateStep.FORM)" ref="simpletFormRef" class="mx-auto max-w-lg" />

      <SimpletPreview
        v-else-if="isStep(SimpletCreateStep.REVIEW)"
        @back="simpletStore.stepSimpletCreate = SimpletCreateStep.FORM"
        @deploy="deploy()"
      />
      <AnimationDeploy
        v-else-if="isStep(SimpletCreateStep.DEPLOYING)"
        class="min-h-full"
        :title="$t('simplet.wizard.deploying')"
        :content="$t('simplet.wizard.deployingInfo')"
      />
      <SimpletDeployed v-else-if="isStep(SimpletCreateStep.DEPLOYED)" class="mx-auto max-w-5xl" />
    </slot>
    <template v-if="simpletStore.stepSimpletCreate < SimpletCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn v-if="!isStep(SimpletCreateStep.TYPE)" class="min-w-40" type="secondary" @click="back">
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
const authStore = useAuthStore();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletStore = useSimpletStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const simpletTypeRef = useTemplateRef('simpletTypeRef');
const simpletCollectionRef = useTemplateRef('simpletCollectionRef');
const simpletFormRef = useTemplateRef('simpletFormRef');

const totalCredits = 150;
const progress = computed(() => Math.min(100, 20 * (simpletStore.stepSimpletCreate - 1)));

onMounted(async () => {
  await dataStore.waitOnPromises();
  paymentStore.getPriceList();
  simpletStore.getSimpletTemplates();
  embeddedWalletStore.getEmbeddedWallets();
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

const isStep = (step: SimpletCreateStep) => simpletStore.stepSimpletCreate === step;

async function submitForm() {
  if (await simpletFormRef.value?.handleSubmit()) {
    simpletStore.stepSimpletCreate = SimpletCreateStep.REVIEW;
  }
  if (simpletStore.form.type !== SimpletType.FREE_MINT) {
    simpletStore.form.smtp.host = 'nft_studio_mail';
    simpletStore.form.smtp.username = authStore.username || authStore.email.split('@')[0];
    simpletStore.form.smtp.password = generatePassword();
    simpletStore.form.smtp.senderName = authStore.username || authStore.email.split('@')[0];
    simpletStore.form.smtp.senderEmail = authStore.email;
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
      if (simpletStore.form.collection?.collection_uuid) {
        simpletStore.stepSimpletCreate += 1;
      }
      break;
    case SimpletCreateStep.FORM:
      submitForm();
      break;
    default:
      simpletStore.stepSimpletCreate += 1;
      break;
  }
}

async function deploy() {
  simpletStore.stepSimpletCreate = SimpletCreateStep.DEPLOYING;

  const simpletUuid =
    simpletStore.templates.find(t => t.name === 'nft-studio-simplet')?.simplet_uuid ||
    simpletStore.templates[0].simplet_uuid;
  const simplet = await createSimplet(simpletUuid);

  simpletStore.stepSimpletCreate = simplet ? SimpletCreateStep.DEPLOYED : SimpletCreateStep.FORM;
}

const prepareVariablesBE = (): EnvVar[] => [
  { key: 'CLAIM_EXPIRES_IN', value: '168' },
  { key: 'CLAIM_TYPE', value: simpletStore.form.type || SimpletType.AIRDROP },
  { key: 'ADMIN_WALLET', value: simpletStore.form.walletAddress || '' },
  { key: 'MYSQL_HOST', value: simpletStore.form.mysql.host },
  { key: 'MYSQL_PORT', value: simpletStore.form.mysql.port },
  { key: 'MYSQL_DATABASE', value: simpletStore.form.mysql.database },
  { key: 'MYSQL_USER', value: simpletStore.form.mysql.user },
  { key: 'MYSQL_PASSWORD', value: simpletStore.form.mysql.password },
  { key: 'MYSQL_ROOT_PASSWORD', value: simpletStore.form.mysql.password },
  { key: 'SMTP_HOST', value: simpletStore.form.smtp.host },
  { key: 'SMTP_PORT', value: simpletStore.form.smtp.port },
  { key: 'SMTP_USERNAME', value: simpletStore.form.smtp.username },
  { key: 'SMTP_PASSWORD', value: simpletStore.form.smtp.password },
  { key: 'SMTP_NAME_FROM', value: simpletStore.form.smtp.senderName },
  { key: 'SMTP_EMAIL_FROM', value: simpletStore.form.smtp.senderEmail },
];
const prepareVariablesFE = (): EnvVar[] =>
  [
    { key: 'NUXT_PUBLIC_CHAIN_ID', value: simpletStore.form.collection?.chain },
    { key: 'NUXT_PUBLIC_CLAIM_TYPE', value: simpletStore.form.type || SimpletType.AIRDROP },
    { key: 'NUXT_PUBLIC_CLAIM_START', value: simpletStore.form.startTime || 0 },
    { key: 'NUXT_PUBLIC_CLAIM_END', value: simpletStore.form.endTime || 0 },
    { key: 'NUXT_PUBLIC_COLLECTION_ADDRESS', value: simpletStore.form.collection?.contractAddress },
    { key: 'NUXT_PUBLIC_SMTP_HOST', value: simpletStore.form.smtp.host },
    simpletStore.form.collectionLogo
      ? [{ key: 'NUXT_PUBLIC_COLLECTION_LOGO', value: simpletStore.form.collectionLogo }]
      : [],
  ].flat();

async function createSimplet(simpletUuid: string) {
  try {
    const embeddedWallet = await getEmbeddedWallet(simpletStore.form.embeddedWallet);

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: simpletStore.form.name,
      description: simpletStore.form.description,
      apillonApiKey: simpletStore.form?.apiKey,
      apillonApiSecret: simpletStore.form?.apiSecret,
      nftCollection_uuid: simpletStore.form.collection?.collection_uuid,
      walletIntegration_uuid: embeddedWallet,
      backendVariables: prepareVariablesBE(),
      frontendVariables: prepareVariablesFE(),
    };

    const { data } = await $api.post<SimpletCreateResponse>(endpoints.simpletDeploy(simpletUuid), bodyData);
    simpletStore.active = data.data;
    message.success(t('simplet.wizard.deployingInfo'));

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
