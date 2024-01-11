<template>
  <h3 v-if="postId">{{ $t('social.post.settings') }}</h3>
  <vue3-ts-jsoneditor
    v-model:json="settings"
    mode="text"
    :readOnly="true"
    :mainMenuBar="false"
    :navigationBar="false"
    :statusBar="false"
    darkTheme
  />
</template>

<script lang="ts" setup>
import vue3TsJsoneditor from 'vue3-ts-jsoneditor';

const props = defineProps({
  spaceId: { type: String, required: true },
  postId: { type: String, default: '' },
});

const settings = props.postId
  ? generateGrillSettings(props.spaceId, props.postId)
  : generateSpaceSettings(props.spaceId);
</script>
