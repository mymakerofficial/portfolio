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

export const getCurrentlyListening = async (): Promise<CurrentlyListeningResponse> => {
  const homeAssistantUrl = process.env.HOME_ASSISTANT_URL || '';
  const homeAssistantToken = process.env.HOME_ASSISTANT_ACCESS_TOKEN || '';

  const headers = {
    "Authorization": `Bearer ${homeAssistantToken}`,
  }

  const entities: Entity[] = [
    {
      id: process.env.HOME_ASSISTANT_SPOTIFY_ENTITY_ID || '',
      provider: 'spotify',
    },
    {
      id: process.env.HOME_ASSISTANT_MOBILE_PLEXAMP_ENTITY_ID || '',
      provider: 'plex',
    },
    {
      id: process.env.HOME_ASSISTANT_DESKTOP_PLEXAMP_ENTITY_ID || '',
      provider: 'plex',
    },
    {
      id: process.env.HOME_ASSISTANT_LAPTOP_PLEXAMP_ENTITY_ID || '',
      provider: 'plex',
    }
  ]

  let dataList: EntityData[] = [];

  for (const entity of entities) {
    if (!entity.id) continue; // skip if no entity id

    const response = await axios.get(`${homeAssistantUrl}/api/states/${entity.id}`, { headers });

    dataList.push({
      response,
      entity,
    })

    if (response.data.state === 'playing') break; // stop if we find a playing entity
  }

  if (!dataList[0]?.response.data || dataList[0]?.response.status !== 200) {
    throw new Error('Error fetching data');
  }

  // choose last response
  let data = dataList[dataList.length - 1]?.response.data;
  let provider = dataList[dataList.length - 1]?.entity.provider;

  // if last entity is not playing, return the first entity
  if (data.state !== 'playing') {
    data = dataList[0]?.response.data;
    provider = dataList[0]?.entity.provider;
  }

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
    albumArtUrl: data.attributes.entity_picture ? `${homeAssistantUrl}${data.attributes.entity_picture}` : null,
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
    .eq('key', 'enable-realtime-data-api')
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
