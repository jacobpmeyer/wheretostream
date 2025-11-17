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
    if (response.length > 0) {
      console.log('Search response sample:', JSON.stringify(response[0], null, 2));
    }
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
    console.log('Show details response keys:', Object.keys(response));
    console.log('Show imageSet:', response.imageSet);

    // Log streaming options with subtitle info
    if (response.streamingOptions?.[country]) {
      console.log('Streaming options for', country, ':');
      response.streamingOptions[country].forEach((option: any) => {
        console.log(`  ${option.service.name}:`, {
          subtitles: option.subtitles,
          audios: option.audios
        });
      });
    }

    return response;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
}

export { client };
