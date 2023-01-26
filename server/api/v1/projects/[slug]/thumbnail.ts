import { createClient } from '@supabase/supabase-js'
import {h3SendMediaFromUrl} from "~/lib/h3mediaProxy";

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export default defineEventHandler(async (event) => {
  // get the thumbnail path from the database
  const { data: projectData } = await supabase
    .from('projects')
    .select('thumbnailPath: thumbnail_path')
    .eq('slug', event.context.params.slug)
    .single()

  if (!projectData) {
    throw new Error('Error fetching project');
  }

  if (process.env.STORAGE_PROVIDER === 'supabase') {
    return h3SendMediaFromUrl(event, `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_MEDIA_BUCKET_NAME}/${projectData.thumbnailPath}`);
  } else if (process.env.STORAGE_PROVIDER === 'firestore') {
    return h3SendMediaFromUrl(event, `${process.env.STORAGE_URL}/${encodeURIComponent(projectData.thumbnailPath.replace(/^\//, ''))}?alt=media`);
  }
});
