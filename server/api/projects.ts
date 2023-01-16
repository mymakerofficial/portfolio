import { createClient } from '@supabase/supabase-js'

const supabaseUrl =  process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async () => {
  if (!supabase) {
    throw new Error('Supabase not initialized');
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
