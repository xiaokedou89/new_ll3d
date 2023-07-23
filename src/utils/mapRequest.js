import axios from 'axios';
import { mapUrl } from '@/utils/global.js';
const service = axios.create({
  baseURL: mapUrl,
  timeout: 30000000
});

export default service;