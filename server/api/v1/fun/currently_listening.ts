import axios from "axios";
import {getFunCardSettingsCached} from "~/lib/checkPageSettings";
import {customCachedFunction} from "~/lib/customCache";

export interface CurrentlyListeningResponse {
  contentProvider: string | null;
  contentId: string | null,
  state: string | null,
  artistName: string | null,
  albumArtistName: string | null,
  trackTitle: string | null,
  albumName: string | null,
  albumArtUrl: string | null,
  playbackDuration: number | null,
  playbackPosition: number | null,
  playbackShuffle: boolean | null,
  playbackRepeat: string | null,
  shareUrl: string | null,
  generatedAt: string,
  invalidAt: string,
}

export const getCurrentlyListening = async (): Promise<CurrentlyListeningResponse> => {
  const response = await axios.get(
    `${process.env.HOME_ASSISTANT_URL}/api/states/${process.env.HOME_ASSISTANT_SPOTIFY_ENTITY_ID}`,
    {
      headers: {
        "Authorization": `Bearer ${process.env.HOME_ASSISTANT_ACCESS_TOKEN}`,
      }
    }
  );

  if (!response?.data || response?.status !== 200) {
    throw new Error('Error fetching data');
  }

  let data = response.data;
  let provider = "spotify";

  const getShareUrl = () => {
    if (data.attributes.media_content_id && typeof data.attributes.media_content_id === 'string') {
      if (data.attributes.media_content_id.includes("spotify:track:")) {
        return `https://open.spotify.com/track/${data.attributes.media_content_id?.split(':').pop()}`
      }
    }
    return null;
  }

  let invalidAt = new Date(Date.now() + (process.env.DEFAULT_CURRENTLY_PLAYING_INVALIDATION_TIME as unknown as number || 120) * 1000)

  if (data.state === "playing") {
    // time when the song will be finished
    invalidAt = new Date(Date.now() + (data.attributes.media_duration - data.attributes.media_position) * 1000);
  }

  return {
    contentProvider: !data.state || data.state !== "idle" ? provider : null,
    contentId: data.attributes.media_content_id ?? null,
    state: (data.state ?? null) as "idle" | "playing" | "paused" | null,
    artistName: data.attributes.media_artist ?? null,
    albumArtistName: data.attributes.media_album_artist || data.attributes.media_artist || null,
    trackTitle: data.attributes.media_title ?? null,
    albumName: data.attributes.media_album_name ?? null,
    albumArtUrl: data.attributes.entity_picture ? `${process.env.HOME_ASSISTANT_URL}${data.attributes.entity_picture}` : null,
    playbackDuration: data.attributes.media_duration ?? null,
    playbackPosition: data.attributes.media_position ?? null,
    playbackShuffle: data.attributes.shuffle ?? null,
    playbackRepeat: data.attributes.repeat ?? null,
    shareUrl: getShareUrl(),
    generatedAt: new Date().toISOString(),
    invalidAt: invalidAt.toISOString(),
  };
}

export const getCurrentlyListeningCached = customCachedFunction(
  async () => {
    return await getCurrentlyListening();
  },
  {
    name: 'currently-listening',
    maxAge: Number(process.env.CACHE_MAX_AGE_FUN) || 600,
    invalidate: (data: CurrentlyListeningResponse) => {
      if (data.invalidAt) {
        return new Date().getTime() > new Date(data.invalidAt).getTime();
      } else {
        return false;
      }
    }
  }
);

export default defineEventHandler(async (): Promise<CurrentlyListeningResponse> => {
  const funCardSettings = await getFunCardSettingsCached();

  // if this endpoint is disabled, return null
  if (!(funCardSettings?.["currently-listening"]?.enabled)) {
    return {
      contentProvider: null,
      contentId: null,
      state: "idle",
      artistName: null,
      albumArtistName: null,
      trackTitle: null,
      albumName: null,
      albumArtUrl: null,
      playbackDuration: null,
      playbackPosition: null,
      playbackShuffle: null,
      playbackRepeat: null,
      shareUrl: null,
      generatedAt: new Date().toISOString(),
      invalidAt: new Date(Date.now() + (process.env.DEFAULT_CURRENTLY_PLAYING_INVALIDATION_TIME as unknown as number || 120) * 1000).toISOString(),
    };
  }

  const res = await getCurrentlyListeningCached() as CurrentlyListeningResponse;

  return {
    ...res,
    albumArtUrl: res.albumArtUrl ? `/media_proxy/currently_listening_album_art?i=${res.contentId}` : null,
  };
});
