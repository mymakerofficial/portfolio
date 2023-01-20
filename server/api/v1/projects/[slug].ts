import {createClient} from '@supabase/supabase-js'
import {Octokit} from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export default defineEventHandler(async (event) => {
  const { data: projectData, error } = await supabase
    .from('projects')
    .select('' +
      'slug, ' +
      'displayName: display_name, ' +
      'summary, ' +
      'type, ' +
      'url, ' +
      'releaseDate: released_at_date, ' +
      'startedDate: started_at_date, ' +
      'tags ( slug, displayName: display_name ), ' +
      'collaborators: people ( slug, displayName: display_name, websiteUrl: website_url ), ' +
      'technologies ( slug, displayName: display_name, shortDisplayName: short_display_name, type: technology_type_id ( slug, displayName: display_name, shortDisplayName: short_display_name ) ), ' +
      'githubRepo: github_repo, ' +
      'keepGithubRepoSecret: keep_github_repo_secret, ' +
      'thumbnailId: thumbnail_id'
    )
    .eq('slug', event.context.params.slug)
    .single() as any;

  if (!projectData || error) {
    throw new Error(error.message || 'Error fetching project');
  }

  const { data: projectType } = await supabase
    .from('project_types')
    .select('slug, displayName: display_name, shortDisplayName: short_display_name')
    .eq('slug', projectData.type)
    .single();

  if (!projectType) {
    throw new Error('Error fetching project types');
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
    type: projectType,
    websiteUrl: projectData.url,
    releaseDate: projectData.releaseDate,
    startedDate: projectData.startedDate,
    lastCommitDateTime: lastCommitDate,
    tags: projectData.tags,
    collaborators: projectData.collaborators,
    technologies: technologiesOut,
    githubRepo: projectData.keepGithubRepoSecret ? null : projectData.githubRepo,
    githubRepoUrl: projectData.keepGithubRepoSecret ? null : `https://github.com/${projectData.githubRepo}`,
    thumbnailUrl: projectData.thumbnailId ? `/api/v1/projects/${projectData.slug}/thumbnail` : null,
  };
});
