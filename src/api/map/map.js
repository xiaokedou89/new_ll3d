import map from '@/utils/mapRequest.js';

export function getMap(params) {
  return map({
    method: 'get',
    params
  })
}