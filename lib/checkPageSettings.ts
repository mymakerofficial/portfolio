import {supabase} from "~/lib/supabase";

export const getFunCardSettingsCached = cachedFunction(
  async () => {
    console.log('Fetching fun card settings');

    const { data, error } = await supabase
      .from('fun_card_settings')
      .select('key, enabled')

    if (error) {
      throw new Error("Error fetching fun card settings: " + error.message)
    }

    let returnData: Record<string, { enabled: boolean }> = {};
    data.forEach((item) => {
      returnData[item.key] = { enabled: item.enabled };
    });

    return returnData;
  },
  {
    name: 'fun-card-settings',
    maxAge: Number(process.env.CACHE_MAX_AGE_FUN) || 600,
    staleMaxAge: -1,
    swr: true,
  }
)