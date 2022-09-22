<template>
  <div id="app" class="min-h-screen">
    <NuxtLayout>
      <portal-target :name="Portals.LAYOUT" multiple />

      <LayoutHeader />

      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
