import {CompactProjectInfo} from "~/server/api/v1/projects";
// @ts-ignore
import {createClient, PostgrestError} from "@supabase/supabase-js";

interface ProjectsRawData {
  slug: string;
  displayName: string;
  summary: string;
  type: {
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
  technologies: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
    type: {
      slug: string;
      displayName: string;
      shortDisplayName: string;
    };
  }[];
  thumbnailPath: string;
}

export interface ProjectsGroup {
  group: {
    displayName: string;
    slug: string;
  },
  projects: CompactProjectInfo[];
}

interface ProjectsGroupRaw {
  group: {
    displayName: string;
    slug: string;
  },
  projects: ProjectsRawData[];
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export default cachedEventHandler(
  async (event: any): Promise<ProjectsGroup[]> => {
    // get query
    const query = new URLSearchParams(event.req.url?.split('?')[1])
    const groupByProperty = query.get("group_by_property") || undefined;
    const groupByValue = query.get("group_by_value") || undefined;
    const includeOther = query.get("include_other") === 'true';

    // fetch projects from supabase
    const {data: projectsData, error: projectsError} = await supabase
      .from('projects')
      .select('' +
        'slug, ' +
        'displayName: display_name, ' +
        'summary, ' +
        'type: type_id ( displayName: display_name, shortDisplayName: short_display_name ), ' +
        'url, ' +
        'releaseDate: released_at_date, ' +
        'startedDate: started_at_date, ' +
        'featured, ' +
        'tags ( slug, displayName: display_name ), ' +
        'technologies ( slug, displayName: display_name, shortDisplayName: short_display_name, type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ), ' +
        'thumbnailPath: thumbnail_path'
      ) as any as {
      data: ProjectsRawData[]
      error: PostgrestError;
    }

    if (projectsError) {
      throw new Error('Error fetching projects');
    }

    // sort projects by release date or started date
    projectsData.sort((a, b) => {
      const aDate = new Date(a.releaseDate || a.startedDate || '1970-01-01');
      const bDate = new Date(b.releaseDate || b.startedDate || '1970-01-01');
      return bDate.getTime() - aDate.getTime();
    });

    let groups: ProjectsGroupRaw[] = [];

    // group by property
    switch (groupByProperty) {
      case 'date': // group by date
        groups = groupByDate(projectsData, groupByValue);
        break;
      case 'technology-type': // group by technology type
        groups = groupByTechnologyType(projectsData, groupByValue, includeOther);
        break;
      default:
        throw new Error('Invalid group_by_property');
    }

    return groups.map((group) => {
      return {
        group: group.group,
        projects: group.projects.map((project) => {
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
          } as CompactProjectInfo;
        }),
      }
    }) as ProjectsGroup[];
  },
  {
    name: 'grouped-projects',
    maxAge: Number(process.env.CACHE_MAX_AGE_PROJECTS) || 3600,
    // @ts-ignore
    getKeys: (event) => {
      const query = new URLSearchParams(event.req.url?.split('?')[1])
      const groupByProperty = query.get("group_by_property") || undefined;
      const groupByValue = query.get("group_by_value") || undefined;
      const includeOther = query.get("include_other") === 'true';
      return [groupByProperty, groupByValue, includeOther];
    },
  }
);

const groupByDate = (projects: ProjectsRawData[], groupByValue: string | undefined): ProjectsGroupRaw[] => {
  if (!groupByValue) {
    throw new Error('Missing group_by_value');
  }

  if (!["year", "month"].includes(groupByValue)) {
    throw new Error(`Invalid group_by_value for date: ${groupByValue}`);
  }

  let groups: ProjectsGroupRaw[] = [];

  const groupByYear = groupByValue === 'year';

  // group by date
  projects.forEach((project) => {

    let date: string | null = null;
    if (groupByYear) {
      date = project.releaseDate?.split('-')[0] || project.startedDate?.split('-')[0] || null;
    } else {
      date = project.releaseDate?.split('-').slice(0, 2).join('-') || project.startedDate?.split('-').slice(0, 2).join('-') || null;
    }

    // find group
    let group = groups.find((group) => group.group.slug === date);

    if (!group) {
      // if group does not exist, create it
      group = {
        group: {
          displayName: date || 'Unknown',
          slug: date || 'unknown',
        },
        projects: [],
      };
      groups.push(group);
    }

    group.projects.push(project);
  });

  groups.sort((a, b) => {
    return parseInt(b.group.slug) - parseInt(a.group.slug);
  });

  return groups;
}

const groupByTechnologyType = (projects: ProjectsRawData[], groupByValue: string | undefined, includeOther: boolean): ProjectsGroupRaw[] => {
  if (!groupByValue) {
    throw new Error('Missing group_by_value');
  }

  let groups: ProjectsGroupRaw[] = [];

  // create "other" group
  let noGroup: ProjectsGroupRaw = {
    group: {
      displayName: 'Other',
      slug: 'other',
    },
    projects: [],
  };

  // group by technology
  projects.forEach((project) => {
    // add project to "other" group if it doesn't have the specified technology type
    if (!project.technologies.some((technology: any) => {
      return technology.type.slug === groupByValue;
    })) {
      noGroup.projects.push(project);
      return;
    }

    project.technologies.forEach((technology) => {
      if (technology.type.slug === groupByValue) {
        // find group
        let group = groups.find((group) => group.group.slug === technology.slug);

        if (!group) {
          // if group does not exist, create it
          group = {
            group: {
              displayName: technology.displayName,
              slug: technology.slug,
            },
            projects: [],
          };
          groups.push(group);
        }

        group.projects.push(project);
      }
    });
  });

  groups.sort((a, b) => {
    // sort by projects length or newest project or alphabetically
    const aDate = new Date(a.projects[0].releaseDate || a.projects[0].startedDate || '1970-01-01');
    const bDate = new Date(b.projects[0].releaseDate || b.projects[0].startedDate || '1970-01-01');
    return b.projects.length - a.projects.length || bDate.getTime() - aDate.getTime() || a.group.displayName.localeCompare(b.group.displayName);
  });

  // add "other" group if it has projects and includeOther is true
  if (noGroup.projects.length > 0 && includeOther) {
    groups.push(noGroup);
  }

  return groups;
}