import * as Three from "three";

/**
 * 单例的threejs 的group 对象，表明现在渲染的模型对象组
 */
let ThreeGroup = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.Group();
        }
        return instance;
    }
})();
let ModelGroup = (function(){
    let instance;
    let ModelGroup = function(  ){
        if ( instance ){
            return instance;
        }
        this.group = new ThreeGroup();
        return instance = this;
    };
    ModelGroup.prototype.getGroup=function (){
        return this.group
    }
    ModelGroup.prototype.clear=function (){
        this.group.clear()
    }
    ModelGroup.prototype.add=function (object){
        if ( object && object.isObject3D ) {
            this.group.add(object)
        }
    }
    return ModelGroup;
})();
export {ModelGroup}