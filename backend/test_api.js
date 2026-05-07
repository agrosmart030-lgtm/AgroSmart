import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function run() {
  try {
    const consumerKey = process.env.EMBRAPA_CONSUMER_KEY;
    const consumerSecret = process.env.EMBRAPA_CONSUMER_SECRET;
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    const tokenRes = await axios.post('https://api.cnptia.embrapa.br/token', 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const token = tokenRes.data.access_token;
    console.log('Token adquirido:', token.substring(0, 10) + '...');
    
    const testUrls = [
      'https://api.cnptia.embrapa.br/agritec/v1/respondeagro',
      'https://api.cnptia.embrapa.br/agritec/v1/responde-agro',
      'https://api.cnptia.embrapa.br/agritec/v1/graphql',
      'https://api.cnptia.embrapa.br/agritec/v1/info',
      'https://api.cnptia.embrapa.br/respondeagro/v1/graphql'
    ];
    
    for (const url of testUrls) {
      try {
        const res = await axios.post(url, { query: '{ __schema { types { name } } }' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(url, 'SUCCESS', res.status);
      } catch (err) {
        console.log(url, 'FAILED:', err.response?.status, err.response?.data);
      }
    }
  } catch(e) {
    console.error('Auth fail:', e.response?.data || e.message);
  }
}

run();
