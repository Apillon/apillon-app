<template>
  <Heading :service="ServiceTypeName.SOCIAL" :headline="$t('dashboard.nav.social')">
    <template #details>
      <n-space :size="32" align="center">
        <Notification type="warning">
          <p>{{ $t('w3Warn.social.info') }}</p>
          <p>
            <Btn type="link" href="https://grill.chat/">Grill.chat</Btn>
            {{ $t('w3Warn.social.grillChat') }}
          </p>
        </Notification>
      </n-space>
    </template>

    <template #submenu>
      <MenuSocial />
    </template>
  </Heading>
</template>

<script lang="ts" setup></script>
