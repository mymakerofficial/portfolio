import {createClient} from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export default defineEventHandler(async (event) => {
  const { data: projectData, error } = await supabase
    .from('projects')
    .select('slug, displayName: display_name, summary, type, url, releaseDate: released_at_date, startedDate: started_at_date, tags ( slug, displayName: display_name ), collaborators: people ( slug, displayName: display_name, websiteUrl: website_url ), technologies ( slug, displayName: display_name, shortDisplayName: short_display_name, type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ), thumbnailId: thumbnail_id')
    .eq('slug', event.context.params.slug)
    .single()

  if (!projectData || error) {
    throw new Error(error.message || 'Error fetching project');
  }

  const { data: projectType } = await supabase
    .from('project_types')
    .select('slug, displayName: display_name, shortDisplayName: short_display_name')
    .eq('slug', projectData.type)
    .single();

  if (!projectType) {
    throw new Error('Error fetching project types');
  }

  let technologiesOut: any[] = []
  let types: any = {}

  if (projectData.technologies) {
    // @ts-ignore
    for (let technology of projectData.technologies) {
      let type = technology.type
      if (!types[type.slug]) {
        types[type.slug] = {
          slug: type.slug,
          displayName: type.displayName,
          shortDisplayName: type.shortDisplayName,
          technologies: []
        }
        technologiesOut.push(types[type.slug])
      }
      types[type.slug].technologies.push({
        slug: technology.slug,
        displayName: technology.displayName,
        shortDisplayName: technology.shortDisplayName
      })
    }
  }

  return {
    slug: projectData.slug,
    displayName: projectData.displayName,
    summary: projectData.summary,
    type: projectType,
    websiteUrl: projectData.url,
    releaseDate: projectData.releaseDate,
    startedDate: projectData.startedDate,
    tags: projectData.tags,
    collaborators: projectData.collaborators,
    technologies: technologiesOut,
    thumbnailUrl: projectData.thumbnailId ? `/api/v1/projects/${projectData.slug}/thumbnail` : null,
  };
});
