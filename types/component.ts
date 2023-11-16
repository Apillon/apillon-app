import type {
  DataTableColumns,
  DropdownGroupOption,
  DropdownOption,
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  FormValidationError,
  SelectOption,
  TagProps,
  UploadCustomRequestOptions,
  UploadFileInfo,
} from 'naive-ui';
import type {
  InternalRowData,
  TableBaseColumn,
  TableColumn,
  TableColumnGroup,
  TableExpandColumn,
  TableSelectionColumn,
} from 'naive-ui/es/data-table/src/interface';
import { MenuOption } from 'naive-ui/es/menu/src/interface';
import { SettledFileInfo } from 'naive-ui/es/upload/src/interface';

export {};

declare global {
  type KeyTitle = {
    title: string;
    key: string;
  };
  type MetadataAttributes = {
    value: string;
    label: string;
    display_type: string;
    hidden?: boolean;
  };

  interface SocialInterface {
    name: string;
    link: string;
    icon?: string;
    iconName?: string;
  }

  interface FileListItemType extends SettledFileInfo {
    percentage: number;
    size: number;
    timestamp: number;
    path?: string;
    progress?: any;
    uploadSpeed?: number;
    onFinish: any;
    onError: any;
  }

  interface UploadFileType {
    contentType: string;
    fileName: string;
    path: string;
  }

  interface MainNavItemInterface {
    name: string;
    icon: string;
    link?: string;
    soon?: boolean;
    new?: boolean;
    disabled?: boolean;
  }
  interface MainNavInterface {
    [key: string]: {
      disabled: boolean;
      items: Array<MainNavItemInterface>;
    };
  }

  /** Naive UI */
  interface NFormInst extends FormInst {}
  interface NFormItemInst extends FormItemInst {}
  interface NFormRules extends FormRules {}
  interface NFormItemRule extends FormItemRule {}
  interface NFormValidationError extends FormValidationError {}
  interface NSelectOption extends SelectOption {}
  interface NUploadCustomRequestOptions extends UploadCustomRequestOptions {}

  type FileUploadOptions = {
    file: UploadFileInfo;
    fileList: UploadFileInfo[];
    event?: Event;
  };

  interface NRadioOption extends SelectOption {
    label: string;
  }

  type NDataTableColumns<T = InternalRowData> = DataTableColumns<T>;
  type NMenuOption = MenuOption;

  type NTableColumns<T = InternalRowData> = Array<TableColumn<T>>;
  type NTableColumn<T = InternalRowData> =
    | TableColumnGroup<T>
    | TableBaseColumn<T>
    | TableSelectionColumn<T>
    | TableExpandColumn<T>;

  type DropdownRenderOption = {
    node: VNode;
    option: DropdownOption | DropdownGroupOption;
  };

  type TagType = TagProps['type'];
}
