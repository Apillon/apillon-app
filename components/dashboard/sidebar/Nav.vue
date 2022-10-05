<template>
  <n-collapse
    arrow-placement="right"
    :default-expanded-names="['services', 'monitoring', 'configuration']"
  >
    <n-collapse-item title="Services" name="services">
      <div>
        <NuxtLink to="authentication">
          <span class="icon-authentication"></span>
          Authentication
        </NuxtLink>
      </div>
      <div class="clear-both">
        <NuxtLink to="storage">
          <span class="icon-storage"></span>
          Storage
          <n-tag class="float-right" size="small" :bordered="false">Coming soon</n-tag>
        </NuxtLink>
      </div>
      <div class="clear-both">
        <NuxtLink to="computing">
          <span class="icon-computing"></span>
          Computing
          <n-tag class="float-right" size="small" :bordered="false">Coming soon</n-tag>
        </NuxtLink>
      </div>
    </n-collapse-item>
    <n-collapse-item title="Monitoring" name="monitoring">
      <div>
        <span class="icon-analytics"></span>
        Analytics
      </div>
      <div>
        <span class="icon-service-monitor"></span>
        Service monitor
      </div>
    </n-collapse-item>
    <n-collapse-item title="Configuration" name="configuration">
      <div>
        <span class="icon-project-setting"></span>
        Project settings
      </div>
      <div>
        <span class="icon-acess"></span>
        Access
      </div>
      <div>
        <span class="icon-billing"></span>
        Billing
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem, NTag } from 'naive-ui';
</script>
