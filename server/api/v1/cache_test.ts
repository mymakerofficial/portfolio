import {supabase} from "~/lib/supabase";
import {PostgrestError} from "@supabase/supabase-js";
import {ProjectsRawData} from "~/server/api/v1/projects";

const generate = async () => {
  /*
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const current = new Date().toISOString();
  useStorage().setItem('test:foo', { hello: current });
   */

  console.log(`starting to fetch projects at ${new Date().toISOString()}`);

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

  console.log(`finished fetching projects at ${new Date().toISOString()}`);

  useStorage().setItem('data-cache:projects', { rawData: projectsData, generatedAt: new Date().toISOString() });
}

export default defineEventHandler(async () => {
  generate();
  const test = await useStorage().getItem('data-cache:projects')
  return `${new Date().toISOString()} ... ${JSON.stringify(test)}`;
});

/*
export default cachedEventHandler(
  async () => {
    new Promise((resolve) => setTimeout(resolve, 1000));
    return `Response generated at ${new Date().toISOString()}`;
  },
  {
    swr: true,
    maxAge: 60,
  }
);
 */