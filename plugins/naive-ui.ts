import {
  CollapseProps,
  create,
  DataTableColumns,
  DataTableInst,
  DataTableRowKey,
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
  NDivider,
  NDrawer,
  NDrawerContent,
  NDropdown,
  NForm,
  NFormItem,
  NFormItemGi,
  NGi,
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
  NRadioButton,
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
  NTabs,
  NTabPane,
} from 'naive-ui';
import { InternalRowData } from 'naive-ui/es/data-table/src/interface';
import { MenuOption, MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { FileInfo } from 'naive-ui/es/upload/src/interface';

declare global {
  interface NCollapseProps extends CollapseProps {}
  interface NFileInfo extends FileInfo {}
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

  interface NRadioOption extends SelectOption {
    label: string;
  }

  type NDataTableColumns<T = InternalRowData> = DataTableColumns<T>;
  type NDataTableRowKey = DataTableRowKey;
  type NMenuOption = MenuOption;
  type NMenuMixedOption = MenuMixedOption;
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
        NDivider,
        NDrawer,
        NDrawerContent,
        NDropdown,
        NEllipsis,
        NForm,
        NFormItem,
        NFormItemGi,
        NGi,
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
        NRadioButton,
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
        NTabs,
        NTabPane,
      ],
    })
  );
});
