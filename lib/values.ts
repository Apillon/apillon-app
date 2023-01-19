import { DiscreteApiOptions, GlobalThemeOverrides } from 'naive-ui';
import colors from '~~/tailwind.colors';

export const PAGINATION_LIMIT = 20;
export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';

export const LsTableColumnsKeys = {
  FILES: 'al_table_files_columns',
};

export const LsW3WarnKeys = {
  NEW_BUCKET: 'al_w3warn_new_bucket',
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
    fontSizeLarge: '14px',
    fontWeight: 'bold',
    heightMedium: '48px',
    heightLarge: '48px',
    heightSmall: '40px',
    heightTiny: '24px',
    paddingLarge: '8px',
    paddingMedium: '8px 24px',
    paddingSmall: '6px 10px',
    paddingTiny: '1px',
  },
  Card: {
    borderColor: colors.primary,
    borderRadius: '0px',
    color: colors.bg.DEFAULT,
    colorEmbedded: colors.bg.DEFAULT,
    colorEmbeddedModal: colors.bg.DEFAULT,
    colorEmbeddedPopover: colors.bg.DEFAULT,
    colorModal: colors.bg.DEFAULT,
    colorPopover: colors.bg.DEFAULT,
    colorTarget: colors.bg.DEFAULT,
    paddingMedium: '16px 64px 16px 64px',
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
    tdColor: colors.bg.DEFAULT,
    tdColorHover: colors.bg.dark,
    tdTextColor: colors.white,
    thColor: colors.bg.DEFAULT,
    thColorHover: colors.bg.DEFAULT,
    thFontWeight: '700',
    thTextColor: colors.white,
  },
  Dialog: {
    border: `1px solid ${colors.bg.lighter}`,
    borderRadius: '0px',
    closeBorderRadius: '50%',
    closeColorHover: colors.white,
    closeColorPressed: colors.white,
    closeIconColor: colors.white,
    closeIconColorPressed: colors.bg.DEFAULT,
    closeIconColorHover: colors.bg.DEFAULT,
    color: colors.bg.DEFAULT,
    contentMargin: '16px 0',
  },
  Divider: {
    color: colors.white,
  },
  Drawer: {
    color: colors.bg.dark,
    headerBorderBottom: '0',
    headerPadding: '32px 32px 16px 32px',
    bodyPadding: '16px 32px 16px 32px',
    footerPadding: '16px 32px 32px 32px',
  },
  Dropdown: {
    borderRadius: '0px',
    color: colors.bg.dark,
    fontSizeSmall: '12px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
    fontSizeHuge: '18px',
    optionColorActive: colors.bg.lighter,
    optionColorHover: colors.bg.lighter,
    optionTextColor: colors.white,
    optionTextColorHover: colors.white,
    optionTextColorActive: colors.white,
    optionTextColorChildActive: colors.white,
    padding: '16px 12px',
  },
  Form: {
    feedbackHeightSmall: '24px',
    feedbackHeightMedium: '32px',
    feedbackHeightLarge: '40px',
    labelFontSizeTopSmall: '10px',
    labelFontSizeLeftSmall: '10px',
    labelFontSizeLeftMedium: '12px',
    labelFontSizeTopMedium: '12px',
    labelFontSizeLeftLarge: '14px',
    labelFontSizeTopLarge: '14px',
    labelPaddingVertical: '0 0 8px',
    labelTextColor: colors.white,
  },
  Input: {
    border: `1px solid ${colors.bg.lighter}`,
    borderFocus: `1px solid ${colors.body}`,
    borderHover: `1px solid ${colors.body}`,
    borderError: `1px solid ${colors.pink}`,
    borderFocusError: `1px solid ${colors.pink}`,
    borderHoverError: `1px solid ${colors.pink}`,
    borderDisabled: `1px solid ${colors.bg.lighter}`,
    borderRadius: '0px',
    boxShadowFocus: 'none',
    boxShadowFocusError: 'none',
    boxShadowFocusWarning: 'none',
    caretColor: colors.white,
    clearSize: '24px',
    color: colors.bg.light,
    colorDisabled: colors.bg.dark,
    colorFocus: colors.bg.light,
    colorFocusError: colors.bg.light,
    colorFocusWarning: colors.bg.light,
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
    groupLabelTextColor: colors.white,
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
    borderColorHorizontal: colors.yellow,
    borderRadius: '0px',
    groupTextColorInverted: colors.violet,
    itemColorHoverInverted: colors.bg.lighter,
    itemColorActiveInverted: colors.bg.lighter,
    itemColorActiveHoverInverted: colors.bg.lighter,
    itemColorActiveCollapsedInverted: colors.bg.lighter,
    itemHeight: '40px',
    itemTextColorInverted: colors.white,
    itemTextColorActiveInverted: colors.white,
    itemTextColorHoverInverted: colors.white,
    itemTextColorChildActiveHoverInverted: colors.white,
    itemTextColorHorizontal: colors.bodyDark,
    itemTextColorActiveHorizontal: colors.white,
    itemTextColorActiveHoverHorizontal: colors.white,
    itemTextColorHoverHorizontal: colors.body,
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
    color: colors.bg.DEFAULT,
    peers: {
      Card: {
        borderColor: colors.bg.lighter,
        borderRadius: '0px',
        paddingSmall: '28px 40px',
        paddingMedium: '32px 64px',
        paddingLarge: '32px 64px',
        paddingHuge: '32px 64px',
      },
      Dialog: {
        border: `1px solid ${colors.bg.lighter}`,
        borderRadius: '0px',
        closeColorHover: 'inherit',
        closeMargin: '-24px -24px 0 0',
        contentMargin: '16px 0',
        padding: '64px 64px 32px',
      },
    },
  },
  Popover: {
    arrowHeight: '16px',
    spaceArrow: '16px',
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
    fontSizeSmall: '12px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',

    radioSizeSmall: '16px',
    radioSizeMedium: '20px',
    radioSizeLarge: '24px',

    textColor: colors.white,

    buttonBorderColor: colors.bg.lighter,
    buttonBorderColorActive: colors.body,
    buttonBorderColorHover: colors.body,

    buttonBorderRadius: '0px',
    buttonColor: colors.bg.light,
    buttonColorActive: colors.bg.lighter,
    colorDisabled: colors.bg.DEFAULT,

    buttonTextColor: colors.white,
    buttonTextColorActive: colors.white,
    buttonTextColorHover: colors.white,
    textColorDisabled: colors.white,

    buttonBoxShadow: 'none',
    buttonBoxShadowFocus: 'none',
    buttonBoxShadowHover: 'none',
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
  Tabs: {
    panePaddingMedium: '32px 0 0',
    tabBorderColor: colors.grey.lightBg,
  },
  Tag: {
    border: `1px solid ${colors.body}`,
    borderError: `1px solid ${colors.pink}`,
    borderInfo: `1px solid ${colors.blue}`,
    borderPrimary: `1px solid ${colors.primary}`,
    borderSuccess: `1px solid ${colors.green}`,
    borderWarning: `1px solid ${colors.orange}`,
    color: colors.bg.light,
    colorInfo: colors.blue,
    colorSuccess: colors.green,
    fontWeightStrong: 'bold',
    padding: '1px 16px',
    textColor: colors.body,
    textColorInfo: colors.blue,
    textColorSuccess: colors.bg.dark,
    textColorWarning: colors.orange,
  },
  Tooltip: {
    borderRadius: '6px',
    boxShadow: 'none',
    color: colors.bg.lighter,
    padding: '8px 12px',
    textColor: colors.white,
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
        arrowColor: colors.white,
        arrowSize: '24px',
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
        borderRadius: '0px',
        color: colors.bg.dark,
        optionCheckColor: colors.bg.lighter,
        optionColorActive: colors.bg.lighter,
        optionColorActivePending: colors.bg.lighter,
        optionColorPending: colors.bg.lighter,
        optionHeightLarge: '48px',
        optionHeightMedium: '48px',
        optionHeightSmall: '32px',
        paddingSmall: '0px 10px',
        paddingMedium: '0px 10px',
        paddingLarge: '0px 20px',
        actionTextColor: colors.white,
        optionTextColor: colors.white,
        optionTextColorActive: colors.white,
        optionTextColorPressed: colors.white,
      },
    },
  },
};
