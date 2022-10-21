import { AlertLocation, RootMutation } from '~~/lib/values';

const alertKeyCount = ref(0);

export default function useAlerts() {
  const $store = useAlertsStore();

  /**
   * Add alert to AlertController
   *
   * @param {Function} onAction Callback for alert action. Receives alert's key as argument.
   */
  function trigger(
    type,
    title,
    message,
    cta,
    onAction,
    onHide,
    timeout = 8000,
    location = AlertLocation.BOTTOM_RIGHT
  ) {
    const key = `alert-${alertKeyCount.value}`;
    alertKeyCount.value++;

    // $store.update(RootMutation.alert, {
    //   type,
    //   title,
    //   message,
    //   cta: onAction ? cta : '',
    //   onAction: onAction
    //     ? () => {
    //         onAction(key);
    //       }
    //     : null,
    //   onHide,
    //   timeout,
    //   key,
    //   location,
    // });

    return key;
  }

  const handle = type => {
    // title, message, cta, onAction, onHide, timeout, location

    /**
     * Trigger a default alert with just a title or add
     * additional alert options for custom alert
     *
     * @param {string | ({
     *  title: string,
     *  message?: string
     *  cta?: string,
     *  ctaLoading?: boolean,
     *  onAction?: Function,
     *  onHide?: Function,
     *  timeout?: number,
     *  location?: AlertLocation
     * })} triggerOptions
     */
    function cb(triggerOptions) {
      if (!triggerOptions) {
        return;
      }

      if (typeof triggerOptions === 'string') {
        return trigger(type, triggerOptions);
      }

      return trigger(
        type,
        triggerOptions.title || '',
        triggerOptions.message || '',
        triggerOptions.cta || '',
        triggerOptions.onAction || null,
        triggerOptions.onHide || null,
        triggerOptions.timeout || 8000,
        triggerOptions.location || AlertLocation.BOTTOM_RIGHT
      );
    }

    return cb;
  };

  function update(key, updates) {
    // $store.update(RootMutation.alertUpdate, { key, updates });
  }

  return {
    $alert: {
      // Trigger only for specific type
      success: handle('success'),
      warning: handle('warning'),
      error: handle('error'),
      notice: handle('notice'),
      info: handle('info'),

      // Generic trigger
      trigger,
      update,
    },
  };
}
