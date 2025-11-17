import { Client, Configuration } from 'streaming-availability';

if (!process.env.RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY environment variable is not set');
}

const client = new Client(
  new Configuration({
    apiKey: process.env.RAPIDAPI_KEY
  })
);

export async function searchShows(title: string, country: string = 'us') {
  try {
    const response = await client.showsApi.searchShowsByTitle({
      title,
      country,
      outputLanguage: 'en'
    });
    return response;
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
}

export async function getShowById(id: string, country: string = 'us') {
  try {
    const response = await client.showsApi.getShow({
      id,
      country,
      outputLanguage: 'en'
    });
    return response;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
}

export { client };
