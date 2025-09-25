import axios from 'axios';

export const apiAgrosmart = axios.create({
  baseURL: 'http://localhost:3000/api',
});