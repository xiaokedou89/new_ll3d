import * as Three from "three";
// 模型工具类
/**
 * 判断模型是多模型还是单一模型
 * @param model
 */
export function getType(model){
    let length=0;
    model.traverse(function (child) {
        if (child.isMesh) {
           length++;
        }
    })
    if (length>1){
        // console.log('多')
        return 0
    }else{
        // console.log('少')
        return 1;
    }

}