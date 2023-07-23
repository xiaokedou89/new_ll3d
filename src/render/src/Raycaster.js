/**
 * 封装threejs的射线
 */
import * as Three from "three";
let ThreeRaycaster = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.Raycaster();
        }
        return instance;
    }
})();
let ModelRaycaster = (function(){
    let instance;
    let ModelRaycaster = function(  ){
        if ( instance ){
            return instance;
        }
        this.raycaster = new ThreeRaycaster();
        return instance = this;
    };
    /**
     * 获取射线类点击到的第一个对象和法线
     * @param flag
     * @param event
     * @returns {{normal: null, distance: null, model: null, point: null}}
     */
    ModelRaycaster.prototype.getRayObjAndNormal=function (dom,camera,model,event){
        let mouse=new Three.Vector2()
        const mainCanvas = dom.getElementsByTagName('canvas')[0]
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1// 标准设备横坐标
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1// 标准设备纵坐标
        this.raycaster.setFromCamera(mouse, camera);
        let intersects = this.raycaster.intersectObjects(model.children, true)
        let obj={normal:null,point:null,model:null,distance:null}
        if(intersects.length>0){
            let normal= intersects[0].face.normal
            const model = intersects[0].object
            model.updateMatrixWorld()
            let normalMatrix = new Three.Matrix3().getNormalMatrix( model.matrixWorld );
            let newNormal = normal.clone().applyMatrix3( normalMatrix ).normalize();
            obj.normal=newNormal;// 当前位置曲面法线
            obj.point =new Three.Vector3().copy(intersects[0].point)
            obj.model = intersects[0].object
            obj.distance=intersects[0].distance
        }
        return obj
    }
    return ModelRaycaster;
})();

//

export {ModelRaycaster}