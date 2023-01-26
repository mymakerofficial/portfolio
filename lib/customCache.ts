/***
 * Caches the result of a function call for a given amount of time. The cache can be invalidated by returning true in the invalidate function.
 */
export const customCachedFunction = (fn: (...args: any[]) => any, options: { name: string, maxAge: number, invalidate?: (data: any, generatedAt: Date) => boolean, getKeys?: (...args: any[]) => string }) => {
  return async (...args: any[]) => {
    let name = options.name || fn.name;
    if (options.getKeys) {
      name += `_${options.getKeys(...args)}`;
    }

    const cached = await useStorage().getItem(`custom-cache:${name}`);
    const invalidate = options.invalidate || (() => false);
    if (cached && cached.expires > Date.now() && !invalidate(cached.value, cached.generatedAt)) {
      // return cached value
      return cached.value;
    } else {
      // return fresh data
      const fnResult = await fn(...args);
      await useStorage().setItem(`custom-cache:${name}`, { value: fnResult, generatedAt: Date.now(), expires: Date.now() + 1000 * options.maxAge });
      return fnResult;
    }
  }
}