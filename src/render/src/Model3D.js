import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
// import {FBXLoader} from "./FBXLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import * as Three from "three";
// 模型不需要单例化，加载器可以单例化
/**
 * threejs 的OBJLoader 单例化
 * @type {function(): OBJLoader}
 */
let ThreeObjLoader = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new OBJLoader();
        }
        return instance;
    }
})();
let ThreeFBXLoader = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new FBXLoader();
        }
        return instance;
    }
})();
let ThreeStlLoader = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new STLLoader();
        }
        return instance;
    }
})();
let ThreeGltfLoader = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new GLTFLoader();
        }
        return instance;
    }
})();
let Model3d = (function(){
    let instance;
    let Model3d = function(  ){
        if ( instance ){
            return instance;
        }
        this.objLoader = new ThreeObjLoader();
        this.fbxLoader =new ThreeFBXLoader();
        this.stlLoader=new ThreeStlLoader();
        this.gltfLoader= new ThreeGltfLoader();
        this.loader=null;//当前加载模型的加载器
        return instance = this;
    };
    Model3d.prototype.getLoader=function (extension){
        const that=this
        //加载模型
        switch (extension) {
            case "obj"||"OBJ":
                that.loader=that.objLoader
                that.getObj = function (obj) {
                    // that.setMesh(obj, function (one) {
                    //     one.material.morphTargets = true;
                    //     one.material.morphNormals = true;
                    //     one.material.vertexColors =  Three.FaceColors;
                    //     one.material.shading = Three.SmoothShading;
                    // });
                    return obj;
                }
                break;
            case "stl":
                that.loader=that.stlLoader
                that.getObj = function (obj) {
                    var material;
                    material = new Three.MeshPhongMaterial({
                        color: new Three.Color(0xff5533),
                    });
                    var object = new Three.Mesh(obj, material);
                    var g = new Three.Group();
                    g.add(object);
                    that.model = g;
                    return g;
                }
                break;
            case "fbx":
                // console.log('fbx')
                that.loader=that.fbxLoader
                that.getObj = function (obj) {
                    that.model = obj;
                    return obj;
                };
                break;
            case 'gltf':
                that.loader=that.gltfLoader
                that.getObj = function (obj) {
                    that.model = obj;
                    return obj;
                };
                break;
        }
    }
    // 加载模型的函数，通过回调函数，可得到threejs内部回调的具体模型
    Model3d.prototype.loadModel = function (url, onL, onP) {
        const extension = url.split('.').pop().toLowerCase();
        this.getLoader(extension)
        const that=this
        if (that.loader==that.fbxLoader){
            that.loader.load(url , function (obj) {
            }, onP, function (e) {
                console.error(e);
            })
        }
        that.loader.load(url , function (obj) {
            let model = that.getObj(obj);// 将模型对象进行返回
            onL(model , extension);
            return model
        }, onP, function (e) {
            console.error(e);
        })
    }
    return Model3d;
})();

export {Model3d}

