import {supabase} from "~/lib/supabase";
// @ts-ignore
import {PostgrestError} from '@supabase/supabase-js'
import Fuse from 'fuse.js';

interface ProjectsRawData {
  slug: string;
  displayName: string;
  summary: string;
  type: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
  };
  url: string;
  releaseDate: string;
  startedDate: string;
  featured: boolean;
  tags: {
    slug: string;
    displayName: string;
  }[];
  collaborators: {
    slug: string;
    displayName: string;
    websiteUrl: string;
  }[];
  technologies: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
    type: {
      slug: string;
      displayName: string;
      shortDisplayName: string;
    };
    parent: {
      slug: string;
      displayName: string;
      shortDisplayName: string;
    }
  }[];
  thumbnailPath: string;
}

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

const getProjectsRawData = async (): Promise<ProjectsRawData[]> => {
  // fetch projects from supabase
  const {data: projectsData, error: projectsError} = await supabase
    .from('projects')
    .select('' +
      'slug, ' +
      'displayName: display_name, ' +
      'summary, ' +
      'type: type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ), ' +
      'url, ' +
      'releaseDate: released_at_date, ' +
      'startedDate: started_at_date, ' +
      'featured, ' +
      'tags ( slug, displayName: display_name ), ' +
      'collaborators: people ( slug, displayName: display_name, websiteUrl: website_url ), ' +
      'technologies ( ' +
      ' slug, ' +
      ' displayName: display_name, ' +
      ' shortDisplayName: short_display_name, ' +
      ' type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ), ' +
      ' parent: parent_technology_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ' +
      '), ' +
      'thumbnailPath: thumbnail_path'
    ) as any as {
    data: ProjectsRawData[]
    error: PostgrestError;
  }

  if (projectsError) {
    throw new Error('Error fetching projects');
  }

  return projectsData;
};

const averageScore = (items: Fuse.FuseResult<ProjectsRawData>[]) => {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].score || 0;
  }
  return sum / items.length;
}

const fuzzySearch = (projects: ProjectsRawData[], query: string): ProjectsRawData[] => {
  const fuse = new Fuse(projects, {
    keys: [
      { name: 'slug', weight: 2, getFn: (project) => project.slug },
      { name: 'displayName', weight: 2, getFn: (project) => project.displayName },
      { name: 'summary', weight: 2, getFn: (project) => project.summary },
      { name: 'tags', weight: 0.5, getFn: (project) => project.tags.map(tag => tag.displayName) },
      { name: 'type', weight: 0.5, getFn: (project) => project.type.displayName },
      { name: 'technologies', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.displayName) },
      { name: 'technologiesShort', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.shortDisplayName) },
      { name: 'parentTechnologies', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.parent?.displayName) },
      { name: 'parentTechnologiesShort', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.parent?.shortDisplayName) },
      { name: 'collaborators', weight: 0.5, getFn: (project) => project.collaborators.map(collaborator => collaborator.displayName) },
    ],
    useExtendedSearch: true,
    includeScore: true,
    shouldSort: true,
    ignoreLocation: true,
    includeMatches: true,
    findAllMatches: false,
    threshold: 0.4
  })

  let searchRes = fuse.search(query)

  /*
  // calculate average score
  const avScore = averageScore(searchRes);

  // remove all results that have a lower score than the average
  searchRes = searchRes.filter((p) => {
    return (p.score || 0) <= avScore;
  })
   */

  return searchRes.map((p) => {
    return p.item;
  })
}

// TODO: cache this
export default defineEventHandler(
  async (event): Promise<any> => {
    console.log('Fetching projects')

    const query = new URLSearchParams(event.req.url?.split('?')[1])
    const searchQuery = query.get("q") || undefined;

    let projectsData = await getProjectsRawData();

    if (searchQuery) {
      // search projects
      projectsData = fuzzySearch(projectsData, searchQuery);
    } else {
      // sort projects
      projectsData.sort((a, b) => {
        const dateA = new Date(a.releaseDate || a.startedDate);
        const dateB = new Date(b.releaseDate || b.startedDate);
        return dateB.getTime() - dateA.getTime();
      })
    }

    return projectsData.map((project: any) => {
      return {
        slug: project.slug as string,
        displayName: project.displayName as string,
        summary: project.summary as string,
        type: project.type?.shortDisplayName || project.type?.displayName || 'Project',
        collaborators: project.collaborators?.map((collaborator: any) => collaborator.displayName),
        technologies: project.technologies?.map((technology: any) => technology.displayName),
        date: (project.releaseDate || project.startedDate) as string,
        featured: project.featured as boolean,
        thumbnailUrl: (project.thumbnailPath ? `/api/v1/projects/${project.slug}/thumbnail` : null) as string | null,
        htmlUrl: `/projects/${project.slug}`,
        url: `/api/v1/projects/${project.slug}`,
      }
    });
  }
);
