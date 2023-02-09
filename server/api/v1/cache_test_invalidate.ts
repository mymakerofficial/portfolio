export default defineEventHandler(async () => {
  useStorage().setItem('data-cache:projects', null);
  return new Date().toISOString();
});
