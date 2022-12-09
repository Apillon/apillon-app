import { DiscreteApiOptions, GlobalThemeOverrides } from 'naive-ui';
import colors from '~~/tailwind.colors';

export const PAGINATION_LIMIT = 20;

export enum FileUploadStatusValue {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  FINISHED = 'finished',
  REMOVED = 'removed',
  ERROR = 'error',
}
export type FileUploadStatus =
  | FileUploadStatusValue.PENDING
  | FileUploadStatusValue.UPLOADING
  | FileUploadStatusValue.FINISHED
  | FileUploadStatusValue.REMOVED
  | FileUploadStatusValue.ERROR;

export const MessageProviderOptoins: DiscreteApiOptions = {
  messageProviderProps: {
    duration: 5000,
    keepAliveOnHover: true,
    max: 4,
    themeOverrides: {
      borderRadius: '0px',
      color: colors.grey.lightBg,
      colorError: colors.grey.lightBg,
      colorInfo: colors.grey.lightBg,
      colorLoading: colors.grey.lightBg,
      colorSuccess: colors.grey.lightBg,
      colorWarning: colors.grey.lightBg,
      iconColorError: colors.pink,
      iconColorInfo: colors.blue,
      iconColorSuccess: colors.green,
      iconColorWarning: colors.yellow,
      textColorError: colors.pink,
      textColorInfo: colors.blue,
      textColorSuccess: colors.green,
      textColorWarning: colors.yellow,
    },
  },
};

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colors.primary,
    primaryColorHover: colors.primary,
    primaryColorPressed: colors.primary,
  },
  Alert: {},
  Button: {
    borderPrimary: `2px solid ${colors.primary}`,
    borderFocusPrimary: `2px solid ${colors.primary}`,
    borderHoverPrimary: `2px solid ${colors.primary}`,
    borderPressedPrimary: `2px solid ${colors.primary}`,
    borderRadiusTiny: '0px',
    borderRadiusSmall: '0px',
    borderRadiusMedium: '0px',
    borderRadiusLarge: '0px',
    colorQuaternary: 'transparent',
    colorQuaternaryHover: colors.primary,
    colorQuaternaryPressed: colors.primary,
    fontSizeMedium: '16px',
    fontSizeLarge: '16px',
    fontWeight: 'bold',
    heightMedium: '48px',
    heightLarge: '48px',
    heightSmall: '32px',
    heightTiny: '22px',
    paddingLarge: '8px',
    paddingMedium: '8px 25px',
    paddingSmall: '6px 12px',
    paddingTiny: '1px',
  },
  Card: {
    borderColor: colors.primary,
    borderRadius: '0px',
    color: colors.grey.lightBg,
    colorEmbedded: colors.grey.lightBg,
    colorEmbeddedModal: colors.grey.lightBg,
    colorEmbeddedPopover: colors.grey.lightBg,
    colorModal: colors.grey.lightBg,
    colorPopover: colors.grey.lightBg,
    colorTarget: colors.grey.lightBg,
  },
  Checkbox: {
    sizeMedium: '18px',
    sizeLarge: '24px',
    fontSizeMedium: '14px',
    fontSizeLarge: '14px',
    textColor: colors.grey.DEFAULT,
  },
  Collapse: {
    dividerColor: `${colors.grey.DEFAULT}66`,
    titleFontWeight: 'bold',
  },
  DataTable: {
    borderColor: colors.grey.lightBg,
    thColor: colors.grey.dark,
    tdColor: colors.grey.lightBg,
    tdColorHover: colors.dark,
    thFontWeight: '700',
  },
  Dialog: {
    color: colors.grey.lightBg,
  },
  Drawer: {
    color: colors.black,
    headerBorderBottom: '0',
    headerPadding: '32px 32px 16px 32px',
    bodyPadding: '16px 32px 16px 32px',
    footerPadding: '16px 32px 32px 32px',
  },
  Form: {
    labelTextColor: colors.grey.light,
  },
  Input: {
    heightSmall: '32px',
    heightMedium: '48px',
    heightLarge: '48px',
    fontSizeMedium: '18px',
    caretColor: colors.primary,
    color: colors.grey.dark,
    textColor: colors.grey.light,
    border: `1px solid ${colors.grey.DEFAULT}`,
    borderFocus: `1px solid ${colors.primary}`,
    borderHover: `1px solid ${colors.primary}`,
    borderError: `1px solid ${colors.pink}`,
    borderRadius: '0px',
    paddingTiny: '16px',
    paddingSmall: '6px  8px',
    paddingMedium: '20px',
    paddingLarge: '25px',
    placeholderColor: colors.grey.DEFAULT,
  },
  Layout: {
    textColor: colors.grey.light,
  },
  Menu: {
    color: colors.grey.lightBg,
    itemColorHover: colors.dark,
    itemHeight: 'auto',
    itemTextColor: colors.grey.light,
  },
  Message: {
    borderRadius: '0px',
    color: colors.grey.lightBg,
    colorError: colors.grey.lightBg,
    colorInfo: colors.grey.lightBg,
    colorLoading: colors.grey.lightBg,
    colorSuccess: colors.grey.lightBg,
    colorWarning: colors.grey.lightBg,
    iconColorError: colors.pink,
    iconColorInfo: colors.blue,
    iconColorSuccess: colors.green,
    iconColorWarning: colors.yellow,
    textColorError: colors.pink,
    textColorInfo: colors.blue,
    textColorSuccess: colors.green,
    textColorWarning: colors.yellow,
  },
  Progress: {
    fillColor: colors.green,
    fillColorInfo: colors.green,
    fillColorError: colors.pink,
    fillColorSuccess: colors.green,
    railColor: colors.grey.lightBg,
    railHeight: '4px',
  },
  Radio: {
    boxShadow: `inset 0 0 0 1px ${colors.grey.DEFAULT}`,
    fontSizeSmall: '16px',
    fontSizeMedium: '18px',
    fontSizeLarge: '20px',
    radioSizeSmall: '16px',
    radioSizeMedium: '20px',
    radioSizeLarge: '24px',
    textColor: colors.grey.light,
  },
  Skeleton: {
    color: colors.grey.lightBg,
    colorEnd: colors.grey.DEFAULT,
  },
  Switch: {
    railColor: colors.grey.light,
    railColorActive: colors.grey.light,
    railWidthMedium: '34px',
    railHeightMedium: '14px',
    buttonColor: colors.grey.DEFAULT,
    buttonHeightMedium: '20px',
    buttonWidthMedium: '20px',
  },
  Tag: {
    color: colors.grey.dark,
    colorInfo: colors.blue,
    colorSuccess: colors.grey.dark,
    textColor: colors.grey.DEFAULT,
    textColorInfo: colors.dark,
    textColorSuccess: colors.green,
  },
  Upload: {
    draggerBorder: `none`,
    draggerBorderHover: `none`,
    draggerColor: colors.grey.dark,
  },
  Select: {
    peers: {
      InternalSelection: {
        border: `1px solid ${colors.grey.DEFAULT}`,
        borderRadius: '0px',
        heightSmall: '24px',
        heightMedium: '48px',
        heightLarge: '48px',
        color: colors.transparent,
      },
      InternalSelectMenu: {
        color: colors.grey.lightBg,
      },
    },
  },
};
