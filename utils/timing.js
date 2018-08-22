export async function fetchWithTiming(title, url) {
  const start = new Date();
  try {
    const response = await fetch(url);
    return await response.json();
  } finally {
    console.info(`${title}: Duration: ${new Date() - start}`);
  }
}

export function asyncTimingWrapper(fn) {
  const title = fn.name;
  const _fn = fn;

  return async function() {
    const start = new Date();
    try {
      console.info(
        `${title}: Calling With Arugments: ${JSON.stringify(
          Array.prototype.slice.call(arguments, 1)
        )}`
      );
      return await _fn.apply(this, arguments);
    } catch (err) {
      console.warn(
        `${title}: Called With Arugments: ${JSON.stringify(
          Array.prototype.slice.call(arguments, 1)
        )}: Errored During Timing: ${err.message}`
      );
      throw err;
    } finally {
      console.info(
        `${title}: Called With Arugments: ${JSON.stringify(
          Array.prototype.slice.call(arguments, 1)
        )}: Duration: ${new Date() - start}`
      );
    }
  };
}
