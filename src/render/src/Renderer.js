/**
 * 封装threejs的渲染器
 */
/**
 * 使用带透明度的模型渲染器，原乐乐三维云首页使用的即该渲染器
 */
import * as Three from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {renderType} from "@/utils/global";
let ThreeAlphaRender = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.WebGLRenderer({
                antialias: true,//是否执行抗锯齿。默认为false.
                alpha: true,//canvas是否包含alpha (透明度)。默认为 false
                preserveDrawingBuffer:true,// 保存当前渲染的快照，需要设置缓冲区
                logarithmicDepthBuffer:true// 一些闪烁问题，是否使用对数深度缓存。
            });
        }
        return instance;
    }
})();
/**
 * 普通渲染模型的渲染器
 * @type {function(): WebGLRenderer}
 */
let ThreeWebGLRender = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.WebGLRenderer({
                antialias: true,//是否执行抗锯齿。默认为false.
                preserveDrawingBuffer:true,// 保存当前渲染的快照，需要设置缓冲区
                logarithmicDepthBuffer:true// 一些闪烁问题，是否使用对数深度缓存。
            });
        }
        return instance;
    }
})();
/**
 * css2d 渲染器，渲染html标签
 * @type {function(): CSS2DRenderer}
 */
let ThreeCSS2DRenderer= (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new CSS2DRenderer();
        }
        return instance;
    }
})();
let Renderer = (function(){
    let instance;
    let Renderer = function(){
        if ( instance ){
            return instance;
        }
        this.alphaRender = new ThreeAlphaRender();
        this.webglRender=new ThreeWebGLRender();
        this.css2dRender=new ThreeCSS2DRenderer();
        return instance = this;
    };
    /**
     * 通过类型返回渲染器
     * @param type
     * @param width
     * @param height
     */
    Renderer.prototype.getRenderer=function (type,width,height){
        if (type==renderType.alpha){
            this.alphaRender.setSize(width,height)
            this.alphaRender.setPixelRatio(window.devicePixelRatio)
            return this.alphaRender
        }else if(type==renderType.webgl){
            this.webglRender.setSize(width,height)
            this.webglRender.setPixelRatio(window.devicePixelRatio)
            this.webglRender.autoClear = true;
            return this.webglRender
        }else if (type==renderType.css){
            this.css2dRender.setSize(width,height)
            // this.css2dRender.setPixelRatio(window.devicePixelRatio)
            return this.css2dRender
        }
    }
    Renderer.prototype.render=function (type,scene,camera) {
        if (type==renderType.alpha){
            this.alphaRender.render(scene,camera)
        }else if(type==renderType.webgl){
            this.webglRender.render(scene,camera)
        }else if (type==renderType.css){
            this.css2dRender.render(scene,camera)
        }
    }
    Renderer.prototype.setSize=function (type,width,height){
        if (type==renderType.alpha){
            this.alphaRender.setSize(width,height)
        }else if(type==renderType.webgl){
            this.webglRender.setSize(width,height)
        }else if (type==renderType.css){
            this.css2dRender.setSize(width,height)
        }
    }
    return Renderer;
})();
export {Renderer};