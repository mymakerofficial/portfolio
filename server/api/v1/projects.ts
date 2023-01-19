import {createClient} from '@supabase/supabase-js'

export interface CompactProjectInfo {
  slug: string;
  displayName: string;
  summary: string;
  date: string;
  featured: boolean;
  thumbnailUrl: string | null;
  htmlUrl: string;
  url: string;
}

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export default defineEventHandler(async (): Promise<CompactProjectInfo[]> => {
  const { data: projectsData } = await supabase
    .from('projects')
    .select('slug, displayName: display_name, summary, type, releaseDate: released_at_date, staredDate: started_at_date, featured, thumbnailId: thumbnail_id')

  const { data: typesData } = await supabase
    .from('project_types')
    .select('slug, displayName: display_name, shortDisplayName: short_display_name')

  if (!projectsData || !typesData) {
    throw new Error('Error fetching projects');
  }

  console.log(typesData);

  return projectsData.map((project) => {
    const type = typesData.find((type) => type.slug === project.type) || null;
    return {
      slug: project.slug as string,
      displayName: project.displayName as string,
      summary: project.summary as string,
      type: type?.shortDisplayName || type?.displayName || 'Project',
      date: (project.releaseDate || project.staredDate) as string,
      featured: project.featured as boolean,
      thumbnailUrl: (project.thumbnailId ? `/api/v1/projects/${project.slug}/thumbnail` : null) as string | null,
      htmlUrl: `/projects/${project.slug}`,
      url: `/api/v1/projects/${project.slug}`,
    }
  });
});
