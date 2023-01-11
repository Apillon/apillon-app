import {
  CollapseProps,
  create,
  DataTableColumns,
  DataTableInst,
  DataTableSortState,
  NEllipsis,
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  FormValidationError,
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NCheckboxGroup,
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
  NProgress,
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
  NUpload,
  NUploadDragger,
  NUploadFileList,
  NUploadTrigger,
  SelectOption,
  SelectProps,
  UploadCustomRequestOptions,
  UploadFileInfo,
} from 'naive-ui';
import { InternalRowData } from 'naive-ui/es/data-table/src/interface';
import { MenuOption, MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { RendererNode, RendererElement } from 'vue';

declare global {
  interface NCollapseProps extends CollapseProps {}
  interface NFormInst extends FormInst {}
  interface NFormItemInst extends FormItemInst {}
  interface NFormRules extends FormRules {}
  interface NFormItemRule extends FormItemRule {}
  interface NFormValidationError extends FormValidationError {}
  interface NSelectOption extends SelectOption {}
  interface NSelectProps extends SelectProps {}
  interface NUploadCustomRequestOptions extends UploadCustomRequestOptions {}
  interface NUploadFileInfo extends UploadFileInfo {}
  interface NDataTableInst extends DataTableInst {}
  interface NDataTableSortState extends DataTableSortState {}
  interface NMessageApiInjection extends MessageApiInjection {}

  type NDataTableColumns<T = InternalRowData> = DataTableColumns<T>;
  type NMenuOption = MenuOption;
  type NMenuMixedOption = MenuMixedOption;

  interface VueRendererNode extends RendererNode {}
  interface VueRendererElement extends RendererElement {}
}
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(
    create({
      components: [
        NAlert,
        NButton,
        NCard,
        NCheckbox,
        NCheckboxGroup,
        NCollapse,
        NCollapseItem,
        NConfigProvider,
        NDataTable,
        NDrawer,
        NDrawerContent,
        NDropdown,
        NEllipsis,
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
        NProgress,
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
        NUpload,
        NUploadDragger,
        NUploadFileList,
        NUploadTrigger,
      ],
    })
  );
});
