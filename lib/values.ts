import { DiscreteApiOptions, GlobalThemeOverrides, MessageProviderProps } from 'naive-ui';
import colors from '~~/tailwind.colors';

export const PAGINATION_LIMIT = 20;
export const CACHE_EXPIRATION_IN_MS = 60 * 1000; // One minute
export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';

export const LsTableColumnsKeys = {
  FILES: 'al_table_files_columns',
};

export const LsW3WarnKeys = {
  BUCKET_NEW: 'al_w3warn_bucket_new',
  BUCKET_DELETE: 'al_w3warn_bucket_delete',
  BUCKET_DESTROYED: 'al_w3warn_bucket_destroyed',
  BUCKET_ITEM_DELETE: 'al_w3warn_bucket_item_delete',
  HOSTING_NEW: 'al_w3warn_hosting_new',
};

export const LsCacheKeys = {
  API_KEYS: 'al_cache_api_keys',
  BUCKET: 'al_cache_bucket',
  BUCKETS: 'al_cache_buckets',
  BUCKET_ITEMS: 'al_cache_bucket_items',
  BUCKET_DESTROYED: 'al_cache_bucket_destroyed',
  DEPLOYMENT: 'al_cache_deployment',
  DEPLOYMENTS_PRODUCTION: 'al_cache_deployments_production',
  DEPLOYMENTS_STAGING: 'al_cache_deployments_staging',
  FILE_ALL: 'al_cache_file_all',
  FILE_DELETED: 'al_cache_file_deleted',
  WEBPAGE: 'al_cache_webpage',
  WEBPAGES: 'al_cache_webpages',
};

/** User roles */
export const UserRoleIds = [
  DefaultUserRole.ADMIN,
  DefaultUserRole.SUPPORT,
  DefaultUserRole.ANALYTIC,
  DefaultUserRole.PROJECT_OWNER,
  DefaultUserRole.PROJECT_ADMIN,
  DefaultUserRole.PROJECT_USER,
  DefaultUserRole.INTERNAL_TEST_USER,
  DefaultUserRole.EXTERNAL_TEST_USER,
  DefaultUserRole.BETA_USER,
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

type MessageThemeOverrides = NonNullable<MessageProviderProps['themeOverrides']>;
const messageOverrides: MessageThemeOverrides = {
  borderRadius: '8px',
  closeIconColor: colors.bg.DEFAULT,
  closeIconColorError: colors.bg.DEFAULT,
  closeIconColorHover: colors.bg.DEFAULT,
  closeIconColorHoverError: colors.bg.DEFAULT,
  closeIconColorHoverInfo: colors.bg.DEFAULT,
  closeIconColorHoverLoading: colors.bg.DEFAULT,
  closeIconColorHoverSuccess: colors.bg.DEFAULT,
  closeIconColorHoverWarning: colors.bg.DEFAULT,
  closeIconColorInfo: colors.bg.DEFAULT,
  closeIconColorLoading: colors.bg.DEFAULT,
  closeIconColorPressed: colors.bg.DEFAULT,
  closeIconColorPressedError: colors.bg.DEFAULT,
  closeIconColorPressedInfo: colors.bg.DEFAULT,
  closeIconColorPressedLoading: colors.bg.DEFAULT,
  closeIconColorPressedSuccess: colors.bg.DEFAULT,
  closeIconColorPressedWarning: colors.bg.DEFAULT,
  closeIconColorSuccess: colors.bg.DEFAULT,
  closeIconColorWarning: colors.bg.DEFAULT,
  color: colors.white,
  colorError: colors.white,
  colorInfo: colors.white,
  colorLoading: colors.white,
  colorSuccess: colors.white,
  colorWarning: colors.white,
  iconColor: colors.bg.DEFAULT,
  iconColorError: colors.bg.DEFAULT,
  iconColorInfo: colors.bg.DEFAULT,
  iconColorLoading: colors.bg.DEFAULT,
  iconColorSuccess: colors.bg.DEFAULT,
  iconColorWarning: colors.bg.DEFAULT,
  maxWidth: '380px',
  padding: '24px',
  textColor: colors.bg.DEFAULT,
  textColorError: colors.bg.DEFAULT,
  textColorInfo: colors.bg.DEFAULT,
  textColorLoading: colors.bg.DEFAULT,
  textColorSuccess: colors.bg.DEFAULT,
  textColorWarning: colors.bg.DEFAULT,
};

/**
 * Theme configs
 */
export const MessageProviderOptoins: DiscreteApiOptions = {
  messageProviderProps: {
    duration: 3000,
    closable: true,
    keepAliveOnHover: true,
    max: 4,
    placement: 'bottom-right',
    themeOverrides: messageOverrides,
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
    border: `1px solid ${colors.bg.lighter}`,
    borderDisabled: `1px solid ${colors.bg.lighter}`,
    borderError: `1px solid ${colors.bg.lighter}`,
    borderFocusError: `1px solid ${colors.pink}`,
    borderHoverError: `1px solid ${colors.pink}`,
    borderPressedError: `1px solid ${colors.pink}`,
    borderFocus: `1px solid ${colors.bg.lighter}`,
    borderHover: `1px solid ${colors.bg.lighter}`,
    borderPrimary: `1px solid ${colors.bg.lighter}`,
    borderFocusPrimary: `1px solid ${colors.bg.lighter}`,
    borderHoverPrimary: `1px solid ${colors.primary}`,
    borderPressedPrimary: `1px solid ${colors.primary}`,
    borderRadiusTiny: '0px',
    borderRadiusSmall: '0px',
    borderRadiusMedium: '0px',
    borderRadiusLarge: '0px',
    colorInfo: colors.white,
    colorHoverInfo: colors.white,
    colorFocusInfo: colors.white,
    colorPressedInfo: colors.white,
    colorDisabledInfo: colors.white,
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
    textColorInfo: colors.bg.DEFAULT,
    textColorFocus: colors.white,
    textColorError: colors.pink,
    textColorFocusError: colors.pink,
    textColorHoverError: colors.pink,
    textColorGhostHoverError: colors.pink,
    textColorTextHoverError: colors.pink,
    textColorPressedError: colors.pink,
    textColorTextError: colors.pink,
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
    textColor: colors.white,
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
    titleFontSize: '20px',
  },
  Divider: {
    color: colors.white,
  },
  Drawer: {
    color: colors.bg.dark,
    headerBorderBottom: '0',
    headerPadding: '32px 32px 0px 32px',
    bodyPadding: '32px 32px 32px 32px',
    footerPadding: '0px 32px 32px 32px',
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
    borderFocus: `1px solid ${colors.white}`,
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
    itemIconColorInverted: colors.white,
    itemIconColorActiveInverted: colors.white,
    itemIconColorHoverInverted: colors.white,
    itemIconColorActiveHoverInverted: colors.white,
    itemIconColorChildActiveInverted: colors.white,
    itemIconColorChildActiveHoverInverted: colors.white,
    itemTextColorInverted: colors.white,
    itemTextColorActiveInverted: colors.white,
    itemTextColorHoverInverted: colors.white,
    itemTextColorChildActiveHoverInverted: colors.white,
    itemTextColorHorizontal: colors.bodyDark,
    itemTextColorActiveHorizontal: colors.white,
    itemTextColorActiveHoverHorizontal: colors.white,
    itemTextColorHoverHorizontal: colors.body,
    itemTextColor: colors.white,
  },
  Message: messageOverrides,
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
  Select: {
    peers: {
      InternalSelection: {
        arrowColor: colors.white,
        arrowSize: '24px',
        border: `1px solid ${colors.bg.lighter}`,
        borderActive: `1px solid ${colors.white}`,
        borderFocus: `1px solid ${colors.white}`,
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
    tabColor: colors.green,
    tabTextColorLine: colors.bodyDark,
    tabTextColorActiveLine: colors.white,
    tabTextColorHoverLine: colors.white,
  },
  Tag: {
    border: `1px solid ${colors.body}`,
    borderError: `1px solid ${colors.pink}`,
    borderInfo: `1px solid ${colors.blue}`,
    borderPrimary: `1px solid ${colors.primary}`,
    borderSuccess: `1px solid ${colors.green}`,
    borderWarning: `1px solid ${colors.orange}`,
    color: colors.body,
    colorError: colors.pink,
    colorInfo: colors.blue,
    colorSuccess: colors.green,
    fontSizeTiny: '10px',
    fontSizeSmall: '12px',
    fontSizeMedium: '14px',
    fontSizeLarge: '18px',
    fontWeightStrong: '700',
    heightTiny: '24px',
    heightSmall: '24px',
    heightMedium: '24px',
    heightLarge: '32px',
    padding: '4px 12px 4px 12px',
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
};

/**
 * Referral
 */
export const referralCountries = [
  { label: 'Austria', value: 'Austria' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Bulgaria', value: 'Bulgaria' },
  { label: 'Croatia', value: 'Croatia' },
  { label: 'Cyprus', value: 'Cyprus' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Estonia', value: 'Estonia' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Latvia', value: 'Latvia' },
  { label: 'Lithuania', value: 'Lithuania' },
  { label: 'Luxembourg', value: 'Luxembourg' },
  { label: 'Malta', value: 'Malta' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Slovakia', value: 'Slovakia' },
  { label: 'Slovenia', value: 'Slovenia' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'United Kingdom', value: 'United Kingdom' },
];
