import {useFetch} from "#app";
import {ProjectsResponse} from "~/server/api/v1/projects";
import {Ref} from "vue";

export interface ProjectsListOptions {
  query?: string;
  groupBy?: string;
  includeOther?: boolean;
  featuredFist?: boolean;
  limit?: number;
}

export const useProjectsList = async (options?: ProjectsListOptions): Promise<Ref<ProjectsResponse>> => {
  let url = "/api/v1/projects";

  const params = new URLSearchParams();

  if (options?.query) {
    params.append('q', options.query);
  }

  if (options?.groupBy) {
    params.append('group_by', options.groupBy);
  }

  if (options?.includeOther) {
    params.append('include_other', 'true');
  }

  if (options?.featuredFist) {
    params.append('featured_first', 'true');
  }

  if (options?.limit) {
    params.append('limit', options.limit.toString());
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const {data: projects} = await useFetch(url);

  return projects as Ref<ProjectsResponse>;
}