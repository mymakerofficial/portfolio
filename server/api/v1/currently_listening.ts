import axios from "axios";

interface Entity {
  id: string;
  provider: string;
}

export default defineEventHandler(async () => {
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

  let response = null;
  let provider = null;
  for (const entity of entities) {
    if (!entity.id) { continue; }
    response = await axios.get(`${homeAssistantUrl}/api/states/${entity.id}`, { headers });
    provider = entity.provider;
    if (response.data.state === 'playing') {
      break;
    }
  }

  if (!response?.data || response?.status !== 200) {
    throw new Error('Error fetching data');
  }

  const data = response.data;

  const getShareUrl = () => {
    if (data.attributes.media_content_id && typeof data.attributes.media_content_id === 'string') {
      if (data.attributes.media_content_id.includes("spotify:track:")) {
        return `https://open.spotify.com/track/${data.attributes.media_content_id?.split(':').pop()}`
      }
    }
    return null;
  }

  return {
    contentProvider: provider,
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
});
