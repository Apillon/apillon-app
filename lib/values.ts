import { DiscreteApiOptions, GlobalThemeOverrides } from 'naive-ui';
import colors from '~~/tailwind.colors';

export const PAGINATION_LIMIT = 20;
export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';

export const LsTableColumnsKeys = {
  FILES: 'al_table_files_columns',
};

/** User roles */
export const UserRoleIds = [
  DefaultUserRole.ADMIN,
  DefaultUserRole.SUPPORT,
  DefaultUserRole.ANALYTIC,
  DefaultUserRole.PROJECT_OWNER,
  DefaultUserRole.PROJECT_ADMIN,
  DefaultUserRole.PROJECT_USER,
  DefaultUserRole.USER,
];

/** User roles */
export function CreateUserRoles(): Array<NSelectOption> {
  return Object.entries(DefaultUserRoles).map(([roleId, role]) => {
    return {
      label: window.$i18n.t(`userRole.${role}`),
      value: parseInt(roleId),
      disabled: parseInt(roleId) === DefaultUserRole.PROJECT_OWNER,
    };
  });
}

/**
 * Theme configs
 */
export const MessageProviderOptoins: DiscreteApiOptions = {
  messageProviderProps: {
    duration: 3000,
    keepAliveOnHover: true,
    max: 4,
    themeOverrides: {
      borderRadius: '0px',
      color: colors.bg.lighter,
      colorError: colors.bg.lighter,
      colorInfo: colors.bg.lighter,
      colorLoading: colors.bg.lighter,
      colorSuccess: colors.bg.lighter,
      colorWarning: colors.bg.lighter,
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
    baseColor: colors.bg.DEFAULT,
    bodyColor: colors.bg.light,
    errorColor: colors.pink,
    infoColor: colors.blue,
    primaryColor: colors.primary,
    primaryColorHover: colors.primary,
    primaryColorPressed: colors.primary,
    successColor: colors.green,
    warningColor: colors.yellow,
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
    fontSizeSmall: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
    fontWeight: 'bold',
    heightMedium: '48px',
    heightLarge: '48px',
    heightSmall: '40px',
    heightTiny: '24px',
    paddingLarge: '8px',
    paddingMedium: '8px 24px',
    paddingSmall: '6px 20px',
    paddingTiny: '1px',
  },
  Card: {
    borderColor: colors.primary,
    borderRadius: '0px',
    color: colors.bg.lighter,
    colorEmbedded: colors.bg.lighter,
    colorEmbeddedModal: colors.bg.lighter,
    colorEmbeddedPopover: colors.bg.lighter,
    colorModal: colors.bg.lighter,
    colorPopover: colors.bg.lighter,
    colorTarget: colors.bg.lighter,
  },
  Checkbox: {
    sizeMedium: '18px',
    sizeLarge: '24px',
    fontSizeMedium: '14px',
    fontSizeLarge: '14px',
    textColor: colors.body,
  },
  Collapse: {
    dividerColor: `${colors.body}66`,
    titleFontWeight: 'bold',
  },
  DataTable: {
    borderColor: colors.bg.lighter,
    thColor: colors.bg.light,
    tdColor: colors.bg.lighter,
    tdColorHover: colors.bg.DEFAULT,
    thFontWeight: '700',
  },
  Dialog: {
    color: colors.bg.lighter,
    contentMargin: '16px 0',
  },
  Drawer: {
    color: colors.bg.dark,
    headerBorderBottom: '0',
    headerPadding: '32px 32px 16px 32px',
    bodyPadding: '16px 32px 16px 32px',
    footerPadding: '16px 32px 32px 32px',
  },
  Form: {
    labelTextColor: colors.white,
  },
  Input: {
    border: `1px solid ${colors.bg.lighter}`,
    borderDisabled: `1px solid ${colors.bg.lighter}`,
    borderError: `1px solid ${colors.pink}`,
    borderFocus: `1px solid ${colors.white}`,
    borderHover: `1px solid ${colors.body}`,
    borderRadius: '0px',
    caretColor: colors.white,
    clearSize: '24px',
    color: colors.bg.light,
    colorDisabled: colors.bg.DEFAULT,
    colorFocus: colors.bg.light,
    colorFocusError: colors.bg.light,
    colorFocusWarning: colors.bg.light,
    fontSizeMedium: '18px',
    heightSmall: '40px',
    heightMedium: '48px',
    heightLarge: '48px',
    iconSize: '24px',
    paddingTiny: '10px',
    paddingSmall: '12px',
    paddingMedium: '20px',
    paddingLarge: '25px',
    placeholderColor: colors.body,
    textColor: colors.white,
    textColorDisabled: colors.bodyDark,
  },
  Layout: {
    textColor: colors.white,
    siderBorderColor: colors.bg.lighter,
  },
  Menu: {
    color: colors.bg.lighter,
    itemColorHover: colors.bg.DEFAULT,
    itemHeight: 'auto',
    itemTextColor: colors.white,
  },
  Message: {
    borderRadius: '0px',
    color: colors.bg.lighter,
    colorError: colors.bg.lighter,
    colorInfo: colors.bg.lighter,
    colorLoading: colors.bg.lighter,
    colorSuccess: colors.bg.lighter,
    colorWarning: colors.bg.lighter,
    iconColorError: colors.pink,
    iconColorInfo: colors.blue,
    iconColorSuccess: colors.green,
    iconColorWarning: colors.yellow,
    textColorError: colors.pink,
    textColorInfo: colors.blue,
    textColorSuccess: colors.green,
    textColorWarning: colors.yellow,
  },
  Modal: {
    color: colors.bg.lighter,
    peers: {
      Card: {
        paddingSmall: '28px 40px',
        paddingMedium: '28px 40px',
        paddingLarge: '32px 48px',
        paddingHuge: '38px 56px',
      },
      Dialog: {
        closeColorHover: 'inherit',
        closeMargin: '32px 42px 0 0',
        contentMargin: '28px 0',
        padding: '28px 40px',
      },
    },
  },
  Progress: {
    fillColor: colors.green,
    fillColorInfo: colors.green,
    fillColorError: colors.pink,
    fillColorSuccess: colors.green,
    railColor: colors.bg.light,
    railHeight: '4px',
  },
  Radio: {
    boxShadow: `inset 0 0 0 1px ${colors.body}`,
    fontSizeSmall: '16px',
    fontSizeMedium: '18px',
    fontSizeLarge: '20px',
    radioSizeSmall: '16px',
    radioSizeMedium: '20px',
    radioSizeLarge: '24px',
    textColor: colors.white,
  },
  Skeleton: {
    color: colors.bg.light,
    colorEnd: colors.bg.lighter,
  },
  Switch: {
    railColor: colors.white,
    railColorActive: colors.white,
    railWidthMedium: '34px',
    railHeightMedium: '14px',
    buttonColor: colors.body,
    buttonHeightMedium: '20px',
    buttonWidthMedium: '20px',
  },
  Tag: {
    color: colors.bg.light,
    colorInfo: colors.blue,
    colorSuccess: colors.bg.light,
    textColor: colors.body,
    textColorInfo: colors.bg.DEFAULT,
    textColorSuccess: colors.green,
  },
  Typography: {
    headerMargin5: '32px 0 16px 0',
  },
  Upload: {
    draggerBorder: `none`,
    draggerBorderHover: `none`,
    draggerColor: colors.bg.light,
  },
  Select: {
    peers: {
      InternalSelection: {
        border: `1px solid ${colors.bg.lighter}`,
        borderActive: `1px solid ${colors.body}`,
        borderFocus: `1px solid ${colors.body}`,
        borderHover: `1px solid ${colors.body}`,
        borderRadius: '0px',
        boxShadowActive: 'none',
        boxShadowFocus: 'none',
        boxShadowHover: 'none',
        color: colors.bg.light,
        colorActive: colors.bg.light,
        colorDisabled: colors.bg.DEFAULT,
        heightLarge: '48px',
        heightMedium: '48px',
        heightSmall: '40px',
        heightTiny: '32px',
      },
      InternalSelectMenu: {
        color: colors.bg.lighter,
        optionHeightLarge: '48px',
        optionHeightMedium: '40px',
        optionHeightSmall: '32px',
      },
    },
  },
};
