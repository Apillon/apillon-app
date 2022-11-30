import { DiscreteApiOptions } from 'naive-ui';
import colors from '~~/tailwind.colors';

export const lsKeys = {
  TWITTER: 'al_twitter',
  GOOGLE: 'al_google',
  DISCORD: 'al_discord',
};

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
