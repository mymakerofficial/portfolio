import {h3SendMediaFromUrl} from "~/lib/h3mediaProxy";

export default defineEventHandler(async (event) => {
  if (process.env.STORAGE_PROVIDER === 'supabase') {
    return h3SendMediaFromUrl(event, `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_MEDIA_BUCKET_NAME}/${event.context.params!.path}`);
  } else if (process.env.STORAGE_PROVIDER === 'firestore') {
    return h3SendMediaFromUrl(event, `${process.env.STORAGE_URL}/${encodeURIComponent(event.context.params!.path.replace(/^\//, ''))}?alt=media`);
  }
})