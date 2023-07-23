import * as Three from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {RotControls} from "@/render/src/RotController";

let ModelControls = (function(){
    let instance;
    let ModelControls = function(camera,dom){
        if ( instance ){
            instance.controls = new OrbitControls(camera,dom);
            instance.rotControls = new RotControls(dom)
            return instance;
        }
        this.controls = new OrbitControls(camera,dom);
        this.rotControls = new RotControls(dom)
        return instance = this;
    };
    ModelControls.prototype.addModel=function (model){
        this.rotControls.attach(model)
    }
    /**
     * 根据相机的放大与缩小倍数设置控制器的放大与缩小倍数
     * @param camera
     */
    ModelControls.prototype.setSize=function (camera){

    }

    ModelControls.prototype.getOrbitControls=function (){
        return this.controls
    }

    // 配置普通模型的控制器
    ModelControls.prototype.initModelControls=function (){
        this.controls.enableRotate=false
        this.controls.enableDamping=true
        this.controls.enablePan=true
        this.rotControls.enabledRotate=true
        this.rotControls.enabledPan=false
        this.rotControls.enabledZoom=false
    }
    // 配置vr全景控制器
    ModelControls.prototype.initVrModelControls=function (){
        this.controls.enableRotate=true
        this.controls.enableDamping=false
        this.controls.enablePan=false
        this.controls.enableZoom=false
        this.rotControls.enabledRotate=false
        this.rotControls.enabledPan=false
        this.rotControls.enabledZoom=false
        this.rotControls.removeEventListener()
    }
    ModelControls.prototype.dispose=function (){
        this.controls.dispose()
        this.controls=null
        this.rotControls.removeEventListener()
        this.rotControls=null
    }
    return ModelControls;
})();

//

export {ModelControls}