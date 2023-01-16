import {createClient} from '@supabase/supabase-js'

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

  const { data: projectData, error } = await supabase
    .from('projects')
    .select('slug, displayName: display_name, summary, url, tags ( name ), collaborators: people ( name, websiteUrl: website_url ), thumbnail')
    .eq('slug', event.context.params.slug)
    .single()

  if (!projectData || error) {
    throw new Error(error.message || 'Error fetching project');
  }

  // @ts-ignore
  const tags = projectData.tags ? projectData.tags.map((tag: any) => tag.name) : []

  return {
    slug: projectData.slug,
    displayName: projectData.displayName,
    summary: projectData.summary,
    websiteUrl: projectData.url,
    tags: tags,
    collaborators: projectData.collaborators,
    thumbnailUrl: projectData.thumbnail ? `/api/projects/${projectData.slug}/thumbnail` : null,
  };
});
