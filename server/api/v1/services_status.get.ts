import axios from "axios";

export default defineCachedEventHandler(
  async () => {
    const servicesSeparated = process.env.SERVICES;

    if (!servicesSeparated) {
      throw new Error('No services defined');
    }

    const servicesSplit = servicesSeparated.split(',');

    let services: {name: string, url: string}[] = [];

    // every other item is a name, the next is a url
    for (let i = 0; i < servicesSplit.length; i += 2) {
      const name = servicesSplit[i];
      const url = servicesSplit[i + 1];

      services.push({ name, url });
    }

    let result = [];

    for (let i = 0; i < services.length; i++){
      const service = services[i];

      const status = await axios.get(service.url)
        .then((r) => {
          return r?.status || null;
        })
        .catch((e) => {
          return e?.response?.status || null;
        });

      const available = [200, 401].includes(status);

      result.push({ name: service.name, available });
    }

    const numberOfServices = result.length;
    const numberOfAvailableServices = result.filter((r) => r.available).length;

    return { available: numberOfAvailableServices === numberOfServices };
  },
  {
    maxAge: 600, // 10 minutes
  }
);