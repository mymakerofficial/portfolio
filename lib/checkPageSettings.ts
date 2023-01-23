import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export const getPageSettingCached = cachedFunction(
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
    swr: true,
    name: 'page-settings',
    maxAge: 60 * 10, // 10 minutes
    // @ts-ignore
    getKeys: (key: string) => key,
  }
);