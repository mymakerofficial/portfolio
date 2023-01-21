import {h3SendMediaFromUrl} from "~/lib/h3mediaProxy";

export default defineEventHandler(async (event) => {
  return h3SendMediaFromUrl(event, `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_MEDIA_BUCKET_NAME}/${event.context.params.path}`);
})