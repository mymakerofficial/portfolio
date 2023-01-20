import { Octokit } from "octokit";
import {createClient} from "@supabase/supabase-js";

const octokit = new Octokit();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export interface RecentGithubCommitResponse {
  eventId: string | null;
  eventType: string | null;
  actor: {
    displayLogin: string | null;
    avatarUrl: string | null;
    htmlUrl: string | null;
  },
  repo: {
    name: string | null;
    htmlUrl: string | null;
  },
  commit: {
    ref: string | null;
    message: string | null;
    htmlUrl: string | null;
  },
  createdAt: string | null;
}

export const getRecentGithubCommit = async (): Promise<RecentGithubCommitResponse> => {
  const username = process.env.GITHUB_USERNAME || "";
  const { data } = await octokit.request("GET /users/{username}/events", {
    username
  });

  // filter out events that are not commits
  const events = data.filter((event: any) => {
    return event.type === "PushEvent" && event.payload.commits.length > 0 && event.public;
  });

  if (events.length === 0) {
    throw new Error("No recent commits found");
  }

  const event = events[0] as any;

  return {
    eventId: event.id,
    eventType: event.type,
    actor: {
      displayLogin: event.actor.display_login,
      avatarUrl: event.actor.avatar_url,
      htmlUrl: `https://github.com/${event.actor.display_login}`
    },
    repo: {
      name: event.repo.name,
      htmlUrl: `https://github.com/${event.repo.name}`
    },
    commit: {
      ref: event.payload.ref,
      message: event.payload.commits[0].message,
      htmlUrl: `https://github.com/${event.repo.name}/commit/${event.payload.commits[0].sha}`
    },
    createdAt: event.created_at
  };
}

export default defineEventHandler(async (): Promise<RecentGithubCommitResponse> => {
  // load settings from supabase
  const { data: settingsData } = await supabase
    .from('page_settings')
    .select('value')
    .eq('key', 'enable-recent-github-commit')
    .single()

  // if this endpoint is disabled, return null
  if (!settingsData || settingsData?.value.value !== true) {
    return {
      eventId: null,
      eventType: null,
      actor: {
        displayLogin: null,
        avatarUrl: null,
        htmlUrl: null
      },
      repo: {
        name: null,
        htmlUrl: null
      },
      commit: {
        ref: null,
        message: null,
        htmlUrl: null
      },
      createdAt: null
    }
  } else {
    return await getRecentGithubCommit();
  }
});