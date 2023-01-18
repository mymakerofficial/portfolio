import axios from "axios";
import {createClient} from "@supabase/supabase-js";

export interface PhoneBatteryResponse {
  batteryLevel: number | null;
  charging: boolean | null;
}

const headers = {
  "Authorization": `Bearer ${process.env.HOME_ASSISTANT_ACCESS_TOKEN}`,
}

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

export const getPhoneBattery = async (): Promise<PhoneBatteryResponse> => {
  const levelResponse = await axios.get(`${process.env.HOME_ASSISTANT_URL}/api/states/${process.env.HOME_ASSISTANT_PHONE_BATTERY_LEVEL_ENTITY_ID}`, { headers });

  return {
    batteryLevel: levelResponse.data.state,
    charging: false,
  }
}

export default defineEventHandler(async (): Promise<PhoneBatteryResponse> => {
  // load settings from supabase
  const { data: settingsData } = await supabase
    .from('page_settings')
    .select('value')
    .eq('key', 'enable-phone-battery')
    .single()

  // if this endpoint is disabled, return null
  if (!settingsData || settingsData?.value.value !== true) {
    return {
      batteryLevel: null,
      charging: null,
    }
  } else {
    return getPhoneBattery();
  }
});