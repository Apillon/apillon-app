<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <slot>
          <div ref="headingRef">
            <n-space align="center" size="large">
              <NuxtLink :to="{ name: 'dashboard-service-social' }">
                <span class="icon-back text-2xl align-sub"></span>
              </NuxtLink>
              <h2>{{ chatStore.active.name }}</h2>

              <n-space class="" align="center" size="small" :wrap="false">
                <span>{{ $t('social.chat.uuid') }}:</span>
                <n-ellipsis class="text-body align-bottom" :line-clamp="1">
                  {{ chatStore.active.space_uuid }}
                </n-ellipsis>
                <button class="text-body" @click="copyToClipboard(chatStore.active.space_uuid)">
                  <span class="icon-copy"></span>
                </button>
              </n-space>
            </n-space>
          </div>
        </slot>
      </Heading>
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsSocialPost :space-uuid="chatUuid" />

        <TableSocialPost :space-uuid="chatUuid" />

        <div>
          <h3>Grill settings</h3>
        </div>
        <GrillChatSettings />
      </n-space>
    </slot>
    <template #learn> <GrillChat :style="scrollStyle" /> </template>
  </Dashboard>
</template>

<script lang="ts" setup>
import { generateGrillSettings } from '~/stores/social/chat';

const { params } = useRoute();
const router = useRouter();
const $i18n = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();
const postStore = usePostStore();

const pageLoading = ref<boolean>(true);
const headingRef = ref<HTMLElement>();

/** Space UUID from route */
const chatUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');

useHead({
  title: $i18n.t('dashboard.nav.social'),
});

const scrollStyle = computed(() => {
  console.log(headingRef.value?.clientHeight);
  return {
    height: `calc(100vh - ${157 + (headingRef.value?.clientHeight || 0)}px)`,
  };
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const currentChat = await chatStore.getChat(chatUuid.value);

      if (!currentChat?.space_uuid) {
        router.push({ name: 'dashboard-service-social' });
      } else {
        chatStore.active = currentChat;

        await postStore.getPosts(chatUuid.value);

        pageLoading.value = false;
      }
    });
  }, 100);
});
</script>
