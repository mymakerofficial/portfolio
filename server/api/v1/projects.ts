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
  const { data, error } = await supabase
    .from('projects')
    .select('slug, displayName: display_name, summary, releaseDate: released_at_date, staredDate: started_at_date, featured, thumbnailId: thumbnail_id')

  if (!data || error) {
    throw new Error('Error fetching projects');
  }

  return data.map((project) => ({
    slug: project.slug as string,
    displayName: project.displayName as string,
    summary: project.summary as string,
    date: (project.releaseDate || project.staredDate) as string,
    featured: project.featured as boolean,
    thumbnailUrl: (project.thumbnailId ? `/api/v1/projects/${project.slug}/thumbnail` : null) as string | null,
    htmlUrl: `/projects/${project.slug}`,
    url: `/api/v1/projects/${project.slug}`,
  }));
});
