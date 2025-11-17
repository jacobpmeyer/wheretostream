import { Client, Configuration } from 'streaming-availability';

if (!process.env.RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY environment variable is not set');
}

console.log('Initializing Streaming API client...');
console.log('API Key present:', !!process.env.RAPIDAPI_KEY);
console.log('API Key full value:', process.env.RAPIDAPI_KEY);
console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('RAPID')));

const client = new Client(
  new Configuration({
    apiKey: 'd9afdc7e5dmshe99497b54208206p1809f6jsn28f1b19dd223'
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
    return response;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
}

export { client };
