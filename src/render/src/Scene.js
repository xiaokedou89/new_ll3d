import * as Three from "three";

/**
 * 将threejs的场景进行单例化
 * @type {function(): Scene}
 */
let ThreeScene= (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.Scene();
        }
        return instance;
    }
})();
let TScene = (function(){
    let instance;
    let TScene = function(  ){
        if ( instance ){
            return instance;
        }
        this.scene = new ThreeScene();
        return instance = this;
    };
    // 给实例添加对象
    TScene.prototype.add=function (object){
        if ( object && object.isObject3D ) {
            this.scene.add(object)
        }
    }
    // 从当前对象的子级中移除对象。可以移除任意数量的对象。
    TScene.prototype.remove=function (object){
        if ( object && object.isObject3D ) {
            this.scene.remove(object)
        }
    }
    TScene.prototype.clear=function (){
            this.scene.clear()
    }
    // 修改场景中的雾及其颜色
    TScene.prototype.changeFog=function (color,instance){
        this.scene.fog=new Three.FogExp2(color,instance)
    }
    return TScene;
})();
export {TScene}