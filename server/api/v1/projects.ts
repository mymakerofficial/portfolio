import {
  CompactProjectInfo,
  getProjectsRawDataCached,
  ProjectsRawData,
  ProjectsSearchResultType,
  ProjectsTechnologyRaw
} from "~/lib/projects";
import Fuse from 'fuse.js';

interface ProjectsGroupRaw {
  group: {
    displayName: string;
    slug: string;
  },
  projects: ProjectsRawData[];
}

export interface ProjectsGroup {
  group: {
    displayName: string;
    slug: string;
  },
  projects: CompactProjectInfo[];
}

export interface ProjectsResponse {
  resultType: ProjectsSearchResultType;
  groupByProperty: string | null;
  groupByValue: string | null;
  data: CompactProjectInfo[] | ProjectsGroup[];
}

const fuzzySearchProjects = (projects: ProjectsRawData[], query: string): ProjectsRawData[] => {
  const fuse = new Fuse(projects, {
    keys: [
      { name: 'slug', weight: 2, getFn: (project) => project.slug },
      { name: 'displayName', weight: 2, getFn: (project) => project.displayName },
      { name: 'summary', weight: 2, getFn: (project) => project.summary },
      { name: 'tags', weight: 0.5, getFn: (project) => project.tags.map(tag => tag.displayName) },
      { name: 'type', weight: 0.5, getFn: (project) => project.type.displayName },
      { name: 'url', weight: 0.5, getFn: (project) => project.url },
      { name: 'technologies', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.displayName) },
      { name: 'technologiesShort', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.shortDisplayName) },
      { name: 'parentTechnologies', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.parent?.displayName || "") },
      { name: 'parentTechnologiesShort', weight: 0.5, getFn: (project) => project.technologies.map(technology => technology.parent?.shortDisplayName || "") },
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

  return searchRes.map((p) => {
    return p.item;
  })
}

const fuzzySearchTechnologies = (technologies: ProjectsTechnologyRaw[], query: string) => {
  const fuse = new Fuse(technologies, {
    keys: [
      { name: 'slug', weight: 2, getFn: (technology) => technology.slug },
      { name: 'displayName', weight: 2, getFn: (technology) => technology.displayName },
      { name: 'shortDisplayName', weight: 2, getFn: (technology) => technology.shortDisplayName },
    ],
    useExtendedSearch: true,
    includeScore: true,
    shouldSort: true,
    ignoreLocation: true,
    includeMatches: true,
    findAllMatches: false,
    threshold: 0.1
  })

  let searchRes = fuse.search(query)

  return searchRes.map((e) => {
    return e.item;
  })
};

enum GroupByDateType {
  YEAR = 'year',
  MONTH = 'month',
}

const groupByDate = (projects: ProjectsRawData[], dateType: GroupByDateType | undefined): ProjectsGroupRaw[] => {
  if (!dateType) {
    throw new Error('Missing dateType');
  }

  let groups: ProjectsGroupRaw[] = [];

  const groupByYear = dateType === GroupByDateType.YEAR;

  // group by date
  projects.forEach((project) => {

    let date: string | null = null;
    if (groupByYear) {
      // group by year
      date = project.releaseDate?.split('-')[0] || project.startedDate?.split('-')[0] || null;
    } else {
      // group by month
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

const groupByTechnologyType = (projects: ProjectsRawData[], typeSlug: string | undefined, includeOther: boolean, includeTechnologies?: string[] | null | undefined): ProjectsGroupRaw[] => {
  if (!typeSlug) {
    throw new Error('Missing typeSlug');
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
      return technology.type.slug === typeSlug;
    })) {
      noGroup.projects.push(project);
      return;
    }

    project.technologies.forEach((technology) => {
      if (technology.type.slug === typeSlug) {
        // if we have a list of technologies to include and the technology is not in the list, skip it
        if (includeTechnologies && !includeTechnologies.includes(technology.slug)) {
          return;
        }

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

  groups.forEach((group) => {
    group.projects.sort((a, b) => {
      return sortProjectsFunction(a, b);
    });
  });

  groups.sort((a, b) => {
    return sortProjectsFunction(a.projects[0], b.projects[0]);
  });

  // add "other" group if it has projects and includeOther is true
  if (noGroup.projects.length > 0 && includeOther) {
    groups.push(noGroup);
  }

  return groups;
}

const sortProjectsFunction = (a: ProjectsRawData, b: ProjectsRawData) => {
  const aDate = new Date(a.releaseDate || a.startedDate || '1970-01-01');
  const bDate = new Date(b.releaseDate || b.startedDate || '1970-01-01');
  return bDate.getTime() - aDate.getTime() || a.displayName.localeCompare(b.displayName);
}

const convertProjectsRawToCompact = (projects: ProjectsRawData[]): CompactProjectInfo[] => {
  return projects.map((project) => {
    return {
      slug: project.slug as string,
      displayName: project.displayName as string,
      summary: project.summary as string,
      type: project.type.slug,
      collaborators: project.collaborators?.map((collaborator: any) => collaborator.displayName),
      technologies: project.technologies?.map((technology: any) => technology.slug),
      tags: project.tags?.map((tag: any) => tag.slug),
      date: (project.releaseDate || project.startedDate) as string,
      featured: project.featured as boolean,
      thumbnailUrl: project.thumbnailPath ? `/cdn/${project.thumbnailPath.replace(/^\//, '')}` : null,
      htmlUrl: `/projects/${project.slug}`,
      url: `/api/v1/projects/${project.slug}`,
    };
  });
}

const convertGroupRawToCompact = (groups: ProjectsGroupRaw[]): ProjectsGroup[] => {
  return groups.map((group) => {
    return {
      group: group.group,
      projects: convertProjectsRawToCompact(group.projects),
    };
  }) as ProjectsGroup[];
}

type TechnologiesBySlug = Record<string, ProjectsTechnologyRaw>;

const isTechnologyDescendantOf = (technologiesBySlug: TechnologiesBySlug, technologySlug: string, parentTechnologySlug: string): boolean => {
  if (technologySlug === parentTechnologySlug) {
    return true;
  }

  const technology = technologiesBySlug[technologySlug];
  if (!technology) {
    return false;
  }

  if (technology.parent) {
    return isTechnologyDescendantOf(technologiesBySlug, technology.parent.slug, parentTechnologySlug);
  }

  return false;
}

export default defineEventHandler(
  async (event): Promise<ProjectsResponse> => {
    const query = new URLSearchParams(event.req.url?.split('?')[1])
    const searchQuery = query.get("q") || undefined; // search query
    const projectType = query.get("type") || undefined; // search query
    let groupBy = query.get("group_by") || undefined; // group by technology or date
    let groupByProperty = groupBy?.split(':')[0] || undefined; // what to group by
    let groupByValue = groupBy?.split(':')[1] || undefined; // what to group by
    let includeOther = query.get("include_other") === 'true'; // include "other" group
    let featuredFirst = query.get("featured_first") === 'true';
    const limit = Number(query.get("limit") || Infinity);

    let projectsData = await getProjectsRawDataCached();

    if (!projectsData) {
      throw new Error('Failed to fetch projects');
    }

    // filter out non public projects if not dev environment
    if (process.env.NODE_ENV !== 'development' || process.env.SHOW_NON_PUBLIC_PROJECTS !== 'true') {
      projectsData = projectsData.filter((project) => project.public);
    }

    // filter by project type
    if (projectType) {
      projectsData = projectsData.filter((project) => project.type.slug === projectType);
    }

    let technologies = null;

    if (searchQuery) {
      // get technologies from projects data
      technologies = projectsData.flatMap(project => project.technologies);

      // remove duplicates
      technologies = technologies.filter((technology, index, self) => {
        return self.findIndex(t => t.slug === technology.slug) === index;
      });

      // create map
      const technologiesBySlug = technologies.reduce((acc, technology) => {
        acc[technology.slug] = technology;
        return acc;
      }, {} as TechnologiesBySlug);

      const technologiesInQuery = fuzzySearchTechnologies(technologies, searchQuery);

      if (technologiesInQuery.length > 0 && groupBy === 'auto') {
        // if we have technologies in the query and are grouping automatically, group by the first technology in the query
        technologies = technologies.filter((technology) => {
          if (technologiesInQuery[0].parent && technology.parent?.slug === technologiesInQuery[0].parent?.slug) {
            return true;
          }
          return isTechnologyDescendantOf(technologiesBySlug, technology.slug, technologiesInQuery[0].slug)
            || isTechnologyDescendantOf(technologiesBySlug, technologiesInQuery[0].slug, technology.slug);
        });

        groupByProperty = 'technology-type';
        groupByValue = technologies[0].type.slug;
      } else {
        // if we don't have technologies in the query, search in projects for the query
        projectsData = fuzzySearchProjects(projectsData, searchQuery);
      }
    } else {
      // sort projects by date
      projectsData.sort((a, b) => sortProjectsFunction(a, b));
    }

    if (groupByProperty && groupByValue) {

      let groups: ProjectsGroupRaw[] = [];

      // group by property
      switch (groupByProperty) {
        case 'date': // group by date
          groups = groupByDate(projectsData, groupByValue as GroupByDateType);
          break;
        case 'technology-type': // group by technology type
          groups = groupByTechnologyType(projectsData, groupByValue, includeOther, technologies?.map(technology => technology.slug));
          break;
        default:
          throw new Error('Invalid group_by_property');
      }

      let data = convertGroupRawToCompact(groups);

      return {
        resultType: ProjectsSearchResultType.GROUPED,
        groupByProperty,
        groupByValue,
        data,
      };
    } else {
      let data = convertProjectsRawToCompact(projectsData);

      if (featuredFirst) {
        data = data.sort((a, b) => {
          if (a.featured === b.featured) {
            return 0;
          }
          return a.featured ? -1 : 1;
        });
      }

      if (limit !== Infinity) {
        data = data.slice(0, limit);
      }

      return {
        resultType: ProjectsSearchResultType.LIST,
        groupByProperty: null,
        groupByValue: null,
        data,
      };
    }
  }
);