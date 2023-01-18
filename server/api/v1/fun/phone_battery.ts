import axios, {AxiosResponse} from "axios";

export interface PhoneBatteryResponse {
  batteryLevel: number | null;
  charging: boolean | null;
}

const headers = {
  "Authorization": `Bearer ${process.env.HOME_ASSISTANT_ACCESS_TOKEN}`,
}

export const getPhoneBattery = async (): Promise<PhoneBatteryResponse> => {
  const levelResponse = await axios.get(`${process.env.HOME_ASSISTANT_URL}/api/states/${process.env.HOME_ASSISTANT_PHONE_BATTERY_LEVEL_ENTITY_ID}`, { headers });

  return {
    batteryLevel: levelResponse.data.state,
    charging: false,
  }
}

export default defineEventHandler(async (): Promise<PhoneBatteryResponse> => {
  return getPhoneBattery();
});