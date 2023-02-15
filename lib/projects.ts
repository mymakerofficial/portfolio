import {supabase} from "~/lib/supabase";
import {PostgrestError} from "@supabase/supabase-js";
import {JSONContent} from "@tiptap/core";

export interface ProjectsTechnologyRaw {
  slug: string;
  displayName: string;
  shortDisplayName: string;
  type: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
  };
  parent?: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
  }
}

export interface ProjectsRawData {
  slug: string;
  displayName: string;
  summary: string;
  bodyProse: JSONContent;
  type: {
    slug: string;
    displayName: string;
    shortDisplayName: string;
  };
  url: string;
  releaseDate: string;
  startedDate: string;
  featured: boolean;
  detailsDisclosureHeading: string;
  detailsDisclosureText: string;
  tags: {
    slug: string;
    displayName: string;
  }[];
  collaborators: {
    slug: string;
    displayName: string;
    websiteUrl: string;
  }[];
  technologies: ProjectsTechnologyRaw[];
  githubRepo: string;
  keepGithubRepoSecret: boolean;
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

export enum ProjectsSearchResultType {
  LIST = 'list',
  GROUPED = 'grouped',
}

const getProjectsRawData = async (): Promise<ProjectsRawData[]> => {
  console.log('Fetching projects')

  // fetch projects from supabase
  const {data: projectsData, error: projectsError} = await supabase
    .from('projects')
    .select('' +
      'slug, ' +
      'displayName: display_name, ' +
      'summary, ' +
      'bodyProse: body_text_prosemirror,' +
      'type: type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ), ' +
      'url, ' +
      'releaseDate: released_at_date, ' +
      'startedDate: started_at_date, ' +
      'featured, ' +
      'detailsDisclosureHeading: details_disclosure_heading, ' +
      'detailsDisclosureText: details_disclosure_text, ' +
      'tags ( slug, displayName: display_name ), ' +
      'collaborators: people ( slug, displayName: display_name, websiteUrl: website_url ), ' +
      'technologies ( ' +
      ' slug, ' +
      ' displayName: display_name, ' +
      ' shortDisplayName: short_display_name, ' +
      ' type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ), ' +
      ' parent: parent_technology_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ' +
      '), ' +
      'githubRepo: github_repo, ' +
      'keepGithubRepoSecret: keep_github_repo_secret, ' +
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

export const getProjectsRawDataCached = cachedFunction(
  getProjectsRawData,
  {
    name: 'projects-raw-data',
    maxAge: Number(process.env.CACHE_MAX_AGE_PROJECTS) || 3600,
    staleMaxAge: -1,
  }
);