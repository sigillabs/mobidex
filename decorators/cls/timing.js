export function time(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = async function(...args) {
      const start = new Date();
      try {
        console.info(
          `Timing ${name}(${JSON.stringify(
            Array.prototype.slice.call(args, 0)
          )})`
        );
        return await original.apply(this, args);
      } catch (err) {
        console.warn(
          `Timed ${name}(${JSON.stringify(
            Array.prototype.slice.call(args, 0)
          )}): Errored During Timing: ${err.message}`,
          err
        );
        throw err;
      } finally {
        console.info(
          `Timed ${name}(${JSON.stringify(
            Array.prototype.slice.call(args, 0)
          )}): Duration: ${new Date() - start}`
        );
      }
    };
  }

  return descriptor;
}
