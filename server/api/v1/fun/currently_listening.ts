import axios, {AxiosResponse} from "axios";
import {createClient} from "@supabase/supabase-js";

export interface Entity {
  id: string;
  provider: string;
}

export interface EntityData {
  response: AxiosResponse<any, any>;
  entity: Entity;
}

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
}

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

const headers = {
  "Authorization": `Bearer ${process.env.HOME_ASSISTANT_ACCESS_TOKEN}`,
}

export const getCurrentlyListening = async (): Promise<CurrentlyListeningResponse> => {
  const response = await axios.get(`${process.env.HOME_ASSISTANT_URL}/api/states/${process.env.HOME_ASSISTANT_SPOTIFY_ENTITY_ID}`, { headers });

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

  return {
    //responses: responses.map((response) => { return { ...response, response: response.response.data } }),
    contentProvider: !data.state || data.state !== "idle" ? provider : null,
    contentId: data.attributes.media_content_id ?? null,
    state: data.state ?? null,
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
  };
}

export default defineEventHandler(async (): Promise<CurrentlyListeningResponse> => {
  // load settings from supabase
  const { data: settingsData } = await supabase
    .from('page_settings')
    .select('value')
    .eq('key', 'enable-currently-listening')
    .single()

  // if this endpoint is disabled, return null
  if (!settingsData || settingsData?.value.value !== true) {
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
    };
  } else {
    const res = await getCurrentlyListening()

    return {
      ...res,
      albumArtUrl: res.albumArtUrl ? `/api/v1/fun/currently_listening/media_proxy_album_art?t=${new Date().getTime()}` : null,
    };
  }
});
