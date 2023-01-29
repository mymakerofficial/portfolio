// @ts-ignore
import {createClient} from '@supabase/supabase-js'

export interface CompactProjectInfo {
  slug: string;
  displayName: string;
  summary: string;
  type: string;
  date: string;
  featured: boolean;
  thumbnailUrl: string | null;
  htmlUrl: string;
  url: string;
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export default cachedEventHandler(
  async (): Promise<CompactProjectInfo[]> => {
    console.log('Fetching projects')

    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('slug, displayName: display_name, summary, type: type_id ( displayName: display_name, shortDisplayName: short_display_name ), releaseDate: released_at_date, startedDate: started_at_date, featured, thumbnailPath: thumbnail_path')

    if (projectsError) {
      throw new Error('Error fetching projects');
    }

    return projectsData.map((project: any) => {
      return {
        slug: project.slug as string,
        displayName: project.displayName as string,
        summary: project.summary as string,
        type: project.type?.shortDisplayName || project.type?.displayName || 'Project',
        date: (project.releaseDate || project.startedDate) as string,
        featured: project.featured as boolean,
        thumbnailUrl: (project.thumbnailPath ? `/api/v1/projects/${project.slug}/thumbnail` : null) as string | null,
        htmlUrl: `/projects/${project.slug}`,
        url: `/api/v1/projects/${project.slug}`,
      }
    }).sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  },
  {
    name: 'projects',
    maxAge: Number(process.env.CACHE_MAX_AGE_PROJECTS) || 3600,
  }
);
