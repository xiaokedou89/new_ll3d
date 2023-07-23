// import * as Three from "three";
// import {directionalLight,pointLight,spotLight,hemisphereLight,ambientLight,spotLightPro,hemisphereLightPro,ambientLightPro,pointLightPro,directionalLightPro} from "@/utils/global.js";
//
// /**
//  * threejs 的灯光不能进行单例化，因为一个场景可以拥有许多该类型的灯光
//  */
// /**
//  * 灯光相关
//  */
// let SceneLight = (function(){
//     let instance;
//     let SceneLight = function (scene){
//         if ( instance ){
//
//             return instance;
//         }
//         this.lightsOn = true//是否开启物理灯光
//         this.ambientLightOn = true//是否开启场景中的环境光
//         this.lights =null
//             this.lightSaveNode={
//             phyLightSave:[
//
//             ],
//             ambientLightSave:{},
//             lightsOn:true,//是否开启物理灯光
//             ambientLightOn:true// 是否开启环境光
//         } //与后端交互的保存灯光的数据
//         this.ambientLight = Object.assign({}, ambientLightPro)
//         this.directionalLight = Object.assign({}, directionalLightPro)
//         this.pointLight = Object.assign({}, pointLightPro)
//         this.spotLight = Object.assign({}, spotLightPro)
//         this.hemisphereLight = Object.assign({}, hemisphereLightPro)
//         this.scene = scene
//         this.lightsInScene = new Three.Group()//在场景中的物理光
//         this.ambientLightInScene = null//在场景中的环境光
//         return instance = this;
//     };
//     /**
//      * 场景无灯光的时候使用,模型全景灯光在模型内部
//      */
//     SceneLight.prototype.initLight = function () {
//         this.lightSaveNode={
//             phyLightSave:[
//
//             ],
//             ambientLightSave:{},
//             lightsOn:true,//是否开启物理灯光
//             ambientLightOn:true// 是否开启环境光
//         } //与后端交互的保存灯光的数据
//         this.lights = [
//             {
//                 light: null,//具体灯光
//                 properties: null//属性配置用于前端配置
//             },
//             {
//                 light: null,//具体灯光
//                 properties: null//属性配置用于前端配置
//             }, {
//                 light: null,//具体灯光
//                 properties: null//属性配置用于前端配置
//             }
//         ]//场景中的物理灯光,最多可配置三个
//         this.lightsInScene.clear()
//         console.log('this.lights')
//         console.log(this.lights)
//         this.ambientLight.color = 0xAFAFAF;
//         this.ambientLight.intensity = 1;
//         this.createAmbi(this.ambientLight)
//         this.getLightProperty(this.ambientLightInScene)
//         const directionalLight1 = new Three.DirectionalLight(0xffffff, 2);
//         directionalLight1.name = directionalLight;
//         this.lights[0].light = directionalLight1;//三个灯光的第一个灯光为平行光
//         this.lights[0].properties = this.getLightProperty(this.lights[0].light)
//         // 将物理灯光添加到场景当中
//         this.scene.add(this.lightsInScene)
//         this.bindCameraLight()
//         this.lights[0].light = directionalLight1;//三个灯光的第一个灯光为平行光
//         this.lights[0].properties = this.getLightProperty(this.lights[0].light)
//         this.lightSaveNode.phyLightSave.push(this.lights[0].properties )
//         this.lightSaveNode.ambientLightSave=this.getLightProperty(this.ambientLightInScene)
//         this.lightsInScene.add(this.lights[0].light)
//     }
//     // 根据灯光参数列表构建光
//     SceneLight.prototype.initLightByProperty = function (lightProterty) {
//         // 构建物理光
//         this.lightSaveNode=lightProterty
//         var phyLightSave=lightProterty.phyLightSave
//         for(var i=0;i<phyLightSave.length;i++){
//             if(phyLightSave[i]!=null) {
//                 this.createPhyLight(i, phyLightSave[i].type, phyLightSave[i])
//             }
//         }
//         this.scene.add(this.lightsInScene)
//         // 更改物理光是否显示
//         this.showPhysicalLight(lightProterty.lightsOn)
//         // 创建环境光
//         this.ambientLight=lightProterty.ambientLightSave
//         this.createAmbi(lightProterty.ambientLightSave)
//         this.showAmbientLight(lightProterty.ambientLightOn)
//         this.ambientLightInScene.visible=lightProterty.ambientLightOn
//     }
//     // 根据灯光类型进行配置灯光参数
//     SceneLight.prototype.getLightProperty = function (light) {
//         var property = null
//         //使用 indexOf,因为名称还判断了是否该灯跟随相机 wait可能会发生更改
//         if (light.name.indexOf(ambientLight) !== -1) {// 灯光类型是环境光
//             property = Object.assign({}, this.ambientLight)
//             property.color = light.color.getStyle()
//             property.intensity = light.intensity
//         }  else if (light.name.indexOf(directionalLight) !== -1) {// 灯光类型是平行光
//             property = Object.assign({}, this.directionalLight)
//             property.color = light.color.getStyle()// 灯光颜色
//             property.intensity = light.intensity//灯光强度
//             property.position = light.position// 灯光位置
//             property.castShadow = light.castShadow,//是否产生阴影
//                 property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
//                 property.isBindCamera = false,//是否绑定相机
//                 property.rotation = light.rotation//灯光旋转值
//             if(light.name.indexOf('_bindCamera')!==-1){
//                 property.isBindCamera = true//是否绑定相机
//             }
//         }else if (light.name.indexOf(pointLight) !== -1) {// 灯光类型是点光源
//             property = Object.assign({}, this.pointLight)
//             property.color = light.color.getStyle()// 灯光颜色
//             property.intensity = light.intensity//灯光强度
//             property.position = light.position// 灯光位置
//             property.castShadow = light.castShadow,//是否产生阴影
//                 property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
//                 property.decay= light.decay// 灯光衰减量
//             if(light.name.indexOf('_bindCamera')!==-1){
//                 property.isBindCamera = true//是否绑定相机
//             }
//         }else if (light.name.indexOf(spotLight) !== -1) {// 灯光类型是聚光灯
//             property = Object.assign({}, this.spotLight)
//             property.color = light.color.getStyle()// 灯光颜色
//             property.intensity = light.intensity//灯光强度
//             property.position = light.position// 灯光位置
//             property.castShadow = light.castShadow,//是否产生阴影
//                 property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
//                 property.decay= light.decay,// 灯光衰减量
//                 property.distance= light.distance,//从光源发出光的最大距离，其强度根据光源的距离线性衰减
//                 property.angle= light.angle, //光线散射角度，0-90最大为Math.PI/2。
//                 property.penumbra= light.penumbra// 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
//             if(light.name.indexOf('_bindCamera')!==-1){
//                 property.isBindCamera = true//是否绑定相机
//             }
//         }
//         else if (light.name.indexOf(hemisphereLight) !== -1) {// 灯光类型是半球光
//             property = Object.assign({}, this.hemisphereLight)
//             property.color = light.color.getStyle()// 天空颜色
//             property.groundColor = light.groundColor.getStyle()// 天空颜色
//             property.intensity = light.intensity//灯光强度
//             property.position = light.position// 灯光位置
//             if(light.name.indexOf('_bindCamera')!==-1){
//                 property.isBindCamera = true//是否绑定相机
//             }
//         }
//
//         return property
//     }
//     // 更改光的信息参数
//     /**
//      * @param light 要更改的具体的某个光
//      * @param name 更改光的信息参数
//      * @param property 更改光信息的值
//      */
//     SceneLight.prototype.changeLightProperty = function (light, name, property) {
//         if (name === 'color') {
//             light.color = new Three.Color(property)
//         } else if(name === 'groundColor'){
//             light.groundColor = new Three.Color(property)
//         }else if (name === 'type') {
//             light.name = property
//         } else if(name==='bias'){
//             light.shadow.bias=property
//         } else{
//             light[name] = property
//         }
//     }
//     // 更改灯光
//     SceneLight.prototype.changeLight = function (index, properties) {
//         if (properties === null) {
//             this.lightsInScene.remove(this.lights[index].light)
//             this.lights[index].light = null
//         } else {
//             if (this.lights[index].light != null) {// 如果该索引有光
//                 //判断是不是当前类型的光
//                 if (this.lights[index].properties.type === properties.type) {
//                     // 根据参数更改光的属性
//                     for (let key in properties) {
//                         this.changeLightProperty(this.lights[index].light, key, properties[key])
//                     }
//                 } else {// 如果不是当前光的类型
//                     // 去除掉场景中的第i个光,根据属性创建光
//                     this.lightsInScene.remove(this.lights[index].light)
//                     this.createPhyLight(index, properties.type, properties)
//                 }
//             } else { // 如果这个地方没有光
//                 this.createPhyLight(index, properties.type, properties)
//             }
//         }
//         this.lights[index].properties = properties
//     }
//     // 根据类型创建物理光
//     SceneLight.prototype.createPhyLight = function (index, type, properties) {
//         if (type === directionalLight) {
//             this.lights[index].light = new Three.DirectionalLight();
//         }else if (type===pointLight){
//             this.lights[index].light = new Three.PointLight();
//         }else if(type===spotLight){
//             this.lights[index].light = new Three.SpotLight();
//         }else if(type===hemisphereLight){
//             this.lights[index].light = new Three.HemisphereLight();
//         }else{
//             return
//         }
//         for (let key in properties) {
//             this.changeLightProperty(this.lights[index].light, key, properties[key])
//         }
//         this.lights[index].light.name=type
//         this.lights[index].properties=properties
//         this.lightsInScene.add(this.lights[index].light)
//     }
//     SceneLight.prototype.createAmbi=function (property){
//         this.ambientLightInScene = new Three.AmbientLight(property.color, property.intensity);
//         this.ambientLightInScene.name = ambientLight;
//         this.scene.add(this.ambientLightInScene)
//     }
//     // 设置灯光名称中如果绑定了相机,灯光位置同相机位置
//     SceneLight.prototype.bindCameraLight = function () {
//
//         for (let key in this.lights) {
//             if (this.lights[key].light != null) {
//                 if (this.lights[key].light.name.indexOf('_bindCamera') !== -1) {
//                     this.lights[key].light.position=new Three.Vector3(0,1,0)
//
//                 }
//             }
//         }
//     }
//     // 控制物理灯光是否可见
//     SceneLight.prototype.showPhysicalLight=function (showPhysicalLight){
//         this.lightsOn=showPhysicalLight
//         // 所有灯光visible为true
//         for (let key in this.lights) {
//             if (this.lights[key].light != null) {
//                 this.lights[key].light.visible=showPhysicalLight
//             }
//         }
//     }
//     // 控制环境光是否可见
//     SceneLight.prototype.showAmbientLight=function (ambientLightMoFlag){
//         this.ambientLightOn=ambientLightMoFlag
//         this.ambientLightInScene.visible=ambientLightMoFlag
//     }
//     SceneLight.prototype.saveLight=function () {
//         this.lightSaveNode.phyLightSave=[]
//         for (let key in this.lights) {
//             if (this.lights[key].light != null) {
//                 this.lightSaveNode.phyLightSave.push(this.lights[key].properties)
//             }
//         }
//         this.lightSaveNode.lightsOn=this.lightsOn
//         this.lightSaveNode.ambientLightOn=this.ambientLightOn
//         this.lightSaveNode.ambientLightSave=this.getLightProperty(this.ambientLightInScene)
//         return this.lightSaveNode
//     }
//     return SceneLight;
// })();
// export {SceneLight}
