import {CurrentlyListeningResponse, getCurrentlyListeningCached} from "~/server/api/v1/fun/currently_listening";
import {h3SendMediaFromUrl} from "~/lib/h3mediaProxy";

export default defineEventHandler(async (event) => {
   const listeningData = await getCurrentlyListeningCached() as CurrentlyListeningResponse;

   if (!listeningData.albumArtUrl) {
        throw new Error('No album art available');
   }

   return h3SendMediaFromUrl(event, listeningData.albumArtUrl);
});