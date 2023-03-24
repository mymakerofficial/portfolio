import {Octokit} from "octokit";
import { JSONContent } from "@tiptap/core"
import {ProjectsRawData} from "~/lib/projects";
import {supabase} from "~/lib/supabase";
import {PostgrestError} from "@supabase/supabase-js";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export default defineCachedEventHandler(
  async (event) => {
    // fetch projects from supabase
    // @ts-ignore
    const { data: projectData } = await supabase
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
        'repositories ( name, owner, title, description, public, provider ( slug, baseUrl: base_url ) ), ' +
        'thumbnailPath: thumbnail_path'
      )
      .eq('slug', event.context.params!.slug)
      .single() as { data: Partial<ProjectsRawData>, error: PostgrestError | null }

    if (!projectData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project Not Found'
      })
    }

    let technologiesOut: any[] = []
    let types: any = {}

    if (projectData.technologies) {
      for (let technology of projectData.technologies) {
        let type = technology.type
        if (!types[type.slug]) {
          types[type.slug] = {
            slug: type.slug,
            displayName: type.displayName,
            shortDisplayName: type.shortDisplayName,
            technologies: []
          }
          technologiesOut.push(types[type.slug])
        }
        types[type.slug].technologies.push({
          slug: technology.slug,
          displayName: technology.displayName,
          shortDisplayName: technology.shortDisplayName
        })
      }
    }

    let lastCommitDate: Date = new Date(0);
    for (const repo of projectData.repositories?.filter((r) => r.provider.slug === "github") || []) {
      try {
        // get date of last commit to master
        const { data: githubData } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
          owner: repo.owner,
          repo: repo.name,
          per_page: 1
        });

        if (githubData.length === 0) {
          continue;
        }

        if (!githubData[0].commit.author?.date || new Date(githubData[0].commit.author?.date) < lastCommitDate) {
          continue;
        }

        lastCommitDate = new Date(githubData[0].commit.author?.date);
      } catch (_) {}
    }

    return {
      slug: projectData.slug,
      displayName: projectData.displayName,
      summary: projectData.summary,
      bodyProse: projectData.bodyProse as JSONContent,
      type: projectData.type?.shortDisplayName || projectData.type?.displayName || 'Project',
      thumbnailUrl: projectData.thumbnailPath ? `/cdn/${projectData.thumbnailPath.replace(/^\//, '')}` : null,
      websiteUrl: projectData.url,
      releaseDate: projectData.releaseDate,
      startedDate: projectData.startedDate,
      lastCommitDateTime: lastCommitDate.toISOString(),
      repositories: projectData.repositories?.filter((r) => r.public).map((r) => {
        return {
          name: r.name,
          owner: r.owner,
          url: `${r.provider.baseUrl.replace(/\/$/, "")}/${r.owner}/${r.name}`,
          title: r.title,
          description: r.description,
          provider: r.provider.slug,
        }
      }) || [],
      disclosure: {
        heading: projectData.detailsDisclosureHeading,
        text: projectData.detailsDisclosureText
      },
      tags: projectData.tags,
      collaborators: projectData.collaborators,
      technologies: technologiesOut,
    };
  },
  {
    name: "project",
    maxAge: Number(process.env.CACHE_MAX_AGE_PROJECTS) || 3600,
    staleMaxAge: -1,
    // @ts-ignore
    getKeys: (event): string => {
      return event.context.params.slug;
    },
  }
);
