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
    
    const url = 'https://api.cnptia.embrapa.br/respondeagro/v1/_search/template';
    const payload = {
      id: 'query_all',
      params: {
        query_string: 'soja',
        from: 0,
        size: 5
      }
    };

    console.log('Testando endpoint:', url);
    const res = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('SUCCESS! Dados recebidos:');
    console.log(JSON.stringify(res.data, null, 2).substring(0, 800));
  } catch(e) {
    console.error('FAILED:', e.response?.status, e.response?.data || e.message);
  }
}

run();
