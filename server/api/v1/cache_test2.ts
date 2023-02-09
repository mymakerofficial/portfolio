export default defineEventHandler(async () => {
  const test = await useStorage().getItem('data-cache:projects')
  return `${new Date().toISOString()} ... ${JSON.stringify(test)}`;
});
