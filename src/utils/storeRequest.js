import axios from 'axios';
import { storeGetModel } from '@/utils/global.js';
const service = axios.create({
  baseURL: storeGetModel,
  timeout: 30000000
});

export default service;