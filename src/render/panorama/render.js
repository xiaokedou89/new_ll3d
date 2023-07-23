import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {newTrimesh} from '@/render/components/physicsUtils'
import  PlayerControls from '@/render/player/PlayerControls.js'
import TWEEN from 'tween.js'
import {Ammo} from "@/render/ammo/AmmoHelper"
import { Light } from "@/render/components/light";
import Input from '@/render/components/Input'
import * as modelShowApi from "@/render/components/show"
import {TextureUtil} from "@/render/components/texture";
import {TransformControls} from "@/render/components/TransformControls";
import {
    imgMaterial,
    videoMaterial,
    modelMaterial,
    filePrefix,
    modelUrl,
    image,
    defaultVector3,
	iconMaterial
} from "@/utils/global.js";
import { Camera, NormalAnimationBlendMode, TextureLoader } from "three";
// import * as ammo from "./ammo/ammo.js"
// import * as ammo from '../assets/ammo.js'
let camera, scene, renderer, controls, mixer;
let lastFrameTime=null;
let animFrameId=0;
let dom=null;// 渲染页面的dom元素，
let path=null; // 渲染模型的url,模型url 贴图
let world=null;// 物理引擎世界
let solver=null;
let collisionConfiguration=null;
let dispatcher=null;
let broadphase=null;
let modelLoader=null;// 模型加载器
let model3d=null;// 模型场景
let box=new THREE.Box3();// 场景的大小
let tmpBox=new THREE.Box3();// 临时计算素材的box
let center=new THREE.Vector3();//场景中心点
let clock=new THREE.Clock()
let param=null;// 初始化参数
let playerControls=null// 人称控制器
let light=null// 灯光控制器
let textures=null //材质控制
let raycaster = new THREE.Raycaster() //射线类
let mouse = new THREE.Vector2()//鼠标位置
let imgDom=null // 创建一个播放图片的dom元素，用于在视频上的播放与暂停
let videoCanvas = null
let imgCanvas = null
let transformControl=null
let far=2000// 相机远视角
let scale=0// 主场景缩放比例
let min=0// 模型最短边,用于计算素材缩放比例
let materialObj=null// 正在编辑的素材
let boxHelper=null //素材编辑红框
let editor=null// 目前的编辑状态
let editor_bak=null// 真实的编辑状态
let materialGroup=new THREE.Group() //编辑器中加入的素材
let sceneGroup=null // 保存后的灯光、素材、材质
let textureLoader=null // 材质加载器
function initParam(){
	param=null
	sceneGroup=null
	imgDom=null
	videoCanvas=null
	imgCanvas=null
	dom=null
	path=null
}
export async function initDom(dom_,path_,param_){
	initParam()
	imgDom=document.createElement('img') // 创建一个播放图片的dom元素，用于在视频上的播放与暂停
	imgDom.src='/textures/play.png'
	imgDom.crossOrigin="anonymous"
	 videoCanvas = document.createElement('canvas')
 	imgCanvas = document.createElement('canvas')
    dom=dom_
	path=path_
	param=param_
	materialGroup.clear()
	sceneGroup=param_.sceneGroup
	textureLoader=new THREE.TextureLoader()
	let res = await init() //初始化threejs 场景、渲染器
	dom.addEventListener('mousedown',onmousedown,false)
	window.addEventListener('keydown',onkeydown,false)
	editor=JSON.parse(param.flag)
	editor_bak=JSON.parse(param.flag)
	// console.log('init dom')
	//modelShowApi.initDom(param.modelShow,param.loading)
	return res
}

function onkeydown(event){

	if(materialObj==null||transformControl==null){
		return
	}
	if (event.key ==='1'||event.key==='2'||event.key==='3'){
		if(transformControl!=null &&materialObj!=null)
		changeControlShow(true)
		dom.removeEventListener('mousemove', changeMaterialLookAt, {passive: false})
	}

	switch(event.key){
		case '1':
			changeControlShow(true)
			transformControl.setMode('translate')
			transformControl.attach(materialObj)
			break;
		case '2':
			changeControlShow(true)
			transformControl.setMode('rotate')
			transformControl.attach(materialObj)
			break;
		case '3':
			changeControlShow(true)
			transformControl.setMode('scale')
			transformControl.attach(materialObj)
			break;
		case 'Escape':
			if (editor&&materialObj!=null) { //对素材进行旋转
				materialObj = null
				// 如果有使用tranformControl要对其进行关闭处理,x,y,z 均不显示
				changeControlShow(false)
				boxHelper.visible=false
			}
			break;
	}
}
async function  onmousedown(event){
	// if(event.button!=2){
	// 	return
	// }
	if(editor) { // 只有是编辑状态才能对素材进行操作,使用editor变量,这样即使全屏也不能更改模型位置
        if (event.button === 2) {// 如果是右键是用于放置素材的操作
            if (!materialObj) { //第一次摁住右键此时的操作是用来选择要更改的素材
                const obj = getRayObjAndNormal(materialGroup, event)
				if(obj==null){
					return
				}
				const model=obj.model
                if(model!=null){
                    if (model.name === "img" || model.name === "video" ) {
                        materialObj = model
                    }
                    else if (model.name==="model"){
						materialObj= getModel(model)
                    }else{
						return
					}
					// console.log('materiObj')
					// console.log(materialObj)
                    boxHelper=new THREE.BoxHelper(materialObj,0xff0000)
                    scene.add(boxHelper)
					dom.addEventListener('mousemove', changeMaterialLookAt, {passive: false})
				}
                // changeMaterialLookAt = this.changeMaterialLookAt.bind(this)
                // this.dom.addEventListener('mousemove', changeMaterialLookAt, {passive: false})
            }else {
                //第二次摁住右键此时的操作是用来放置素材的
				var obj = getRayObjAndNormal(model3d, event)
				if(obj==null) return
                var model = obj.model
                if(model!=null){
					if (transformControl.object === materialObj){
						transformControl.detach(materialObj)
						changeControlShow(false)
					}
                   materialObj.position.copy(obj.point.add(obj.normal.normalize().multiplyScalar(0.1)))
				   let lookat=new THREE.Vector3().copy(materialObj.position).add(obj.normal.normalize().multiplyScalar(0.1))
                   materialObj.lookAt(lookat )
				   materialObj.lookat=obj.normal.clone().normalize()
				   materialObj = null
				   // 如果有使用tranformControl要对其进行关闭处理,x,y,z 均不显示


				   if(boxHelper!=null){
					   scene.remove(boxHelper)
					   boxHelper=null
				   }
                   boxHelper=null
                   dom.removeEventListener('mousemove', changeMaterialLookAt, {passive: false})
                }
            }
        }
		else{ //点击的是左键

			//判断是否要更改素材
			const material=param.material
			// 点击左键是为了修改材质
			if((material.materialSelectType==0)&&(material.tabFlag)&&(material.asideFlag) ){
				const obj = getRayObjAndNormal(model3d, event)
				if(obj!=null){
				 // 让选中的模型闪烁两秒
				 let color=new THREE.Color().clone(obj.model.material.Color)
				 obj.model.material.color= new THREE.Color( 0xff0000 );
				 function changColor(){
					if(color!=null){
						obj.model.material.color=color
					}else{
						obj.model.material.color=null
					}
				 }
				 setTimeout(changColor, 2000);
				 textures.addModel(obj.model.index,obj.model)
				}
			}

    }
	}
	else{// 是为了播放视频
			const obj = getRayObjAndNormal(materialGroup, event)
			if(obj==null){
				return
			}
			const model=obj.model
			if(model!=null){
				if ((!editor) &&(model.name === "video") ) {
					const video = obj.model.material.base.image;
					if (video.paused) {
						obj.model.material.map = obj.model.material.base
						video.play();
					} else {
						const canvas = await composeCanvas(video, imgDom)
						obj.model.material.map = new THREE.CanvasTexture(canvas);
						video.pause();
					}
				}
				if ((!editor) &&(model.name === "model") ) {
					let modelDetail=getModel(model)
					// console.log('modelDetail-----')
					// console.log(modelDetail)
					param.modelShowFlag.show=true //显示模型的展示框
					let path={
						path:modelDetail.src.modelName,
						texture:modelDetail.src.mapName[0]
					}
					Input.ClearEventListners()
					modelShowApi.loadModel(path)
					modelShowApi.render()
				}
			}
	}

}
function changeName(model,name){
		if (model.children.length==0) {
			model.name=name
		  return;
		}
		for (let i = 0; i < model.children.length; i++) {
			model.name=name
		  changeName(model.children[i],name);
		}
}
export function getCenter(){
	return center
}
export function getSize(){
	return box
}
export function toMaterial(index){
	const child = materialGroup.children[index]
	if(child!=null){
		changeAnnoattion(child)
	}
}
export function changeEditor(flag){
	editor=flag
	if(editor_bak&&(!flag)){// 编辑状态下的预览
		// for(let i=0;i<materialGroup.children.length;i++){
		// 	initAmmoChild(materialGroup.children[i])
		// }
	}
	if(editor_bak&&(flag)){//编辑状态下退出预览
		for(let i=0;i<materialGroup.children.length;i++){
			world.removeRigidBody(materialGroup.children[i].body)
			materialGroup.children[i].body=null
		}
	}
}
function changeAnnoattion(obj){
	// 在素材要到的位置上创建刚体，刚体下落后，相机移动到要刚体下落的位置
	// if(playerControls.physicsBody==null){
	// 	return
	// }
	// 得到模型的中心点位置
	const tmpBox=new THREE.Box3()
	tmpBox.setFromObject(obj)
	var tsize = tmpBox.getSize(new THREE.Vector3());
    var val = tsize.y;
    if (val < tsize.x) {
            val = tsize.x;
    }
    if (val < tsize.z) {
        val = tsize.z;
    }
    const normal= (val / (2 * Math.tan(camera.fov * Math.PI / 360))) ;
	let position1=new THREE.Vector3()
	tmpBox.getCenter(position1)
	position1.add(obj.lookat.clone().multiplyScalar(normal))
	// position1.y=camera.position.clone().y
	let lookat=new THREE.Vector3()
	tmpBox.getCenter(lookat)
	let positon_bak=camera.position.clone()// 备份相机位置
	world.setGravity( new Ammo.btVector3( 0.0, 0.0, 0.0 ) );
	playerControls.flag=true
	// if(playerControls.physicsBody!=null){

	// 	world.removeRigidBody(playerControls.physicsBody)
	// 	playerControls.physicsBody=null
	// 	playerControls.parent.body=null
	// 	scene.remove(playerControls.parent)
	// 	playerControls.parent=null
	// }
	 camera.position.y=position1.y
    var tween1 = new TWEEN.Tween(camera.position).to({
        x: position1.x,
          y:position1.y,
        z: position1.z
    }, 1800).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
		 camera.lookAt(lookat)
		//  camera.rotation.z=0
		//  console.log(camera.up)
    }).onComplete(function () {
		  camera.lookAt(lookat)
		// 更新刚体物体位置
		let position=camera.position.clone()
		position.y-=0.5
		playerControls.temoPosition=position.clone()
		playerControls.tempQuaternion=camera.quaternion.clone()
		//playerControls.changePhysics(position.clone(),camera.quaternion.clone())
		 camera.lookAt(lookat)
    }).start()
}9
// 初始化场景灯光
export function initLight(){
	light=new Light(scene,center)
	// 给场景中加入初始的初始化灯
	if(sceneGroup==null||sceneGroup.light==null){
		light.initLight()
	}else{
		light.initLightByProperty(sceneGroup.light)
	}
	return light
}
// 初始化场景材质
export function initTextures(){
	textures=new TextureUtil()
	// 场景贴图初始化
	if(sceneGroup==null||sceneGroup.textures==null){
		textures.initMaterialPro()
	}else{
		textures.initTexturesByProperty(model3d,sceneGroup.textures)
	}
	textures.addModel(0,model3d)
	return textures
}
// url
function getSuffix(url){
	url+=""
	 return url.substring(url.lastIndexOf('.')+1)
}
// 获取到box的最长边
function getMax(box){
	const x=box.max.x-box.min.x
	const y=box.max.y-box.min.y
	const z=box.max.z-box.min.z
	return Math.max(x,y,z)
}
function getMin(box){
	const x=box.max.x-box.min.x
	const y=box.max.y-box.min.y
	const z=box.max.z-box.min.z
	return Math.min(x,y,z)
}
/**
 * 是否正在编辑素材
 */
export function isEditor(){
	if(materialObj==null){
		return false
	}else{
		return true
	}
}

/**
 * 通过mesh 得到最上级名称为model的对象
 * @param mesh
 */
 function getModel(mesh){
    if(mesh.parent.name!="model") {
        return mesh
    }
    else{
        return getModel(mesh.parent)
    }
}
export function removeObj(index) {
    const child = materialGroup.children[index]
    if (child.isMesh) {
        if (child.name === "video") {
            let video = child.material.base.image
            video.pause()
            video = null
        }
        child.geometry.dispose();
        child.material.dispose();
    }
    else if ((child instanceof THREE.Group) === true) {
        child.traverse(function (c) {
            if (c.isMesh) {
				// 如果材质是material对象,直接处理
				if(c.material.isMaterial){
					c.material.dispose();
				}
				// 如果material 为数组对象
				if(c.material.length>0){
					for(let i=0;i<c.material.length;i++){
						c.material[i].dispose()
					}
				}
                c.geometry.dispose();
            }
        })
    }
    materialGroup.remove(child);
    if (editor) {
		// 在编辑状态下清除正在操作的模型
        if (transformControl.object === child){
			transformControl.detach();
			if(boxHelper!=null){
				scene.remove(boxHelper)
				boxHelper=null
			}
		}
    }
}
// =======================================================================
/**
 *
 * @param {*} flag 用于区分是主场景模型，还是素材模型 true 为主场景模型 false 为素材模型
 * @returns
 */
function loadModel(flag,_path){
	return new Promise((resolve, reject) => {
		modelLoader=null;
		// console.log('load model')
		const url=_path.path+""
		const texture=_path.texture+""
		const suffix=getSuffix(_path.path)
		// console.log(suffix)
		let length=0;// 计算子模型长度
		const manager = new THREE.LoadingManager();
		function onProgress( xhr ) {
			if ( flag&&xhr.lengthComputable ) {
				const percentComplete = xhr.loaded / xhr.total * 100;
				param.loading.progress=Math.round( percentComplete, 2 )-2
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
			modelLoader.load(url,function ( obj){
				if(suffix=='glb'){
					if(flag){
						model3d=obj.scene;
						box.setFromObject(obj.scene);
						center = box.getCenter(new THREE.Vector3());
						// 获取到最短边,用于计算素材的缩放比例
						min=getMin(box)
						scene.add(obj.scene)

					}else{
						// 素材场景
						obj.scene.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow=true
							}})
						resolve(obj.scene)
					}
				}else{
					if(flag){
						model3d=obj;
						box.setFromObject(obj);
						center = box.getCenter(new THREE.Vector3());
						obj.position.set(0-center.x,0-center.y,0-center.z)
						obj.scale.set(0.2,0.2,0.2)
						scene.add(obj)
					}
					else{
						obj.traverse(function (child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow=true
							}})
						resolve(obj)
					}

					if((texture!=undefined) &&( texture!=null)){
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
				}
				if(flag){
					loadMaterial()
					resolve('model is loaded')
				}
			},onProgress )
	});

}

function initAmmoChild(model){
	// if ((model instanceof THREE.Group) === true) {
	// 	model.traverse(function (child) {
	// 		if (child instanceof THREE.Mesh) {
	// 			child.receiveShadow=true
	// 			child.castShadow=true
	// 			child.body = newTrimesh(child, { mass: 0, restitution: 0.6 });
	// 			world.addRigidBody(child.body);
	// 		}
	// 	})
	// }else{
	// 	model.body = newTrimesh(model, { mass: 0, restitution: 0.6 });
	// 	world.addRigidBody(model.body);
	// }
	model.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			child.receiveShadow=true
			child.castShadow=true
			child.body = newTrimesh(child, { mass: 0, restitution: 0.6 });
			world.addRigidBody(child.body);
		}
	})


}
// 初始化ammo 物理引擎
async function initAmmo(){
	 collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
     dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
     broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    world = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    world.setGravity( new Ammo.btVector3( 0.0, -9.81, 0.0 ) );
    const fp = Ammo.addFunction(PhysicsUpdate);
    world.setInternalTickCallback(fp);
    world.getBroadphase().getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback());
	// 初始化物理子模型
	 initAmmoChild(model3d);
	playerControls=new PlayerControls(camera,center,world,scene)
	 // 添加红色方块刚体
	 animatePhysics()
}
// =================================================================================================
async function init() {
		clock = new THREE.Clock();
		camera = new THREE.PerspectiveCamera( 45, dom.offsetWidth / dom.offsetHeight, 0.1, far );
		camera.up=new THREE.Vector3(0,1,0)
		scene = new THREE.Scene();
		// 将素材组添加到场景中
		scene.add(materialGroup)
    	// 创建环境贴图
		scene.background = new THREE.Color( 0x333333 );
		scene.environment = new RGBELoader().load( 'textures/equirectangular/royal_esplanade_1k.hdr' );
		scene.environment.mapping = THREE.EquirectangularReflectionMapping;

		let res = await loadModel(true,path)
		// 创建渲染器
	    renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		// console.log(dom)
		renderer.setSize( dom.offsetWidth, dom.offsetHeight );
		// 要产生灯光阴影，需将该属性设为true
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		renderer.toneMappingExposure = 1;
		 renderer.outputEncoding = THREE.sRGBEncoding;
		// init transformControl
		transformControl=new TransformControls(camera, dom); //设置可移动物体的控制器
		changeControlShow(false)// 一开始不显示transformControl,键盘调用让其显示
		transformControl.addEventListener( 'objectChange', function ( event ) {
			if(boxHelper!=null){
				boxHelper.update()
			}

		} );
		scene.add(transformControl)
		renderer.domElement.style.width="100%";
		renderer.domElement.style.height = "100%";
		dom.appendChild( renderer.domElement )
		// 添加滚轮事件
		window.addEventListener( 'resize', onWindowResize );
		return res
 }
function changeMaterialLookAt(event){
    if (materialObj==null){
        return
    }
    var obj=getRayObjAndNormal(model3d,event)
	if(obj==null){
		return
	}
    var model=obj.model
    var point=obj.point
    if(model==null)
        return
    else {
        var nnormal=new THREE.Vector3().copy(obj.normal)
        var position=new THREE.Vector3().copy(point).add(nnormal.multiplyScalar(0.1))
        var lookat= new THREE.Vector3().copy(position).add(nnormal.multiplyScalar(0.1))
        materialObj.position.copy(position)
        materialObj.lookAt(lookat)
		materialObj.lookat=obj.normal.clone()
        boxHelper.update()
    }
}
// =================================================================================================
			function onWindowResize() {
				camera.aspect = dom.offsetWidth / dom.offsetHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( dom.offsetWidth, dom.offsetHeight );

			}
			// 在物体(碰撞体掉落在地面后,相机位于碰撞体位置上，开始渲染)
			function animatePhysics(){
				// 碰撞体还未掉落
				if(updatePhysicsCollision()){
					requestAnimationFrame(animatePhysics)
				}else{
					setTimeout(animFrameId = window.requestAnimationFrame(animateWorld), 2000)
					// 构建完物理世界后进度条隐藏
					param.loading.progress=100
				}
			}
			function updatePhysicsCollision(){
				let deltaTime = clock.getDelta();
				// Step world
				world.stepSimulation(deltaTime, 10);
				return detectCollision()
			}
			// 渲染场景 threejs
			function animateWorld(t) {
				if(lastFrameTime===null){
					lastFrameTime = t;
				  }
				  const delta = t-lastFrameTime;
				  let timeElapsed = Math.min(1.0 / 30.0, delta * 0.001);
				 if(world!=null&&delta!=0){
				 	Step(timeElapsed);
				 }
				 render()
				lastFrameTime = t;
				animFrameId = window.requestAnimationFrame(animateWorld);
				TWEEN.update()
			}
			function Step(elapsedTime){
				world.stepSimulation( elapsedTime, 10 );
				playerControls.Update(elapsedTime);
			  }
			function render() {
				renderer.render( scene, camera );
            }
			// 碰撞检测函数
			function detectCollision(){
				let dispatcher = world.getDispatcher();
				let numManifolds = dispatcher.getNumManifolds();
				for ( let i = 0; i < numManifolds; i ++ ) {
					let contactManifold = dispatcher.getManifoldByIndexInternal( i );
					let numContacts = contactManifold.getNumContacts();
					for ( let j = 0; j < numContacts; j++ ) {
						let contactPoint = contactManifold.getContactPoint( j );
						let distance = contactPoint.getDistance();
						if(distance<0){
							return false
						}
					}
				}
				return true
			}
  function PhysicsUpdate(){
    playerControls.PhysicsUpdate();
  }
  // 退出每帧需要渲染的函数
  export function quitRender(){
	window.cancelAnimationFrame(animFrameId)
	Ammo.destroy(world);
	Ammo.destroy( solver );
	Ammo.destroy( collisionConfiguration );
	Ammo.destroy( dispatcher );
	Ammo.destroy( broadphase );
	// Ammo.destroy(this.solver);
	// Ammo.destroy(this.broadphase);
	// Ammo.destroy(this.dispatcher);
	// Ammo.destroy(this.collisionConfiguration);
  }
/** 获取射线类点击到的第一个对象和法线
 * @param event
 * @returns {{normal: null, distance: null, model: null, point: null}}
 */
 function getRayObjAndNormal(model,event){

    const mainCanvas = dom.getElementsByTagName('canvas')[0]
    mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1// 标准设备横坐标
    mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1// 标准设备纵坐标
    raycaster.setFromCamera(mouse, camera);
    let intersects = []
	intersects =raycaster.intersectObject(model, true)

    let obj={normal:null,point:null,model:null,distance:null}
    if(intersects.length>0){
        const normal= intersects[0].face.normal
        const model = intersects[0].object
        model.updateMatrixWorld()
        const normalMatrix = new THREE.Matrix3().getNormalMatrix( model.matrixWorld );
        const newNormal = normal.clone().applyMatrix3( normalMatrix ).normalize();
        obj.normal=newNormal;// 当前位置曲面法线
        obj.point =new THREE.Vector3().copy(intersects[0].point)
        obj.model = intersects[0].object
        obj.distance=intersects[0].distance
    }else{
		return null
	}
    return obj
}
// 放置素材
/**
 * 从左侧测边栏托入素材到场景中
 * @param type 素材类型
 * @param position 点击的位置
 * @param src 素材原文件
 * @param dom 素材dom元素获取素材的真实大小
 */
 export async function placeMaterial (type, config, src) {
    var event={
        clientX:config.x,
        clientY:config.y
    }
    var index=config.index
	// console.log('src')
	// console.log(src)
    const obj=getRayObjAndNormal(model3d,event)
	if(obj==null){
		return
	}
    var normal = obj.normal;// 当前位置曲面法线
    var point =new THREE.Vector3().copy(obj.point) // 当前点击到的点
    var dom=null
    const model = obj.model // 当前点击到的模型
    // 创建一个平面
    let geometry =null;
    let plane = null;
    if (model!=null) {
			if(type === modelMaterial) {
				// 封装了模型加载
				const path={
					path:filePrefix + modelUrl +src.modelName,
					texture:filePrefix+modelUrl+src.mapName[0]
				}
				plane=await loadModel(false,path)
				// 存储相对路径，导出时使用相对路径
				plane.src=src
				plane.name = "model" // 起名称，到时候鼠标点击时用于判断是不是素材模型
				plane.index=index
				changeName(plane,'model')
			}
           else if (type === imgMaterial) {// 图片素材
                // 获取素材的真实大小，防止比例不对
                dom = document.getElementsByClassName("tabs-item-img")[index];

                geometry =new THREE.PlaneGeometry(dom.naturalWidth,dom.naturalHeight);
                const material = new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(src)
                });

                plane = new THREE.Mesh(geometry, material);
                plane.name = "img" // 起名称，到时候鼠标点击时用于判断是不是图片
                plane.index=index
				plane.src=src
            } else if (type === videoMaterial) {
				// console.log(src.src)
                geometry=new THREE.PlaneGeometry(src.videoWidth,src.videoHeight)
                var texture = new THREE.VideoTexture(src);
                const material = new THREE.MeshBasicMaterial({
                    map: texture
                });
                const canvas = await composeCanvas(src, imgDom)// 获取视频当前帧，并在上面加一个暂停的按钮
				// console.log(canvas)
                material.map = new THREE.CanvasTexture(canvas);
                material.base = texture //真正的视频资源
                plane = new THREE.Mesh(geometry, material);
                plane.name = "video"// 起名称，到时候鼠标点击时用于判断是不是素材
                plane.index=index
				plane.src=src.src
            }else if(type===iconMaterial){
                geometry =new THREE.PlaneGeometry(config.iconObj.size,config.iconObj.size);
                const material = new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(src),
					transparent:true
                });
                plane = new THREE.Mesh(geometry, material);
                plane.name = "icon" // 起名称，到时候鼠标点击时用于判断是不是图片
                plane.index=index
				plane.href=config.iconObj.href
			}
			else{
                return ;
            }
			if(type!=iconMaterial){
				// 计算plane的缩放比例
				tmpBox.setFromObject(plane)
				let scale=min/getMax(tmpBox)/4
				plane.scale.set(scale,scale,scale)
			}
            plane.lookAt(normal.x, normal.y, normal.z)
			plane.lookat=normal.clone()
			point.add(normal.multiplyScalar(0.1)) //将素材沿法线平移一段距离,拒绝在同一个位置,有多个mesh发生闪烁现象
            plane.position.copy(point)
            materialGroup.add(plane)// 将素材添加到素材组中
            return plane;
        }
}
/**
 * 获取到视频的当前一帧并添加一张图片在上面,实现暂停按钮是视频中
 * @param videoDom
 * @param imgDom
 * @returns {HTMLCanvasElement}
 */
 export async function composeCanvas(videoDom, imgDom) {
	// console.log('network === ' + videoDom.networkState)
	// console.log('ready === ' + videoDom.readyState)
	let type = null;
	if (videoDom.readyState === 1 || videoDom.readyState === 0) {
		type = 'oncanplaythrough';
	}
	videoDom.onprogress = function () {
		// console.log('onprogress')
	}
	videoDom.onloadedmetadata = function () {
		// console.log('onloadedmetadata')
	}
	videoDom.onloadeddata = function () {
		// console.log('onloadeddata')
	}
	videoDom.oncanplay = function () {
		// console.log('oncanplay')
	}
	function compose(resolve) {
		videoCanvas.width = videoDom.videoWidth
		videoCanvas.height = videoDom.videoHeight
		imgCanvas.width = imgDom.width
		imgCanvas.height = imgDom.height
		const ctx = videoCanvas.getContext('2d')
		ctx.drawImage(videoDom, 0, 0)
		imgCanvas.getContext('2d').drawImage(imgDom, 0, 0)
		videoCanvas.getContext('2d').drawImage(imgCanvas, videoCanvas.width/2-imgCanvas.width/2, videoCanvas.height/	2-imgCanvas.height/2)
		resolve(videoCanvas)
	}
	return new Promise((resolve, reject) => {
		if (type != null) {
			videoDom[type] = function () {
				compose(resolve);
			};
		} else {
			compose(resolve);
		}
	});
}

// 更改transform控制器显示轴是否显示
function changeControlShow(flag){
    transformControl.showX=flag
	transformControl.showY=flag
    transformControl.showZ =flag
}
export function saveMaterial() {
    var materialInScene = []
    for(var i=0;i<materialGroup.children.length;i++){
        var child=materialGroup.children[i]
        if(child.name==='model'){
            const obj = {
                type: modelMaterial,
                src:child.src,
                position: child.position,
                scale: child.scale,
                rotation: child.rotation,
                up: child.lookat,
                music: child.music,
				index:child.index
            }
            materialInScene.push(obj)
        }else if (child.name==='img'){
			// console.log(child)
            const obj = {
                type: imgMaterial,
                src:child.src,
                position: child.position,
                scale: child.scale,
                rotation: child.rotation,
                up: child.lookat,
                music: child.music,
                index:child.index
            }
            materialInScene.push(obj)
        }  else if (child.name === "video") {
            const obj = {
                type: videoMaterial,
                src:child.src,
                position: child.position,
                scale: child.scale,
                rotation: child.rotation,
                up: child.lookat,
                index:child.index
            }
            materialInScene.push(obj)
        }
    }
    return materialInScene
}
export function placeMusic(music) {
    var index = music.index
    var mesh = materialGroup.children[index]
    mesh.music = music
    setTimeout(function () {
        mesh.audio=document.getElementsByClassName('tabs-item-audio')[index]
    }, 100)

}
/**
 * 加载保存的素材
 */
export async function loadMaterial() {
	if(sceneGroup!=null && sceneGroup.scene!=null){
	let materials=sceneGroup.scene

    let geometry = null;
    let plane = null;
    let material = null;
    if (materials === null || materials.length === 0) {
		initAmmo()
        return
    }
    for (var i = 0; i < materials.length; i++) {
        if (materials[i].type === modelMaterial) {

			const path={
				path:filePrefix + modelUrl +materials[i].src.modelName,
				texture:filePrefix+modelUrl+materials[i].src.mapName[0]
			}
			plane=await loadModel(false,path)
			plane.index=materials[i].index
			changeName(plane,'model')

        }
        else if (materials[i].type === imgMaterial) {
            material = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(materials[i].src),
                side: THREE.FrontSide
            });
            var dom = document.getElementsByClassName("tabs-item-img")[materials[i].index];
            geometry =new THREE.PlaneGeometry(dom.naturalWidth,dom.naturalHeight);
            plane = new THREE.Mesh(geometry, material);
            plane.name = "img"
            plane.index=materials[i].index
            var music = materials[i].music
            if (music != null) {
                plane.music = music
                plane.audio=document.getElementsByClassName('tabs-item-audio')[music.index]
            }
        }
        else if (materials[i].type === videoMaterial) {
            const video = document.getElementsByClassName("tabs-item-video")[materials[i].index];

            geometry=new THREE.PlaneGeometry(video.videoWidth,video.videoHeight)
            var texture = new THREE.VideoTexture(video);
            material = new THREE.MeshBasicMaterial({
                map: texture,
				 side: THREE.FrontSide
            });
            material.base=texture
            plane = new THREE.Mesh(geometry, material);
            plane.name = "video"
            plane.index=materials[i].index
			const canvas=await composeCanvas(video, imgDom)
			plane.material.map = new THREE.CanvasTexture(canvas );
        }
			let lookat=new THREE.Vector3(materials[i].up.x, materials[i].up.y, materials[i].up.z)
			// plane.lookAt(lookat)
			plane.src=materials[i].src
			plane.lookat=lookat.clone()
			plane.position.copy(materials[i].position)
			plane.rotation.copy(materials[i].rotation)
			plane.scale.copy(materials[i].scale)
        	materialGroup.add(plane)
        }
		initAmmo()
		// if(!editor_bak){
		// 	for(let i=0;i<materialGroup.children.length;i++){
		// 		initAmmoChild(materialGroup.children[i])
		// 	}
		// }
	}else
	{
		initAmmo()
	}
}
//打开第一人称控制器开关
export function addControl(){
	playerControls.Initialize()
	Input.AddEvent()
}
