import {Octokit} from "octokit";
import { JSONContent } from "@tiptap/core"
import {getProjectsRawDataCached} from "~/lib/projects";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export default cachedEventHandler(
  async (event) => {
    const projectsRaw = await getProjectsRawDataCached();

    const projectData = projectsRaw?.find((project) => project.slug === event.context.params.slug);

    if (!projectData) {
      throw new Error('Project not found');
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
      thumbnailUrl: projectData.thumbnailPath ? `/cdn/${projectData.thumbnailPath.replace(/^\//, '')}` : null,
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
    staleMaxAge: -1,
    // @ts-ignore
    getKeys: (event): string => {
      return event.context.params.slug;
    },
  }
);
