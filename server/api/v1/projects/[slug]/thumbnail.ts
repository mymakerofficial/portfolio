import { send } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  if (!process.env.SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL environment variable');
  }

  if (!process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_KEY environment variable');
  }

  const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

  if (!supabase) {
    throw new Error('Could not create Supabase client')
  }

  // get the thumbnail storage object id from the projects table
  const { data: projectData } = await supabase
    .from('projects')
    .select('thumbnailId: thumbnail_id')
    .eq('slug', event.context.params.slug)
    .single()

  if (!projectData) {
    throw new Error('Error fetching project');
  }

  // get the list of storage objects from the bucket
  const { data: storageData } = await supabase
    .storage
    .from('my-maker-bucket')
    .list('portfolio/projects')

  if (!storageData) {
    throw new Error('Error fetching storage');
  }

  // find the storage object that matches the thumbnail id
  const thumbnail = storageData.find((file: any) => file.id === projectData.thumbnailId)

  if (!thumbnail) {
    throw new Error('Error finding thumbnail');
  }

  // download the storage object
  const { data: dataBlob } = await supabase
    .storage
    .from('my-maker-bucket')
    .download(`portfolio/projects/${thumbnail.name}`)

  if (!dataBlob) {
    throw new Error('Error downloading file');
  }

  return send(event, Buffer.from(await dataBlob.arrayBuffer()), thumbnail?.metadata.mimetype)
});
