export default function usePayment() {
  const { t } = useI18n();
  const { query } = useRoute();
  const message = useMessage();
  const paymentStore = usePaymentStore();

  async function wereCreditsPurchased() {
    const lastInvoice = await paymentStore.fetchInvoices(1, 1);
    return (
      lastInvoice?.data?.total &&
      lastInvoice?.data?.items &&
      lastInvoice.data.items[0].referenceTable === 'creditPackage' &&
      isInLastMinute(lastInvoice.data.items[0].createTime)
    );
  }

  async function creditsMessage() {
    if (
      query.credits &&
      isCacheExpired(SessionKeys.CREDITS_MSG) &&
      (await wereCreditsPurchased())
    ) {
      const creditPackage = paymentStore.creditPackages.find(
        item => item.id === parseInt(toStr(query.credits))
      );

      if (creditPackage) {
        /** Save timestamp to SS */
        sessionStorage.setItem(SessionKeys.CREDITS_MSG, Date.now().toString());

        message.success(
          t('dashboard.payment.stripe.credits', {
            credits: formatNumber(creditPackage.creditAmount + creditPackage.bonusCredits),
          })
        );
      }
    }
  }

  function isInLastMinute(createTime: string | null) {
    return !!createTime && new Date(createTime).getTime() + MINUTE_IN_MS > Date.now();
  }

  async function showMsgActiveSubscription(packageId: string): Promise<boolean> {
    await paymentStore.getActiveSubscription();
    return (
      paymentStore.activeSubscription.package_id === intVal(packageId) &&
      !paymentStore.activeSubscription.cancelDate
    );
  }

  async function subscriptionMessage() {
    if (
      query.subscription &&
      isCacheExpired(SessionKeys.SUBSCRIPTION_MSG) &&
      (await showMsgActiveSubscription(toStr(query.subscription)))
    ) {
      message.success(
        t('dashboard.payment.stripe.subscription', {
          plan: paymentStore.getActiveSubscriptionPackage?.name,
        })
      );

      /** Save timestamp to SS */
      sessionStorage.setItem(SessionKeys.SUBSCRIPTION_MSG, Date.now().toString());
    }
  }

  return {
    creditsMessage,
    subscriptionMessage,
  };
}
