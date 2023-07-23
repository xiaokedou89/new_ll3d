import * as obj from '@/render/src/threex-arpatternfile';
/**
 * 用于生成ar.js 的标志文件
 */
console.log(obj.default)
export function buildFullMarker(imgUrl){
    // console.log(imgUrl)
    obj.default.buildFullMarker(imgUrl,  0.50, '512px', 'black', function onComplete(markerUrl){
            return  markerUrl
        })
}
