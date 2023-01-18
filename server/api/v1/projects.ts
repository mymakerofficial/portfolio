import {createClient} from '@supabase/supabase-js'

export interface CompactProjectInfo {
  slug: string;
  displayName: string;
  summary: string;
  releaseDate: string;
  featured: boolean;
  thumbnailUrl: string;
  htmlUrl: string;
  url: string;
}

export default defineEventHandler(async () => {
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

  const { data, error } = await supabase
    .from('projects')
    .select('slug, displayName: display_name, summary, releaseDate: released_at_date, featured, thumbnailId: thumbnail_id')

  if (!data || error) {
    throw new Error('Error fetching projects');
  }

  return data.map((project) => ({
    slug: project.slug,
    displayName: project.displayName,
    summary: project.summary,
    releaseDate: project.releaseDate,
    featured: project.featured,
    thumbnailUrl: project.thumbnailId ? `/api/v1/projects/${project.slug}/thumbnail` : null,
    htmlUrl: `/projects/${project.slug}`,
    url: `/api/v1/projects/${project.slug}`,
  }));
});
