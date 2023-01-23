import {h3SendMediaFromUrl} from "~/lib/h3mediaProxy";
import {CurrentlyPlayingResponse, getCurrentlyPlayingCached} from "~/server/api/v1/fun/currently_playing";

export default defineEventHandler(async (event) => {
  const playingData = await getCurrentlyPlayingCached() as CurrentlyPlayingResponse;

  if (!playingData.headerImageUrl) {
    throw new Error('No header image available');
  }

  return h3SendMediaFromUrl(event, playingData.headerImageUrl);
});