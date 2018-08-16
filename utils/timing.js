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
      return await _fn.apply(this, arguments);
    } finally {
      console.info(`${title}: Duration: ${new Date() - start}`);
    }
  };
}
