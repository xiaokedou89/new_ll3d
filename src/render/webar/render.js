// webar 渲染代码 基于https://github.com/AR-js-org/AR.js实现
import * as THREE from "three"
import { ArToolkitProfile, ArToolkitSource, ArToolkitContext, ArMarkerControls,ArSmoothedControls} from 'ar-js-org/three.js/build/ar-threex.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {image, uploadUrl} from "@/utils/global";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";

let scene;
let camera;
let renderer;
let objPic;// 模型纹理
let objModel;//模型文件
let markerPic="../ar/inner-hiro.png"
let objLoader;
export function init(param){
	const width = window.innerWidth;
	const height = window.innerHeight;
	// console.log('param')
	// console.log(param)


	objModel=param.path
	objPic=param.texture
	// var objPic = constants.funName + modeltexture;
	// var objModel = constants.funName + modelobj;

	scene = new THREE.Scene();//初始化场景和环境
	// camera = new THREE.Camera();//初始化相机添加到场景
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);

	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias: true,                                	//开启抗锯齿
		alpha: true                                      	//开启背景透明
	});
	renderer.autoClear = false;
	renderer.setClearColor(new THREE.Color('lightgrey'), 0);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	document.body.appendChild(renderer.domElement);


	//场景内添加灯

	const ambient = new THREE.AmbientLight(0x666666);
	scene.add(ambient);
	const directctionalLight = new THREE.DirectionalLight(0x887766);
	directctionalLight.position.set(-1, 1, 1).normalize();
	scene.add(directctionalLight);

	//array of  functions for the rendering loop（渲染处理函数组初始化）
	let onRenderFcts = [];

	//init scene and camera


	//handle arToolkitSource（调用打开相机事件，由THREEx提供）
	let arToolkitSource = new ArToolkitSource({
		//to read from the webcam
		sourceType: 'webcam'
	});

	arToolkitSource.init(function onReady() {
		onResize();
	});

	//handle resize(处理重新调整大小后正常显示)
	window.addEventListener('resize', function () {
		onResize();
	});

	function onResize() {
		arToolkitSource.onResize();
		arToolkitSource.copySizeTo(renderer.domElement);
		if (arToolkitContext.arController !== null) {
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
		}
	}


	//初始化 ArcToolkit环境, 相机内部场景
	//create acToolkitContext
	var arToolkitContext = new ArToolkitContext({
		//相机参数设置
		cameraParametersUrl: "../ar/camera_para.dat",
		detectionMode: 'mono',

	});
	//initialize it
	arToolkitContext.init(function onCompleted() {
		//copy projection matrix to camera
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});
	//update artoolkit on every frame
	onRenderFcts.push(function () {
		if (arToolkitSource.ready === false) return;
		arToolkitContext.update(arToolkitSource.domElement);
		// scene.visible = camera.visible

	});

	//Create a ArMakerControls
	//创建一个Ar标记

	// var myMarker = 'marker-training/pattern-files/pattern-hiro.patt';

	var markerRoot = new THREE.Group(); //用threejs的点集合初始化。
	scene.add(markerRoot);
	var imageURL = markerPic;
	// console.log('识别图地址')
	// console.log(imageURL)
	encodeImageURL(imageURL, function onComplete(patternFileString) {
		var patternURL = 'data:text/plain;base64,' + btoa(patternFileString);
		// create THREEx.ArMarkerControls
		var markerControls = new ArMarkerControls(arToolkitContext, markerRoot, {
			type: 'pattern',
			patternUrl: patternURL
		});
	})
	// scene.visible = false;
	//平滑渲染
	var smoothedRoot = new THREE.Group();
	scene.add(smoothedRoot);
	var smoothedControls = new ArSmoothedControls(smoothedRoot, {
		lerpPosition: 0.4,
		lerpQuaternion: 0.3,
		lerpScale: 1,

	});
	onRenderFcts.push(function (delta) {
		smoothedControls.update(markerRoot);
	});
	smoothedControls.addEventListener('becameVisible', function () {
		// console.log('becameVisible event notified')
	});
	//add Object in the scene
	//添加物体
	var arWorldRoot = smoothedRoot;

	objLoader = new OBJLoader();
	//创建模型的纹理（贴图）加载器。
	var TextureLoader = new THREE.TextureLoader();
	var texture = TextureLoader.load(objPic);
	//加载模型
	objLoader.load(
		//资源路径
		objModel, function (obj) {
			obj.traverse(function (child) {
				//将加载到的纹理给模型的材质
				if (child.isMesh) {
					// if (child instanceof THREE.Mesh) {
					child.material.map = texture;
					child.material.side = THREE.DoubleSide;
					child.material.transparent = true;
					// child.material.side = THREE.FrontSide
					// child.material.depthTest= false;
				}
			});

			obj.children[0].geometry.computeBoundingBox();
			var modelObj=  obj.children[0].geometry.center();
			//  console.log( obj.children[0].geometry.center());
			var maxX = modelObj.boundingBox.max.x;
			var minX = modelObj.boundingBox.min.x;
			var maxY = modelObj.boundingBox.max.y;
			var minY = modelObj.boundingBox.min.y;
			var maxZ = modelObj.boundingBox.max.z;
			var minZ = modelObj.boundingBox.min.z;
			var maxDis = Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY) + (maxZ - minZ) * (maxZ - minZ)) / 2;
			//  console.log(maxDis);
			var scale = 1.0 / maxDis;
			obj.scale.set(scale,scale,scale);


			arWorldRoot.add(obj);



		},//进度回调函数
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		// 当加载有错误时调用
		function (error) {
			console.log('An error happened');
		}
	);


	/*  // fov :摄像机椎体垂直视野角度
      // dis:  相机距离
      // height :  成像高度
      // modelWidth: 模型宽度
      function adaption(fov, dis, height, modelWidth) {
          return ((Math.tan(fov / 2) * dis) / 2) / ((height + Math.tan(fov / 2) * modelWidth) / 2);
      }
  */

	//renderer the Whole thing on the page
	//渲染场景到页面中
	//渲染率查看器
	/*var stats = new Stats();
    document.body.appendChild(stats.dom);*/



	//renderer the scene
	onRenderFcts.push(function () {
		renderer.clear();
		// camera.aspect = width/height;
		// 更新投射矩阵
		// camera.updateProjectionMatrix();
		renderer.render(scene, camera);

	});

	//run the rendering loop
	var lastTimeMsec = null;
	requestAnimationFrame(function animate(nowMsec) {
		//keep looping
		requestAnimationFrame(animate);

		//measure time
		lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
		var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
		//call all each update function
		onRenderFcts.forEach(function (onRenderFct) {
			// console.log('111render')
			onRenderFct(deltaMsec / 1000, nowMsec / 1000)
		})

	});
}
function encodeImageURL(imageURL, onComplete){
	var image = new Image;
	image.onload = function(){
		var patternFileString = encodeImage(image)
		onComplete(patternFileString)
	}
	image.src = imageURL;
}

function encodeImage (image){
	// copy image on canvas
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d')
	canvas.width = 16;
	canvas.height = 16;

	// document.body.appendChild(canvas)
	// canvas.style.width = '200px'


	var patternFileString = ''
	for(var orientation = 0; orientation > -2*Math.PI; orientation -= Math.PI/2){
		// draw on canvas - honor orientation
		context.save();
		context.clearRect(0,0,canvas.width,canvas.height);
		context.translate(canvas.width/2,canvas.height/2);
		context.rotate(orientation);
		context.drawImage(image, -canvas.width/2,-canvas.height/2, canvas.width, canvas.height);
		context.restore();

		// get imageData
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height)

		// generate the patternFileString for this orientation
		if( orientation !== 0 )	patternFileString += '\n'
		// NOTE bgr order and not rgb!!! so from 2 to 0
		for(var channelOffset = 2; channelOffset >= 0; channelOffset--){
			// console.log('channelOffset', channelOffset)
			for(var y = 0; y < imageData.height; y++){
				for(var x = 0; x < imageData.width; x++){

					if( x !== 0 ) patternFileString += ' '

					var offset = (y*imageData.width*4) + (x * 4) + channelOffset
					var value = imageData.data[offset]

					patternFileString += String(value).padStart(3);
				}
				patternFileString += '\n'
			}
		}
	}

	return patternFileString
}

// 页面退出的销毁函数
// function destroy(){
// 	 renderer=null;// 渲染器
// 	 scene=null;// three.js 场景
// 	 ambient=null;// 环境光
// 	 directionalLight=null;// 平行光
// 	 camera=null; // 相机
// 	 arToolkitSource=null;// webar 相机资源
// 	 arToolkitContext=null;
// 	 onRenderFcts= []; // 每次渲染循环要运行的函数列表
// 	 imageURL=null // 解析图片的url
// 	 patternUrl=null // webar 解析图上传时生成的pattern 文件
// 	 smoothedRoot=null // 平滑控制组
// 	 smoothedControls=null
// }
