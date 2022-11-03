import {
  create,
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NConfigProvider,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NDropdown,
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NH1,
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NInput,
  NMenu,
  NMessageProvider,
  NModal,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NRadio,
  NRadioGroup,
  NScrollbar,
  NSkeleton,
  NSelect,
  NSpace,
  NSwitch,
  NTag,
  NText,
  NTooltip,
} from 'naive-ui';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(
    create({
      components: [
        NAlert,
        NButton,
        NCard,
        NCheckbox,
        NCollapse,
        NCollapseItem,
        NConfigProvider,
        NDataTable,
        NDrawer,
        NDrawerContent,
        NDropdown,
        NForm,
        NFormItem,
        NFormItemGi,
        NGrid,
        NH1,
        NH2,
        NH3,
        NH4,
        NH5,
        NH6,
        NInput,
        NMenu,
        NMessageProvider,
        NModal,
        NLayout,
        NLayoutContent,
        NLayoutHeader,
        NLayoutSider,
        NRadio,
        NRadioGroup,
        NScrollbar,
        NSkeleton,
        NSelect,
        NSpace,
        NSwitch,
        NTag,
        NText,
        NTooltip,
      ],
    })
  );
});
