import axios from "axios";
import {getPageSettingCached} from "~/lib/checkPageSettings";

export interface PhoneBatteryResponse {
  batteryLevel: number | null;
  charging: boolean | null;
}

export default cachedEventHandler(
  async (): Promise<PhoneBatteryResponse> => {
    const settingsData = await getPageSettingCached('enable-phone-battery') as { value: boolean };

    // if this endpoint is disabled, return null
    if (!settingsData || settingsData?.value !== true) {
      return {
        batteryLevel: null,
        charging: null,
      }
    } else {
      const levelResponse = await axios.get(
        `${process.env.HOME_ASSISTANT_URL}/api/states/${process.env.HOME_ASSISTANT_PHONE_BATTERY_LEVEL_ENTITY_ID}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.HOME_ASSISTANT_ACCESS_TOKEN}`,
          }
        }
      );

      return {
        batteryLevel: levelResponse.data.state,
        charging: false,
      }
    }
  },
  {
    name: 'phone-battery',
    maxAge: Number(process.env.CACHE_MAX_AGE_FUN) || 600,
  }
);