// 单独渲染模型js
import * as THREE from "three";
import {RotControls} from "@/render/components/RotController";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Light } from "@/render/components/light";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {TextureUtil} from "@/render/components/texture";
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js';
import {defaultFog} from "@/utils/global";
import {base64ToFile} from "@/utils/imgUtils";
import * as fileApi from "@/api/file/file";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
const initObj = {};
const spritImg='../textures/label1.png'
let dom=null // 渲染的dom 控件
let path=null// 模型路径
let clock=null
let scene=null // threejs 场景
let camera=null // threejs camera
let model3d=null // threejs 模型
let controls=null // oribitControl控件
let rotControls=null //rotControl
let light=null // 场景灯光
let renderer=null // 渲染器
let modelLoader=null // 模型加载器
let modelShowId=null// 用于取消每帧渲染
let textureLoader=new THREE.TextureLoader() // 纹理加载器
let center=null;//模型中心
let textures=null;// 模型纹理
let wrapper=null;// 模型组
let fog=null;
let showBg=null;// 是否显示模型背景图
let mouse=null;// 鼠标点击事件
let note=null;// 模型注释内容
let raycaster =null; //射线类
export async function initDom(dom_,showBg_, modelId){
    initObj[Symbol.for(modelId)] = {
        dom: dom_,
        showBg: showBg_,
        path:null,// 模型路径
        clock:null,
        scene:null, // threejs 场景
        camera:null, // threejs camera
        model3d:null, // threejs 模型
        controls:null, // oribitControl控件
        rotControls:null, //rotControl
        light:null, // 场景灯光
        renderer:null, // 渲染器
        modelLoader:null, // 模型加载器
        modelShowId:null,// 用于取消每帧渲染
        center:null,//模型中心
        textures:null,// 模型纹理
        wrapper:null,// 模型组
        fog:null,
        mouse:null,// 鼠标点击事件
        note:null,// 模型注释内容
        raycaster :null, //射线类
        autoRotate:false,
        effect:null,//开启渲染vr双屏
        isVr:false,// 是否开启vr
        canvas:null,//画布对象
        defaultPosition:null,// 模型组初始位置，计算模型位置偏移量
        defaultRotation:null,//源旋转角
        gridVisible:false,//控制网格开关
        gridHelper:null,// 网格管理器
        objData:{// 模型基本信息管理
            position:new THREE.Vector3(),
            rotation:new THREE.Vector3(),
            scale:new THREE.Vector3(1,1,1)
        }
    };
    init(modelId);
}
// 通过模型id获取到渲染该模型的相关内容
function getById(modelId){
    return initObj[Symbol.for(modelId)]
}
// 获取注释
export function initNote(note_,modelType,modelId){
    note=note_
    if(modelType){
        getById(modelId).dom.addEventListener('dblclick',createDblclick(modelId), true);
    }else{
        initModelNote(modelId)
    }
}
function initModelNote(modelId){
    const that=getById(modelId)
    that. model3d.traverse(function (child) {
        if (child.isMesh) {
            const data={
                'label': '',
                'name': '', 'description': '', 'color': '', 'size': '', 'tag': null
            }
            data.label=child.name
            note.push(data)
        }})
}
// 初始化场景材质
export function initTextures(modelId){
    const that=getById(modelId)
    textures=new TextureUtil()
    // 场景贴图初始化
    textures.initMaterialPro()
    textures.addModel(-1,that.model3d)
    return textures
}

export function initLight(modelId,lightProperty){
    const that=getById(modelId)
    light=new Light(that.scene,getCameraPosition(modelId))
    // 给场景中加入初始的初始化灯
    if(lightProperty==null){
        light.initLight()
    }else{
        light.initLightByProperty(lightProperty)
    }
    return light
}
// url
function getSuffix(url){
	url+=""
	 return url.substring(url.lastIndexOf('.')+1)
}
 function init(modelId){
    const that=getById(modelId)
    that.raycaster = new THREE.Raycaster() //射线类
    that.clock = new THREE.Clock();
    that.camera = new THREE.PerspectiveCamera( 45,  that.dom.clientWidth / that.dom.clientHeight, 0.1, 2000 );
    that.scene = new THREE.Scene();
     // 创建渲染器
     if(showBg) {
        that.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
     }else{
        that.renderer = new THREE.WebGLRenderer({antialias: true,alpha:true, preserveDrawingBuffer: true});
     }
     that.renderer.setPixelRatio( window.devicePixelRatio );
     that.renderer.physicallyCorrectLights = true;
     that.renderer.setPixelRatio( window.devicePixelRatio * 2);
     that.renderer.setSize(window.innerWidth,window.innerHeight);
     that.renderer.gammaOutput = true;
     that.renderer.shadowMap.enabled = true;
     that.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
     that.renderer.toneMapping = THREE.ACESFilmicToneMapping;
     that.renderer.toneMappingExposure = 1.0;
    //  that.renderer.outputEncoding = THREE.sRGBEncoding;  
     THREE.ColorManagement.enabled = true;
     that.renderer.outputColorSpace = THREE.SRGBColorSpace;
     //初始化2d渲染器
     that.labelRenderer = new CSS3DRenderer();
     that.labelRenderer.setSize( that.dom.clientWidth, that.dom.clientHeight );
     that.labelRenderer.domElement.style.position = 'absolute';
     that.labelRenderer.domElement.style.top = '0px';
     that.dom.appendChild( that.labelRenderer.domElement );
     that.hotspotGroup=new THREE.Group();//创建css3d热点组
    
     //全景球设置
     that.geometry = new THREE.SphereGeometry( 500, 60, 40 );
     // invert the geometry on the x-axis so that all of the faces point inward
     that.geometry.scale( - 1, 1, 1 );
     that.texture = textureLoader.load(  );
     that.material = new THREE.MeshBasicMaterial( { map: that.texture } );
     that.mesh = new THREE.Mesh(  that.geometry,  that.material );
     that.mesh.visible=false
     that.scene.add( that.mesh );
     // threejs vr库
     that.effect = new StereoEffect( that.renderer );
     that.effect.setSize( that.dom.innerWidth, that.dom.innerHeight);
     that.dom.appendChild( that.renderer.domElement )
     that.canvas=that.dom.getElementsByTagName('canvas')[0]
     that.canvas.style.width=that.dom.innerWidth+'px'
     that.canvas.style.height=that.dom.innerHeight+'px'
     // 初始化控制器
     that.controls = new OrbitControls(that.camera, that.dom);
     that.controls.autoRotateSpeed = 0.25;
     that.controls.enableRotate=false
     that.mouse=new THREE.Vector2()
     // 初始化坐标格辅助对象
     that.gridHelper = new THREE.GridHelper( 300, 10 );
     that.gridHelper.visible=that.gridVisible
     that.scene.add( that.gridHelper );
     // 初始化雾
     if(that.showBg) {
        that.scene.background = textureLoader.load("../textures/background/background.jpg")
     }

 }
// =======================================================================
/**
 *
 * @param {*} flag 用于区分是主场景模型，还是素材模型 true 为主场景模型 false 为素材模型
 * @returns
 */
 export function loadModel(_path, modelId){
    const that=getById(modelId)
	return new Promise((resolve, reject) => {
        that.path=_path
        that.modelLoader=null;
        const loading=_path.loading
		const url=that.path.path+""
        that.texture=that.path.texture+""

		const suffix=_path.suffix
		const manager = new THREE.LoadingManager();
		function onProgress( xhr ) {
			if ( xhr.lengthComputable ) {
				let percentComplete = xhr.loaded / xhr.total * 100;
                loading.progress=percentComplete
                // 这里有问题，需要做小数位数限制
                // loading.progress = percentComplete == 100 ? 100 : (+percentComplete).toFixed(1);
			}
		}
		switch (suffix) {
			case "OBJ":
                that.modelLoader=new OBJLoader(manager);
				break;
            case "obj":
                that.modelLoader=new OBJLoader(manager);
                break;
			case "fbx":
                that.modelLoader=new FBXLoader(manager);
				break;
			case "glb":
                that.modelLoader= new GLTFLoader(manager)
				.setDRACOLoader( new DRACOLoader().setDecoderPath( 'draco/gltf/' ) )
				break;
            case "stl":
                that.modelLoader=new STLLoader(manager)
                break;    
			}
			if(suffix=="fbx"){
                that.modelLoader.load(url,function ( obj){
				})
			}
            if(that.modelLoader!=null) {
                if(suffix=='stl'){
                    that.modelLoader.load(url, function ( geometry ) {

                        const material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
                        const mesh = new THREE.Mesh( geometry, material );
                        that.model3d = mesh;
                        loadComplete(modelId,loading)
                        if(that.model3d.children.length>1){
                            resolve(false)
                         }else{
                            resolve(true)
                         }
                    });
                }else{
                    that.modelLoader.load(url, function (obj) {
                        if (suffix == 'glb') {
                            that.model3d = obj.scene;
                        } else {
                            that.model3d = obj;
                        }
                        loadComplete(modelId,loading)
                        if(that.model3d.children.length>1){
                            resolve(false)
                         }else{
                            resolve(true)
                         }
                    }, onProgress)
                }
                 
            
            }else{
                center=new THREE.Vector3();
                resolve("error")
            }
	});

}
// 模型加载完成函数
function loadComplete(modelId,loading){
    const that=getById(modelId)
    const box = new THREE.Box3().setFromObject(that.model3d);
    that.center = box.getCenter(new THREE.Vector3());
    that.wrapper=changePivot(that.center.x,that.center.y,that.center.z,that.model3d)
    that.wrapper.add(that.hotspotGroup)
    that.scene.add(that.wrapper)
    that.rotControls=new RotControls(that.dom)
    that.rotControls.enabledPan=false;
    that.rotControls.enabledZoom=false;
    that.rotControls.attach(that.wrapper)
    if ((that.texture != undefined) && (that.texture != null)&& (that.texture != "null")) {
        let Texture = textureLoader.load(that.texture);
        if (Texture) {
            that.model3d.traverse(function (child) {
                if (child.isMesh) {
                    child.material.map = Texture
                    child.material.map.colorSpace=THREE.SRGBColorSpace
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map.anisotropy = 1;
                    child.material.needsUpdate =true
                }
            })
        }
    }
    changeCamera(modelId)
    that.defaultPosition=that.wrapper.position.clone()
    that.defaultRotation=that.wrapper.rotation.clone()
    render(modelId)();
    loading.flag=false


}
export function resetCamera(modelId){
    const that=getById(modelId)
    that.controls.reset()
    that.wrapper.rotation.copy(that.defaultRotation)
}

export function changeCamera(modelId){
    const that=getById(modelId)
    const camera=that.camera
    const controls=that.controls
    const wrapper=that.wrapper
    const boxHelper = new THREE.BoxHelper();
    boxHelper.setFromObject(wrapper);
    var sceneBox = new THREE.Box3().setFromObject(wrapper);
    var tsize = sceneBox.getSize(new THREE.Vector3());
    const center = boxHelper.geometry.boundingSphere.center;
    const max= Math.max(Math.max(tsize.x,tsize.y),tsize.z)
    const positionZ=(max / (2 * Math.tan(camera.fov * Math.PI / 360)))*2
    const cameraPos = new THREE.Vector3(center.x,center.y,positionZ+center.z );
    const lookPos=center.clone()
    camera.position.copy(cameraPos.clone());
    controls.enableZoom = true;
    controls.target.copy(lookPos)
    controls.minDistance = controls.getDistance()/4;
    controls.maxDistance = controls.getDistance() * 4;
    camera.near = max * 0.1//最好和相机位置或者说包围盒关联，别设置0.1 1之类看似小的值
    camera.far = max * 300//根据相机位置和包围大小设置，把包围盒包含进去即可，宁可把偏大，不可偏小
    camera.updateProjectionMatrix()//渲染范围改变，注意更新投影矩阵
    controls.update ()
    controls.saveState () 

}
function changePivot(x,y,z,obj){
    let wrapper = new THREE.Object3D();
    wrapper.position.set(x,y,z);
    wrapper.add(obj);
    obj.position.set(-x,-y,-z);
    return wrapper;
}
 function render(modelId){
    return function () {
        const that=getById(modelId)
        if(that.isVr){
            that.effect.render(that.scene,that.camera);
        }else {
            if (that.renderer != null) {
                that.renderer.setViewport(0,0,that.dom.offsetWidth,that.dom.offsetHeight)
                that.renderer.render(that.scene, that.camera);
            }
        }
        // 渲染标签
        that.labelRenderer.render(that.scene,that.camera)
        if(that.autoRotate){
            that.wrapper.rotateOnWorldAxis (new THREE.Vector3(0,1,0) ,0.01)
            // if(that.hotspotGroup.children.length>0){
            //     // 让每个热点跟随旋转
            //     for(let i = 0;i<that.hotspotGroup.children.length;i++){
            //         // console.log(i)
            //         console.log('rotate')
            //         that.hotspotGroup.children[i].rotateOnWorldAxis (new THREE.Vector3(0,1,0) ,0.01)
            //     }
            // }
        }
        modelShowId=window.requestAnimationFrame(render(modelId));
    }
}
// =================================================================================================
export function onDomResize(modelId,width,height) {
        const that=getById(modelId)
        that.canvas.style.width=width+'px'
        that.canvas.style.height=height+'px'
        that.camera.aspect = width /height;
        that.camera.updateProjectionMatrix();
        that.renderer.setSize(width, height);
        that.labelRenderer.setSize(width,height);
}
/**
 * 修改模型位置信息
 * @param e
 */
export function objChange(modelId,e){
    const that=getById(modelId)
    let sub=new THREE.Vector3(e.position.x,e.position.y,e.position.z).clone().sub(that.defaultPosition.clone())
    let model3dPosition=(that.defaultPosition.clone().multiplyScalar(-1).clone()).add(sub)
    that.wrapper.position.copy(new THREE.Vector3(e.position.x,e.position.y,e.position.z))
    that.model3d.position.copy(model3dPosition.clone() )
    that.wrapper.rotation.copy(new THREE.Euler(e.rotation.x,e.rotation.y,e.rotation.z))
    that.wrapper.scale.copy(new THREE.Vector3(e.scale.x,e.scale.y,e.scale.z))
}
export function cameraChange(modelId,e){
    const that=getById(modelId)
    that.camera.fov=e.fov
}
export function fogChange(modelId,e){
    const that=getById(modelId)
    that.scene.fog = new THREE.FogExp2( e.color, 0.00025 );
}

export function getCameraPosition(modelId){
    const that=getById(modelId)
    return that.camera.position.clone()
}
// 是否开启物理灯光
export function showPhysicalLight(flag,modelId){
    const that=getById(modelId)
    that.renderer.physicallyCorrectLights=!flag
}
export function destory(modelId){
    // 清空模型
    const that=getById(modelId)
    removeModel(null, that.scene)
    if( that.scene.background!=null) {
        that.scene.background.dispose()
    }
    that.renderer.dispose();
    that.renderer.forceContextLoss();
    that.renderer.renderLists.dispose();
    that.dom.removeChild(that.renderer.domElement)
    that.renderer.domElement = null;
    THREE.Cache.clear();
    that.controls.dispose ()
    that.scene.clear();
    // 这行有问题，移除事件失败
    // that.dom.removeEventListener('dblclick',addNote(modelId),true);
    that.dom.removeEventListener('dblclick',that.dblclick,true);
    // wrapper.clear()
    //这些都是页面里我写的全局变量，释放一下内存
    //停止requestAnimationFrame
    cancelAnimationFrame(modelShowId)

    modelShowId = null
}
function removeModel(parent,child){
    if(child.children.length){
        let arr  = child.children.filter(x=>x);
        arr.forEach(a=>{
            removeModel(child,a)
        })
    }
    if(child instanceof THREE.Mesh||child instanceof THREE.Line){
        if(child.material.map) child.material.map.dispose();
        child.material.dispose();
        child.geometry.dispose();
    }else if(child.material){
        child.material.dispose();
    }else if(child.isLight){
        child.dispose()
    }
    child.remove();
    if(parent) {
        parent.remove(child);
    }
}
// 标签相关
// 模型双击事件
function createDblclick(modelId) {
    const that=getById(modelId)
    that.dblclick = addNote.bind(this, modelId);
    return that.dblclick;
}
//添加label模板
function addNote(modelId,event){
      const that=getById(modelId)
    const mainCanvas=that.dom.getElementsByTagName('canvas')[0]
    that.mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1// 标准设备横坐标
    that.mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1// 标准设备纵坐标
    that.raycaster.setFromCamera(that.mouse, that.camera);
    let intersects = []
	intersects =that.raycaster.intersectObject(that.model3d, true)
    if(intersects.length>0){
        const data={
            'thumb':null,
            'title':'',
            'content':'',
            'sort':0,
            'position':intersects[0].point
        }
        console.log('intersect')
        console.log(intersects)
        const formData=base64ToFile(mainCanvas.toDataURL(),Date.now().toString())
        fileApi.uploadFile('image', formData)
            .then(res => {
                data.thumb=res.data.filename
            })
        note.push(data)
         // 创建热点内容
       const hotspot = document.createElement("div")
       hotspot.className = "hot-div"//在index.scss中
   
       console.log('div')
       console.log(hotspot)
    //    hotspot.style="backface-visibility: hidden;"
       const hotspotLabel = new CSS3DObject(hotspot)
       let position=intersects[0].point.clone()
       let qua=that.model3d.getWorldQuaternion(new THREE.Quaternion())
       hotspotLabel.position.copy(position.clone().sub(that.center).clone().applyQuaternion(qua.clone().invert()))
       that.hotspotGroup.add(hotspotLabel)
    }
   
}
// 修改标签内容
export function changeNoteItem(item,index,modelId){
    const that=getById(modelId);
    const hotspotLabel=that.hotspotGroup.children[index]
    hotspotLabel.element.setAttribute('data-after',item.content)
}
// 删除标注
export function delNote(index,modelId){
    const that=getById(modelId);
    that.hotspotGroup.remove(that.hotspotGroup.children[index])
}
export function changeBg(type,path,modelId){
    console.log('change bg:'+modelId)
    const that=getById(modelId)
    let texture=that.scene.background
    texture.dispose()
    console.log('type:'+type)
    if(type==0){
        console.log('that mesh')
        console.log(that.mesh)
        that.rotControls.attachBg(that.mesh)
        that.mesh.visible=true
        that.mesh.material.map.dispose()
        that.mesh.material.map=textureLoader.load(path) 
    }else{
        that.mesh.visible=false
        that.scene.background=textureLoader.load(path)
    }
}
function getThumb(){
    const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      container.appendChild(canvas)
      const dataurl = canvas.toDataURL("image/png")
      const arr = dataurl.split(',')
       const mime = arr[0].match(/:(.*?);/)[1]
          const bstr = atob(arr[1])
              let n = bstr.length
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.videoFaceFile = new File([u8arr], 'caputure.png', {type: mime});

      const that=this
      canvas.toBlob(function (blobObj) {
          that.videoFace = window.URL.createObjectURL(blobObj)
      })
}
export function  changeAutoRotate(modelId,rotateFlag){
    const that=getById(modelId)
    that.autoRotate=rotateFlag
}
// 控制网格开关
export function gridChange(modelId,gridFlag){
    const that=getById(modelId)
    that.gridVisible=!gridFlag
    that.gridHelper.visible=!gridFlag
}
export function changeVr(modelId,vrFlag){
    const that=getById(modelId)
    that.isVr=vrFlag
}
// 获取模型的基本信息
export function getData(modelId){
    const that=getById(modelId)
    that.objData.position=that.wrapper.position.clone()
    let rotation=that.wrapper.rotation.clone()
    that.objData.rotation=new THREE.Vector3(rotation.x,rotation.y,rotation.z)
    that.objData.scale=that.wrapper.scale.clone()
    return that.objData
}