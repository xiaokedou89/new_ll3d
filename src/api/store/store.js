import request from '@/utils/storeRequest.js';

export function getFile(fileUrl) {
  return request({
    url: `/${fileUrl}`,
    method: 'get',
    responseType: 'blob'
  });
}