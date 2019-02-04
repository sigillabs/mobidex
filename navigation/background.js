import { Navigation } from 'react-native-navigation';

export function registerBackgroundUpdates(store) {
  store.subscribe(
    (function activeTransactionsBadgeUpdater(store) {
      let activeTransactionCount = null;
      let orderCount = null;

      return () => {
        const {
          wallet: { activeTransactions },
          relayer: { orders }
        } = store.getState();

        const updateRequired =
          activeTransactionCount !== activeTransactions.length ||
          orderCount !== orders.length;

        if (updateRequired) {
          activeTransactionCount = activeTransactions.length;
          orderCount = orders.length;

          Navigation.mergeOptions('OrdersList', {
            bottomTab: {
              badge: `${orderCount.toString()}/${activeTransactionCount.toString()}`,
              badgeColor: 'red'
            }
          });
        }
      };
    })(store)
  );
}
