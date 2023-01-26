import {createClient} from "@supabase/supabase-js";
import {customCachedFunction} from "~/lib/customCache";

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export const getPageSettingCached = customCachedFunction(
  async (key: string): Promise<object | null> => {
    console.log('Fetching page setting', key)

    const { data } = await supabase
      .from('page_settings')
      .select('value')
      .eq('key', key)
      .single()

    return data?.value || null;
  },
  {
    name: 'page-settings',
    maxAge: Number(process.env.CACHE_MAX_AGE_SETTINGS) || 600,
    getKeys: (key: string) => key,
  }
);