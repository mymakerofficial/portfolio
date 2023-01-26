import {createClient} from '@supabase/supabase-js'
import {Octokit} from "octokit";
import { JSONContent } from "@tiptap/core"

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export default cachedEventHandler(
  async (event) => {
    console.log('Fetching project', event.context.params.slug)

    const { data: projectData, error } = await supabase
      .from('projects')
      .select('' +
        'slug, ' +
        'displayName: display_name, ' +
        'summary, ' +
        'bodyProse: body_text_prosemirror, ' +
        'type ( displayName: display_name, shortDisplayName: short_display_name ), ' +
        'url, ' +
        'releaseDate: released_at_date, ' +
        'startedDate: started_at_date, ' +
        'detailsDisclosureHeading: details_disclosure_heading, ' +
        'detailsDisclosureText: details_disclosure_text, ' +
        'tags ( slug, displayName: display_name ), ' +
        'collaborators: people ( slug, displayName: display_name, websiteUrl: website_url ), ' +
        'technologies ( slug, displayName: display_name, shortDisplayName: short_display_name, type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ), ' +
        'githubRepo: github_repo, ' +
        'keepGithubRepoSecret: keep_github_repo_secret, ' +
        'thumbnailPath: thumbnail_path'
      )
      .eq('slug', event.context.params.slug)
      .single() as any;

    if (!projectData || error) {
      throw new Error(error.message || 'Error fetching project');
    }

    let technologiesOut: any[] = []
    let types: any = {}

    if (projectData.technologies) {
      // @ts-ignore
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

    let lastCommitDate: string | null = null
    if (projectData.githubRepo) {
      try {
        let githubRepo = projectData.githubRepo

        // get date of last commit to master
        const { data: githubData } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
          owner: githubRepo.split('/')[0],
          repo: githubRepo.split('/')[1],
          per_page: 1
        });

        if (githubData.length > 0) {
          lastCommitDate = githubData[0].commit.author?.date || null
        }
      } catch (_) {}
    }

    return {
      slug: projectData.slug,
      displayName: projectData.displayName,
      summary: projectData.summary,
      bodyProse: projectData.bodyProse as JSONContent,
      type: projectData.type?.shortDisplayName || projectData.type?.displayName || 'Project',
      thumbnailUrl: projectData.thumbnailPath ? `/api/v1/projects/${projectData.slug}/thumbnail` : null,
      websiteUrl: projectData.url,
      releaseDate: projectData.releaseDate,
      startedDate: projectData.startedDate,
      lastCommitDateTime: lastCommitDate,
      githubRepo: projectData.keepGithubRepoSecret ? null : projectData.githubRepo,
      githubRepoUrl: projectData.keepGithubRepoSecret ? null : `https://github.com/${projectData.githubRepo}`,
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
    // @ts-ignore
    getKeys: (event): string => {
      return event.context.params.slug;
    },
  }
);
