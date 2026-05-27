import axios from 'axios';

const apiBaseUrl =
  process.env.AGROSMART_API_URL || `http://localhost:${process.env.PORT || 5001}/api`;

export const apiAgrosmart = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ''),
});
