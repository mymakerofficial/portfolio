import axios from "axios";
import {getPageSettingCached} from "~/lib/checkPageSettings";

export interface CurrentlyPlayingResponse {
  contentProvider: string | null;
  contentId: string | null,
  state: string | null;
  gameName: string | null;
  developers: string[] | null;
  publishers: string[] | null;
  shortDescription: string | null;
  headerImageUrl: string | null;
  websiteUrl: string | null;
  steamUrl: string | null;
}

const defaultParams = {
  key: process.env.STEAM_API_KEY,
  format: "json",
};

export const getCurrentlyPlaying = async (): Promise<CurrentlyPlayingResponse> => {
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

  const playerData = playerSummaryResponse.data.response.players[0];

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
    contentId: gameid,
    state: state,
    gameName: gameData.name,
    developers: gameData.developers,
    publishers: gameData.publishers,
    shortDescription: gameData.short_description,
    headerImageUrl: gameData.header_image,
    websiteUrl: gameData.website,
    steamUrl: success ? `https://store.steampowered.com/app/${gameid}` : null,
  };
}

export const getCurrentlyPlayingCached = cachedFunction(
  getCurrentlyPlaying,
  {
    name: "currently-playing",
    maxAge: Number(process.env.CACHE_MAX_AGE_FUN) || 600,
  }
)

export default defineEventHandler(async (): Promise<CurrentlyPlayingResponse> => {
  const settingsData = await getPageSettingCached('enable-currently-playing') as { value: boolean };

  // if this endpoint is disabled, return null
  if (!(!settingsData || settingsData?.value !== true)) {
    return {
      contentProvider: null,
      contentId: null,
      state: "offline",
      gameName: null,
      developers: null,
      publishers: null,
      shortDescription: null,
      headerImageUrl: null,
      websiteUrl: null,
      steamUrl: null,
    };
  } else {
    const res = await getCurrentlyPlayingCached() as CurrentlyPlayingResponse;

    return {
      ...res,
      headerImageUrl: res.headerImageUrl ? `/api/v1/fun/currently_playing/media_proxy_header_image?i=${res.contentId}` : null
    };
  }
});
