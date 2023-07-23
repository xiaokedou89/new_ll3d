// 单独渲染模型js
import * as THREE from "three";
import {RotControls} from "@/render/components/RotController";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Light } from "@/render/components/light";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
    filePrefix,
    modelUrl
} from "@/utils/global.js";
let dom=null // 渲染的dom 控件
let path=null// 模型路径
let clock=null
let scene=null // threejs 场景
let camera=null // threejs camera
let model3d=null // threejs 模型
let wrapper=null
let controls=null // oribitControl控件
let rotControls=null //rotControl
let light=null // 场景灯光
let renderer=null // 渲染器
let modelLoader=null // 模型加载器
let modelShowId=null// 用于取消每帧渲染
let textureLoader=null // 纹理加载器
let loading=null
export async function initDom(dom_,loading_){
    dom=dom_
    loading=loading_
    // console.log(loading)
    init()
}
// url
function getSuffix(url){
	url+=""
	 return url.substring(url.lastIndexOf('.')+1)
}
 function init(){
        clock = new THREE.Clock();
        textureLoader=new THREE.TextureLoader()
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000000 );
		scene = new THREE.Scene();
        scene.background=textureLoader.load('./background.jpg')
        scene.clear()
    	// 创建环境贴图
		scene.environment = new RGBELoader().load( 'textures/equirectangular/royal_esplanade_1k.hdr' );
		scene.environment.mapping = THREE.EquirectangularReflectionMapping;
		// 创建渲染器
	    renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		// 要产生灯光阴影，需将该属性设为true
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		renderer.outputEncoding = THREE.sRGBEncoding;
		dom.appendChild( renderer.domElement )
        // 初始化控制器
        controls = new OrbitControls(camera, dom);
        controls.autoRotateSpeed = 0.25;
        controls.enableRotate=false
		// 添加滚轮事件
		window.addEventListener( 'resize', onWindowResize );
}
// =======================================================================
/**
 *
 * @param {*} flag 用于区分是主场景模型，还是素材模型 true 为主场景模型 false 为素材模型
 * @returns
 */
 export function loadModel(_path){

	return new Promise((resolve, reject) => {
        path=_path
        if(wrapper!=null){
            scene.remove(wrapper)
            loading.flag=true
            loading.progress=0
            wrapper.clear()
            wrapper=null
        }
		modelLoader=null;
		const url=filePrefix + modelUrl+_path.path+""
        const texture=null

		const suffix=getSuffix(url)
        // console.log('suffix:'+suffix+" "+_path.path)
		let length=0;// 计算子模型长度
		const manager = new THREE.LoadingManager();
		function onProgress( xhr ) {
			if ( xhr.lengthComputable ) {
				const percentComplete = xhr.loaded / xhr.total * 100;
                loading.progress=percentComplete
                // console.log(percentComplete)
			}
		}
		switch (suffix) {
			case "OBJ":
				modelLoader=new OBJLoader(manager);
				break;
            case "obj":
                modelLoader=new OBJLoader(manager);
                break;
			case "fbx":
				modelLoader=new FBXLoader(manager);
				break;
			case "glb":
				modelLoader= new GLTFLoader(manager)
				.setDRACOLoader( new DRACOLoader().setDecoderPath( 'draco/gltf/' ) )
				break;
			}
			if(suffix=="fbx"){
				modelLoader.load(url,function ( obj){
				})
			}
            // console.log(url)
			modelLoader.load(url,function ( obj){
				if(suffix=='glb'){
						model3d=obj.scene;

                        resolve(obj.scene)
				}else{
						model3d=obj;
                        resolve(obj)
				}
                model3d.traverse( function ( object ) {

                    if ( object.isMesh ) object.castShadow = true;

                } );
                var box = new THREE.Box3().setFromObject(model3d);
                var center = box.getCenter(new THREE.Vector3());
                wrapper=changePivot(center.x,center.y,center.z,model3d)
                scene.add(wrapper)
                rotControls=new RotControls(dom)
                rotControls.enabledPan=false;
                rotControls.enabledZoom=false;
                rotControls.attach(wrapper)

                // model3d.position.set(-center.x, -center.y, -center.z);
                //当前被编辑的模型
                if(light==null||scene.children.length<2){
                    light = new Light(scene,center)
                    light.initLight()
                }
                if((texture!=undefined) &&( texture!=null)){
                    // console.log('执行')
                    let Texture = textureLoader.load(texture);
                    if (Texture) {
                        obj.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.map = Texture
                                // import 重要有可能是因为此处模型无贴图
                                child.material.emissive = child.material.color;
                                child.material.emissiveMap = child.material.map;
                            }})
                    }
                }
                // console.log(light)
                // console.log(scene)
                //设置相机的初始位置 和控制器的一些参数
                changeCamera()

			},onProgress )
	});

}
function changeCamera(){
    const boxHelper = new THREE.BoxHelper();
    boxHelper.setFromObject(wrapper);
    const center = boxHelper.geometry.boundingSphere.center;
    const radius = boxHelper.geometry.boundingSphere.radius;
    const cameraPos = new THREE.Vector3(center.x+wrapper.position.x,center.y,radius * 2.2  + center.z + wrapper.position.z);
    const lookPos = new THREE.Vector3(center.x+wrapper.position.x,center.y,center.z+wrapper.position.z);
    camera.position.copy(cameraPos);
    // console.log(cameraPos)
    controls.minDistance = cameraPos.z / 4;
    controls.maxDistance = cameraPos.z * 4;
    controls.enableZoom = true;
    controls.target = lookPos;
    camera.lookAt(lookPos);
}
function changePivot(x,y,z,obj){
    let wrapper = new THREE.Object3D();
    // console.log("x:"+x+"y:"+y+"z："+z)
    wrapper.position.set(x,y,z);
    wrapper.add(obj);
    obj.position.set(-x,-y,-z);
    return wrapper;
}

export function render(){
    if(renderer!=null){
        renderer.render( scene, camera );
    }
    modelShowId=window.requestAnimationFrame(render);
}
// =================================================================================================
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}
