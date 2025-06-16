<template>
  <div class="lg:pr-[4.5rem] hd:pr-80">
    <div class="mx-auto max-w-4xl pb-8 pt-4">
      <div class="mb-12 flex gap-8">
        <div class="md:w-1/2">
          <h3>{{ $t(`service.${name}.name`) }}</h3>
          <p class="my-4">{{ $t(`service.${name}.info`) }}</p>

          <div class="mt-2 flex flex-wrap gap-2">
            <Tag
              v-for="(item, key) in translateItems(`service.${name}.tags`)"
              :key="key"
              size="small"
              :type="key === 0 ? 'success' : 'default'"
            >
              {{ item }}
            </Tag>
          </div>
        </div>
        <div v-if="$te(`service.${name}.pricing`)" class="card p-4 text-xs md:w-1/2">
          <div v-if="service === ServiceTypeName.NFT" class="flex items-center justify-between">
            <small>{{ $t('dashboard.supported') }}</small>
            <NftChains :chains="enumKeys(EvmChainMainnet)" />
          </div>
          <PoweredBy
            v-else-if="[ServiceTypeName.HOSTING, ServiceTypeName.STORAGE].includes(service)"
            class="font-semibold text-white-terciary"
            :icons="['logo/crust', 'library/python', 'library/javascript', 'library/nextjs']"
          />
          <PoweredBy v-else-if="service === ServiceTypeName.EMBEDDED_WALLET" class="font-semibold text-white-terciary">
            <NuxtIcon name="logo/oasis_logo" class="icon-auto h-6 w-14 text-white" filled />
          </PoweredBy>
          <PoweredBy v-else-if="service === ServiceTypeName.INDEXING" class="font-semibold text-white-terciary">
            <NuxtIcon name="logo/sqd" class="icon-auto h-6 w-14 text-white" filled />
          </PoweredBy>
          <PoweredBy v-else-if="poweredBy" class="font-semibold text-white-terciary">
            <NuxtIcon :name="`logo/${poweredBy}`" class="icon-auto h-6 text-white" filled />
          </PoweredBy>
          <hr class="my-4 w-full border-bg-lighter" />

          <div class="flex items-center justify-between">
            <small>{{ $t('dashboard.credits.pricing') }}</small>
            <div class="pl-2 text-right">
              <p>
                <strong>{{ $t(`service.${name}.pricing`) }}</strong>
              </p>

              <ModalCreditCosts :service="service" :show-create-collection="service === ServiceTypeName.NFT">
                <template #button>
                  <span class="underline hover:text-yellow">{{ $t('dashboard.details') }} </span>
                </template>
              </ModalCreditCosts>
            </div>
          </div>
        </div>
      </div>

      <small>{{ $t('dashboard.introduction') }}</small>
      <n-card class="card-light mb-10 mt-2" size="medium">
        <div class="-my-2">
          <div class="flex justify-between gap-4">
            <div class="flex max-w-96 flex-col justify-evenly gap-6">
              <div
                v-for="(i, key) in introduction"
                :key="key"
                class="px-4"
                :class="key >= 0 ? 'border-l-2 border-blue' : 'text-hover'"
              >
                <strong>{{ i.title }}</strong>
                <span class="mt-2 block">{{ i.content }}</span>
              </div>
            </div>
            <div v-if="image" class="text-center lg:w-[44%]">
              <img :src="image" class="mx-auto" height="280" :alt="name" />
            </div>
            <div v-else class="card card-lighter pb-9 pl-8 pt-8 text-right lg:w-[44%]">
              <NuxtIcon name="nft/new_collection" class="icon-auto ml-auto inline-block" filled />
            </div>
          </div>
          <hr class="my-4 w-full border-bg-lighter" />
          <div class="flex justify-between gap-4">
            <Btn
              v-if="videoId"
              class="no-underline"
              size="large"
              type="tertiary"
              inner-class="flex gap-2 items-center"
              @click="showVideo = true"
            >
              <span class="icon-video text-xl text-yellow"></span>
              <span class="text-white underline">{{ $t('dashboard.youTube.demo') }}</span>
            </Btn>
            <span v-else></span>

            <div class="flex justify-between gap-2">
              <BtnDocumentation v-if="docs" class="flex-1" :href="docs" size="large" />

              <div class="flex-1 lg:min-w-48">
                <slot v-if="dataStore.project.selected" name="actions"> </slot>
                <Btn v-else size="large" @click="modalCreateProjectVisible = true">
                  {{ $t('dashboard.startBuilding') }}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </n-card>

      <small v-if="guides.length">{{ $t('general.learnMore') }}</small>
      <div class="mt-2 grid grid-cols-nft gap-4">
        <div
          v-for="(guide, key) in guides"
          :key="key"
          class="card-dark relative flex flex-col gap-4 p-4"
          :class="{ 'hover:border-white': guide?.link }"
        >
          <NuxtLink
            v-if="guide?.link"
            :href="guide.link"
            class="inline-flex-cc absolute right-4 top-4 h-5 w-5 -rotate-45 rounded-full transition-colors duration-300 hover:bg-bg-lighter"
            target="_blank"
          >
            <span class="icon-wide-right text-xl"></span>
          </NuxtLink>
          <div class="flex gap-2">
            <Tag size="small" type="info"> Guide </Tag>
          </div>

          <div class="min-h-10 text-white">
            <strong>{{ guide.title }}</strong>
          </div>
          <div>
            <p class="text-xs text-white-secondary">{{ guide.content }}</p>
          </div>
          <NuxtLink v-if="guide?.link" :href="guide.link" class="absolute left-0 top-0 h-full w-full" target="_blank">
          </NuxtLink>
        </div>
      </div>

      <slot />

      <!-- Modal - Create new project -->
      <modal v-model:show="modalCreateProjectVisible" :title="$t('project.new')">
        <FormProject @submit-success="modalCreateProjectVisible = false" @close="modalCreateProjectVisible = false" />
      </modal>

      <Drawer v-model:show="showVideo">
        <DemoVideo :video-id="videoId" :chapters="videoChapters" />
      </Drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: { type: String, required: true },
  service: { type: String as PropType<ServiceTypeName>, required: true },
  guides: { type: Array<ServiceGuide>, default: [] },
  docs: { type: String, default: null },
  image: { type: String, default: null },
  poweredBy: { type: String, default: null },
  videoId: { type: String, default: null },
  videoChapters: { type: Array<VideoChapter>, default: null },
});

const dataStore = useDataStore();
const { generateIntroduction } = useService();
const introduction = generateIntroduction(props.name);

const showVideo = ref<boolean>(false);
const modalCreateProjectVisible = ref<boolean>(false);
</script>
