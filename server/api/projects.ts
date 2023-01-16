import { createClient } from '@supabase/supabase-js'

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
    .select('slug, display_name, summary')

  if (!data || error) {
    throw new Error('Error fetching projects');
  }

  const projects = data.map((project) => ({
    slug: project.slug,
    displayName: project.display_name,
    summary: project.summary,
  }));

  return {
    projects,
  };
});
