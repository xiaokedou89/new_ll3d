import * as THREE from "three"
import { gsap } from "gsap";
let dom=null; // 渲染的dom元素
let currentScene=null;// 渲染的全景列表
let param=null;// 渲染的配置参数
let textureLoader=new THREE.TextureLoader();// 纹理渲染器
let camera=null; // threejs 渲染相机
let scene=null;// threejs 渲染的场景
let sceneGroup=null;// 渲染保存记录
let animFrameId=0;// 每帧调用函数，页面销毁时需撤销每帧销毁函数
let renderer=null;// threejs 渲染器
let controls=null // threejs 控制器
let mouse=new THREE.Vector2() // 鼠标位置
let hots=null;// 存储2dcss
let cssRenderer=null;//css2d渲染器，用来渲染css
let raycaster = null //射线类
let mesh=null;//渲染的主模型
let materialObj=null;// 正在编辑的素材
let editor=null// 是否正在编辑
let content=null// 点击热点要显示的内容
let dialog=null // 弹框内容
let shaderMaterial=null// 着色器材质对象
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {filePrefix,skyBoxUrl,modelUrl} from "@/utils/global.js";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {fragment} from "@/render/skybox/shader/fragment.js"
import { vertex } from "@/render/skybox/shader/vertex.js";
// import * as modelShowApi from "@/render/components/show";
function initParam(){
    dom=null; // 渲染的dom元素
    currentScene=null;// 渲染的全景列表
    param=null;// 渲染的配置参数
    camera=null; // threejs 渲染相机
    scene=null;// threejs 渲染的场景
    sceneGroup=null;
    renderer=null;// threejs 渲染器
    controls=null; // threejs 控制器
    cssRenderer=null; //threejs css渲染器
    raycaster = null; //射线类
    mesh=null;// 渲染的主模型
    materialObj=null;// 正在编辑的素材
    content=null;// 点击热点要显示的内容
}
export  function initDom(dom_,currentScene_,param_){
	initParam()
    dom=dom_
	currentScene=currentScene_
	param=param_
	sceneGroup=param_.sceneGroup
    raycaster = new THREE.Raycaster() //射线类
	let res =  init() //初始化threejs 场景、渲染器
	window.addEventListener('keydown',onkeydown,false)
    editor=JSON.parse(param.flag)
    content=param.content
    dialog=param.dialog
    // modelShowApi.initDom(content.modelDiv,param.dialogLoading)
	return res
}
// 渲染器init
function init(){
    camera = new THREE.PerspectiveCamera( 75, dom.offsetWidth / dom.offsetHeight, 1, 1100 );

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( - 1, 1, 1 );
    const texture = textureLoader.load( filePrefix+skyBoxUrl+currentScene.pano.path);
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    hots=new THREE.Group()// 存储2dcss热点
    scene.add(hots);//将热点元素添加到场景中
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(  dom.offsetWidth,  dom.offsetHeight);
    renderer.domElement.style.width="100%";
	renderer.domElement.style.height = "100%";
    dom.appendChild( renderer.domElement );
    cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize( dom.offsetWidth, dom.offsetHeight );
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';
    dom.appendChild( cssRenderer.domElement );
    controls = new OrbitControls( camera, cssRenderer.domElement );
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate=false
    controls.target.set(camera.position.x+0.1,camera.position.y,camera.position.z)
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.5;
    initShaderMaterial()//初始化过渡材质
    loadHotSpot()
    addEvent()
    animate()
    // 窗口改动函数
    window.addEventListener( 'resize', onWindowResize );
}
function addEvent(){
       // //添加电脑事件
    //    dom.addEventListener('mousedown', onDocumentMouseDown, false);

       dom.addEventListener('mouseup', onDocumentMouseUp, false);

       dom.addEventListener('mousewheel', onDocumentMouseWheel, false);
       //添加手机事件
       dom.addEventListener('touchstart', onDocumentTouchStart, {passive: false});

       dom.addEventListener('touchend', onDocumentTouchEnd, {passive: false});
}
function onDocumentMouseDown(event) {
    // 编辑模式下为拖拽
    if(editor){
        if(event.button==0){
            materialObj=event.currentTarget.obj
            dom.addEventListener('mousemove', onDocumentMouseMove, false);
        }else if(event.button==2){
            dialog.visible=true
            let data=event.currentTarget.obj.data
            // console.log('点击的data')
            // console.log(event.currentTarget.obj)
            // console.log(data)
            dialog.index=event.currentTarget.obj.index
            if(data==null ||data==undefined){
                dialog.type='image',
                dialog.hotspot={
                    name: "",
                    music: "",//不是必需
                    size: 60,//尺寸
                    list: [],
                    voice:{
                        id:null
                    },
                    icon: null,
                    showName: true,//是否在全景中显示名称
                    distance: 0//文字距离
                }
            }else{
                // dialog=data
                dialog.type=data.type
                dialog.hotspot=Object.assign({},data.hotspot)
                dialog.flag=false,
                dialog.index=event.currentTarget.obj.index
            }
        }
    }else{
        let data=event.currentTarget.obj.data
        if(data.type==='link'){
            let link = document.createElement('a');
            link.style.display = 'none';
            if(!data.blank){
                link.target="_blank"
            }
            link.href = data.hotspot.url
             document.body.appendChild(link);
             link.click();
        }else if(data.type==='text'){
            content.textVisible=true
            content.text=data.hotspot.content
        }else if(data.type==='voice'){
            content.voice=data.hotspot.voice.path
            document.getElementById("audioContent").play();
        }else if(data.type==='video'){
            content.videoVisible=true
            content.video=data.hotspot.video.path
        }else if(data.type==='image'){
            content.imgVisible=true
            content.imgList=data.hotspot.list
        }else if(data.type==='html'){
            content.htmlVisible=true
            content.html=data.hotspot.content
        }else if(data.type==='panorama'){
            // const texture = textureLoader.load( filePrefix+skyBoxUrl+data.scene.path);
            // const material = new THREE.MeshBasicMaterial( { map: texture } );
            // mesh.material=material
            let originTexture=mesh.material.clone().map
            let destTexture=textureLoader.load( filePrefix+skyBoxUrl+data.scene.path)
            console.log('originTexture')
            console.log(originTexture)
            console.log('destTexture')
            console.log(filePrefix+skyBoxUrl+data.scene.path)
            console.log(destTexture)
            //todo 切换全景图
            mesh.material=shaderMaterial
            changeTexture(originTexture,destTexture)
            for(let i=0;i<hots.children.length;i++){
                hots.children[i].element.removeEventListener('mousedown',onDocumentMouseDown)
                hots.remove(hots.children[i])
            }
        }else if(data.type==='model'){
            content.modelVisible=true
            content.modelId=data.hotspot.model.id
            // let path={
            //     path:data.hotspot.model.model,
            //     texture:data.hotspot.model.texture
            // }
            // modelShowApi.loadModel(path)
            // modelShowApi.render()
        }else if(data.type==='reset'){
            content.resetVisible=true
            content.resetList=data.list
        }
    }
}

function onDocumentMouseMove(event) {
    if(materialObj!=null){
       let point=getContactPoint(event)
        if(point!=null){
            materialObj.position.copy(point)
        }
    }
}

function onDocumentMouseUp(event) {
    dom.removeEventListener('mousemove', onDocumentMouseMove, false);
    materialObj=null
}
function onWindowResize(){
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( dom.offsetWidth, dom.offsetHeight );
    cssRenderer.setSize(dom.offsetWidth,dom.offsetHeight)
}
function onDocumentMouseWheel(event) {
    var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}

function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        dom.addEventListener('touchmove', onDocumentTouchMove, {passive: false});
    }

}

function onDocumentTouchEnd(event) {
    dom.removeEventListener('touchmove', onDocumentTouchMove, {passive: false});
}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {
        event.preventDefault();
    }

}
function animate(){
    animFrameId =requestAnimationFrame( animate );
    controls.update();
    render()
}
function render(){
    renderer.render(scene,camera)
    cssRenderer.render( scene, camera );
}
export function destory(){
    if(hots!=null){
        hots.clear()
    }
    if(scene!=null){
        scene.clear()
    }
    window.cancelAnimationFrame(animFrameId)
}
// 添加css 2d物体
function addObj(data,div,position){
    var obj = new CSS2DObject(div);
    obj.data=data
     div.obj=obj
    obj.position.x = position.x;
    obj.position.y = position.y;
    obj.position.z = position.z;
    // obj.addEventListener('click', onDocumentMouseDown);
    obj.element.addEventListener('mousedown',onDocumentMouseDown);
    hots.add(obj);
}
// 移除obj
export function removeObj(index){
    hots.remove(hots.children[index])
}
// 拖拽icon到指定的位置
/*
export function placeMaterial(config,src){
    return new Promise((resolve, reject) => {
            let event={
                clientX:config.x,
                clientY:config.y
            }
            let point=getContactPoint(event)
            if(point!=null){
                let image= document.createElement('img');
                image.style.width="60px"
                image.style.height="60px"
                image.src=src
                var obj = new CSS2DObject(image);
                image.obj=obj
                obj.index=config.index
                obj.position.x = point.x;
                obj.position.y = point.y;
                obj.position.z = point.z;
                obj.element.addEventListener('mousedown',onDocumentMouseDown);
                hots.add(obj);
                // css2dRender的物体并不能被raycaster 所监听需要给每一个css2dObject,添加点击事件
                image.addEventListener('click', onDocumentMouseDown, {passive: false});
                resolve('success')
            }
    })
}
*/
export function placeMaterial(config,src, publicConfig){
    return new Promise((resolve, reject) => {
            let event={
                clientX:config.x,
                clientY:config.y
            }
            let point=getContactPoint(event)
            if(point!=null){
                if (!publicConfig) {
                    let image= document.createElement('img');
                    image.style.width="60px"
                    image.style.height="60px"
                    image.src=src
                    var obj = new CSS2DObject(image);
                    image.obj=obj
                    obj.index=config.index
                    obj.position.x = point.x;
                    obj.position.y = point.y;
                    obj.position.z = point.z;
                    obj.element.addEventListener('mousedown',onDocumentMouseDown);
                    hots.add(obj);
                    // css2dRender的物体并不能被raycaster 所监听需要给每一个css2dObject,添加点击事件
                    image.addEventListener('click', onDocumentMouseDown, {passive: false});
                    resolve('success')
                } else {
                    let divDom = document.createElement('div');
                    divDom.style.width = '70px';
                    divDom.style.height = '70px';
                    divDom.style.background = `url(${src}) 0 0 no-repeat`;
                    divDom.style.backgroundSize = '70px 1750px';
                    divDom.style.animation = 'changeBg 500ms steps(1, start) infinite';
                    var obj = new CSS2DObject(divDom);
                    obj.index = config.index;
                    obj.position.x = point.x;
                    obj.position.y = point.y;
                    obj.position.z = point.z;
                    obj.element.addEventListener('mousedown',onDocumentMouseDown);
                    hots.add(obj);
                    divDom.addEventListener('click', onDocumentMouseDown, {passive: false});
                    resolve('success');
                }  
            }
    })
}




//获取到鼠标与全景球的点
function getContactPoint(event){
    if(mesh!=null){
        const mainCanvas=dom.getElementsByTagName('canvas')[0]
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1// 标准设备横坐标
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1// 标准设备纵坐标
        raycaster.setFromCamera(mouse, camera);
        let intersects = []
        intersects =raycaster.intersectObject(mesh, false)
        
        if(intersects.length>0){
            return intersects[0].point
        }else{
            return null
        }
    }
    return null;
}
// 根据添加热点的信息，在屏幕上创建热点
export function addHotSpot(data){
    // 获取到屏幕正中间的点
    const config={
        x:document.documentElement.clientWidth/2,
        y:document.documentElement.clientHeight/2
    }
    var event={
        clientX:config.x,
        clientY:config.y
    }
    let point=getContactPoint(event)

    if(point!=null){
        if(data.type=='reset'){
            addCss2D(point,data)
            return new Promise((resolve, reject) => {
                resolve('success')
            })
        }else if(data.type=='panorama'){
            addCss2D(point,data)
            return new Promise((resolve, reject) => {
                resolve('success')
            })
        }
    }
}
function addCss2D(point,data){
    let image= document.createElement('img');
    image.style.width=data.size+"px"
    image.style.height=data.size+"px"
    image.src=data.icon.path
    data.icon.position=point
    // image.width=data.size+"px"
    // image.height=data.size+"px"
    addObj(data,image,point)
    // css2dRender的物体并不能被raycaster 所监听需要给每一个css2dObject,添加点击事件
    image.addEventListener('click', onDocumentMouseDown, {passive: false});
}
// 编辑模式变预览模式
export function changeEditor(flag){
    editor=flag
}
// 更换全景贴图
export function changePanorama(data){
    // 清空2d锚点
    for(let i=0;i<hots.children.length;i++){
        hots.children[i].element.removeEventListener('mousedown',onDocumentMouseDown)
        hots.remove(hots.children[i])
    }
    const texture = textureLoader.load( filePrefix+skyBoxUrl+data.pano.path);
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    mesh.material=material
    currentScene=data
    loadHotSpot()
}
function loadHotSpot(){
    // let hotspots=currentScene.hotspot;
    console.log('load hotspot')
    console.log(currentScene)
    let hotspots=currentScene.scene
    for(let key in hotspots){
        for(let i=0;i<hotspots[key].length;i++){
           
            console.log('add css 2d')
            console.log('key:'+key+"i:"+i)
            console.log(hotspots[key][i])
            addCss2D(hotspots[key][i].icon.position,hotspots[key][i])
        }
    }
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
export function changeHotSpot(data){
    for(let i=0;i<hots.children.length;i++){
        if(hots.children[i].index==data.index){
            // console.log('index===>'+data.index)
            // console.log(hots.children[i])
            hots.children[i].data=data;
        }
    }
}
export function changeMaterial(data){
    return new Promise((resolve, reject) => {
        const texture = textureLoader.load( filePrefix+skyBoxUrl+data.panorama.path);
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        mesh.material=material
        resolve('success')
    })
}
export function checkEl(){
    let result=""
    for(let i=0;i<hots.children.length;i++){
        if(hots.children[i].data==null){
            result+=i+" "
        }
    }
    return result
}
function initShaderMaterial(){
    shaderMaterial =  new THREE.ShaderMaterial({
        uniforms: {
        t1: {value: null},
        t2: {value: null},
        transition: {value: 0}
    },
    vertexShader: vertex,
    fragmentShader: fragment
    });
}
// 切换全景图材质
function changeTexture(originTexture,destTexture){
    let m=shaderMaterial
    gsap.fromTo(m.uniforms.transition, 
    {value: 0}, 
    {
        value: 1, 
        duration: 2, 
        repeat: 0,
        repeatRefresh: true,
        onRepat: () => {
            
            m.uniforms.t1.value = originTexture;
            m.uniforms.t2.value = destTexture;
        }
})
}