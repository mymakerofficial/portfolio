import {AsyncData, useFetch} from "#app";

// TODO: Apparently the project endpoint does not have a return type yet so that should be added
/***
 * Fetches a project by slug
 */
export const useProject = (slug: string): AsyncData<any, any> => {
  const url = "/api/v1/projects";

  return useFetch(`${url}/${slug}`);
}