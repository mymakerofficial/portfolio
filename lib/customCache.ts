/***
 * Caches the result of a function call for a given amount of time. The cache can be invalidated by returning true in the invalidate function.
 */
export const customCachedFunction = (fn: (...args: any[]) => any, options: { name: string, maxAge: number, invalidate?: (data: any, generatedAt: Date) => boolean }) => {
  return async () => {
    const cached = await useStorage().getItem(`custom-cache:${options.name}`);
    const invalidate = options.invalidate || (() => false);
    if (cached && cached.expires > Date.now() && !invalidate(cached.value, cached.generatedAt)) {
      // return cached value
      return cached.value;
    } else {
      // return fresh data
      const fnResult = await fn();
      await useStorage().setItem(`custom-cache:${options.name}`, { value: fnResult, generatedAt: Date.now(), expires: Date.now() + 1000 * options.maxAge });
      return fnResult;
    }
  }
}