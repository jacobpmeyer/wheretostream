import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env.local (Next.js does this automatically)
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('Error loading .env.local:', error);
}

async function testAPI() {
  // Dynamic import AFTER env is loaded
  const { searchShows, getShowById } = await import('../src/lib/streaming-api.js');
  console.log('Testing API connection...\n');

  if (!process.env.RAPIDAPI_KEY) {
    console.error('❌ RAPIDAPI_KEY is not set in .env.local');
    process.exit(1);
  }

  console.log('✓ RAPIDAPI_KEY is set');
  console.log('   Key starts with:', process.env.RAPIDAPI_KEY?.substring(0, 10) + '...');
  console.log();

  // First test with raw fetch
  console.log('0. Testing with raw fetch first...');
  try {
    const rawResponse = await fetch(
      'https://streaming-availability.p.rapidapi.com/shows/search/title?title=Inception&country=us&output_language=en',
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
      }
    );
    console.log('   Raw fetch status:', rawResponse.status, rawResponse.statusText);
    if (!rawResponse.ok) {
      const errorBody = await rawResponse.text();
      console.log('   Error body:', errorBody);
    } else {
      console.log('   ✓ Raw fetch works!');
    }
  } catch (error) {
    console.error('   Raw fetch error:', error);
  }
  console.log();

  try {
    // Test search
    console.log('1. Testing search for "Inception" with SDK...');
    const results = await searchShows('Inception', 'us');
    console.log(`   ✓ Found ${results.length} results`);

    if (results.length > 0) {
      console.log(`   ✓ First result: ${results[0].title} (${results[0].firstAirYear})`);

      // Test get show by ID
      console.log('\n2. Testing get show details...');
      const show = await getShowById(results[0].id, 'us');
      console.log(`   ✓ Fetched details for: ${show.title}`);
      console.log(`   ✓ Overview: ${show.overview?.substring(0, 100)}...`);

      if (show.streamingOptions && show.streamingOptions['us']) {
        console.log(`   ✓ Found ${show.streamingOptions['us'].length} streaming options in US`);
      }
    }

    console.log('\n✅ API connection successful!');
    console.log('All tests passed. You\'re ready to build the app!\n');
  } catch (error) {
    console.error('\n❌ API test failed:');
    console.error(error);
    console.log('\nPlease check:');
    console.log('1. Your RAPIDAPI_KEY is set in .env.local');
    console.log('2. You have subscribed to the API on RapidAPI');
    console.log('3. You have not exceeded your rate limit\n');
    process.exit(1);
  }
}

testAPI();
