import moment from 'moment';
import { AsyncStorage } from 'react-native';

export function cache(ns, expiration = 60 * 60 * 24, nulls = false) {
  return function(target, name, descriptor) {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = async function(...args) {
        const force = args.pop();
        const nsString = (typeof ns === 'function'
          ? ns.apply(this)
          : ns
        ).format(...args);

        try {
          const dataKey = `${nsString}:data`;
          const updatedKey = `${nsString}:last-updated`;

          const lastUpdatedJson = await AsyncStorage.getItem(
            updatedKey.format(...args)
          );
          const lastUpdated = lastUpdatedJson
            ? JSON.parse(lastUpdatedJson).data
            : null;
          const dataJson = await AsyncStorage.getItem(dataKey);
          let data = dataJson ? JSON.parse(dataJson).data : null;

          if (
            force ||
            !data ||
            !lastUpdated ||
            moment().unix() - parseInt(lastUpdated) > expiration
          ) {
            console.info(`Caching ${nsString}`);

            data = await original.apply(this, args);

            if (data === null && !nulls) {
              return data;
            }

            await AsyncStorage.setItem(dataKey, JSON.stringify({ data }));
            await AsyncStorage.setItem(
              updatedKey,
              JSON.stringify({ data: moment().unix() })
            );
          } else {
            console.info(`Retrieve Cached ${nsString}`);
          }

          return data;
        } catch (err) {
          console.warn(
            `Cached ${nsString}: Errored During Caching: ${err.message}`
          );
          throw err;
        } finally {
          console.info(`Cached ${nsString}`);
        }
      };
    }

    return descriptor;
  };
}
