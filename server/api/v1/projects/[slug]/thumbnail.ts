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

  return h3SendMediaFromUrl(event, `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_MEDIA_BUCKET_NAME}/${projectData.thumbnailPath}`);
});
