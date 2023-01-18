import { createClient } from '@supabase/supabase-js'
import axios from "axios";

interface CurrentlyPlayingResponse {
  contentProvider: string | null;
  state: string | null;
  gameName: string | null;
  developers: string[] | null;
  publishers: string[] | null;
  shortDescription: string | null;
  headerImageUrl: string | null;
  websiteUrl: string | null;
  steamUrl: string | null;
}

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_KEY environment variable');
}

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

const defaultParams = {
  key: process.env.STEAM_API_KEY,
  format: "json",
};

export default defineEventHandler(async (): Promise<CurrentlyPlayingResponse> => {
  if (!supabase) {
    throw new Error('Could not create Supabase client')
  }

  const { data: settingsData, error } = await supabase
    .from('page_settings')
    .select('value')
    .eq('key', 'enable-realtime-data-api')
    .single()

  if (!settingsData || error) {
    throw new Error('Error fetching projects');
  }

  if (settingsData.value.value !== true) {
    return {
      contentProvider: null,
      state: "offline",
      gameName: null,
      developers: null,
      publishers: null,
      shortDescription: null,
      headerImageUrl: null,
      websiteUrl: null,
      steamUrl: null,
    };
  }

  // load the player summary
  const playerSummaryResponse = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`,
    { params:
        {
          ...defaultParams,
          steamids: process.env.STEAM_USER_ID,
        }
    }
  );

  let playerData = playerSummaryResponse.data.response.players[0];

  let state: string;
  let gameid: string;

  if (!playerData?.gameid) {
    // if there is no gameid, then the player is not playing a game in this case we return the player's most recent game
    const playerRecentGamesResponse = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001`,
      { params: { ...defaultParams, steamid: process.env.STEAM_USER_ID, count: 1, }}
    );

    const playerRecentGameData = playerRecentGamesResponse.data.response.games[0];

    state = "idle";
    gameid = playerRecentGameData.appid;
  } else {
    state = "playing";
    gameid = playerData.gameid;
  }

  // load the game details
  const gamesDataResponse = await axios.get(
    `https://store.steampowered.com/api/appdetails`,
    { params: { appids: gameid, format: "json", }}
  );

  const success = gamesDataResponse.data[gameid];
  const gameData = gamesDataResponse.data[gameid]?.data;

  if (!gameData) {
    throw new Error("Error fetching data");
  }

  return {
    contentProvider: "steam",
    state: state,
    gameName: gameData.name,
    developers: gameData.developers,
    publishers: gameData.publishers,
    shortDescription: gameData.short_description,
    headerImageUrl: gameData.header_image,
    websiteUrl: gameData.website,
    steamUrl: success ? `https://store.steampowered.com/app/${gameid}` : null,
  };
});
