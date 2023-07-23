import * as Three from "three";
import {directionalLight,pointLight,spotLight,hemisphereLight,ambientLight,spotLightPro,hemisphereLightPro,ambientLightPro,pointLightPro,directionalLightPro} from "@/utils/global.js";
/**
 * 灯光相关
 */
function Light(scene,center) {
    this.defaultPosition=center
    // console.log('this defaultPosition')
    // console.log(this.defaultPosition)
    this.lightsOn = true//是否开启物理灯光
    this.ambientLightOn = true//是否开启场景中的环境光
    this.lights = [
        {
            light: null,//具体灯光
            properties: null,//属性配置用于前端配置
            helper:null// 该灯的显示框
        },
        {
            light: null,//具体灯光
            properties: null,//属性配置用于前端配置
            helper:null// 该灯的显示框
        }, {
            light: null,//具体灯光
            properties: null,//属性配置用于前端配置
            helper:null// 该灯的显示框
        }
    ]//场景中的物理灯光,最多可配置三个
    this.lightSaveNode={
        phyLightSave:[

        ],
        ambientLightSave:{},
        lightsOn:true,//是否开启物理灯光
        ambientLightOn:true// 是否开启环境光
    } //与后端交互的保存灯光的数据
    this.ambientLight = Object.assign({}, ambientLightPro)
    this.directionalLight = Object.assign({}, directionalLightPro)
    this.pointLight = Object.assign({}, pointLightPro)
    this.spotLight = Object.assign({}, spotLightPro)
    this.hemisphereLight = Object.assign({}, hemisphereLightPro)

    this.lightsInScene = new Three.Group()//在场景中的物理光
    this.ambientLightInScene = null//在场景中的环境光
    this.scene = scene
    this.directionalLightHelper=null
    /**
     * 场景无灯光的时候使用,模型全景灯光在模型内部
     */
    this.initLight = function () {
        this.ambientLight.color = 0xAFAFAF;
        this.ambientLight.intensity =1;
        this.createAmbi(this.ambientLight)
        this.getLightProperty(this.ambientLightInScene)
        const directionalLight1 = new Three.DirectionalLight(0xffffff,1);
        directionalLight1.name = directionalLight;
        directionalLight1.position.copy(this.defaultPosition)
     
        this.lights[0].light = directionalLight1;//三个灯光的第一个灯光为平行光
        this.lights[0].properties = this.getLightProperty(this.lights[0].light)
        this.lights[0].helper=new Three.DirectionalLightHelper(this.lights[0].light, 10)
        this.lights[0].helper.visible=false
        // 将物理灯光添加到场景当中
        this.scene.add(this.lightsInScene)
        this.lightSaveNode.phyLightSave.push(this.lights[0].properties )
        this.lightSaveNode.ambientLightSave=this.getLightProperty(this.ambientLightInScene)
        this.lightsInScene.add(this.lights[0].light)
        this.lightsInScene.add(this.lights[0].helper)
    }
    // 根据灯光参数列表构建光
    this.initLightByProperty = function (lightProterty) {
        // 构建物理光
        this.lightSaveNode=lightProterty
        var phyLightSave=lightProterty.phyLightSave
        for(var i=0;i<phyLightSave.length;i++){
            if(phyLightSave[i]!=null) {
                this.createPhyLight(i, phyLightSave[i].type, phyLightSave[i])
            }
        }
        this.scene.add(this.lightsInScene)
        // 更改物理光是否显示
        this.showPhysicalLight(lightProterty.lightsOn)
        // 创建环境光
        this.ambientLight=lightProterty.ambientLightSave
        this.createAmbi(lightProterty.ambientLightSave)
        this.showAmbientLight(lightProterty.ambientLightOn)
        this.ambientLightInScene.visible=lightProterty.ambientLightOn
    }
    // 根据灯光类型进行配置灯光参数
    this.getLightProperty = function (light) {
        var property = null
        //使用 indexOf,因为名称还判断了是否该灯跟随相机 wait可能会发生更改
        if (light.name.indexOf(ambientLight) !== -1) {// 灯光类型是环境光
            property = Object.assign({}, this.ambientLight)
            property.color = light.color.getStyle()
            property.intensity = light.intensity
        }  else if (light.name.indexOf(directionalLight) !== -1) {// 灯光类型是平行光
            property = Object.assign({}, this.directionalLight)
            property.color = light.color.getStyle()// 灯光颜色
            property.intensity = light.intensity//灯光强度
            property.position = light.position// 灯光位置
            property.castShadow = light.castShadow,//是否产生阴影
                property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
                property.isBindCamera = false//是否绑定相机
              //  property.rotation = light.rotation灯光旋转值
            if(light.name.indexOf('_bindCamera')!==-1){
                property.isBindCamera = true//是否绑定相机
            }
        }else if (light.name.indexOf(pointLight) !== -1) {// 灯光类型是点光源
            property = Object.assign({}, this.pointLight)
            property.color = light.color.getStyle()// 灯光颜色
            property.intensity = light.intensity//灯光强度
            property.position = light.position// 灯光位置
            property.castShadow = light.castShadow,//是否产生阴影
                property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
                property.decay= light.decay// 灯光衰减量
            if(light.name.indexOf('_bindCamera')!==-1){
                property.isBindCamera = true//是否绑定相机
            }
        }else if (light.name.indexOf(spotLight) !== -1) {// 灯光类型是聚光灯
            property = Object.assign({}, this.spotLight)
            property.color = light.color.getStyle()// 灯光颜色
            property.intensity = light.intensity//灯光强度
            property.position = light.position// 灯光位置
            property.castShadow = light.castShadow,//是否产生阴影
                property.bias = light.shadow.bias,//阴影斜纹,设置的是shadow.bias
                property.decay= light.decay,// 灯光衰减量
                property.distance= light.distance,//从光源发出光的最大距离，其强度根据光源的距离线性衰减
                property.angle= light.angle, //光线散射角度，0-90最大为Math.PI/2。
                property.penumbra= light.penumbra// 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
            if(light.name.indexOf('_bindCamera')!==-1){
                property.isBindCamera = true//是否绑定相机
            }
        }
        else if (light.name.indexOf(hemisphereLight) !== -1) {// 灯光类型是半球光
            property = Object.assign({}, this.hemisphereLight)
            property.color = light.color.getStyle()// 天空颜色
            property.groundColor = light.groundColor.getStyle()// 天空颜色
            property.intensity = light.intensity//灯光强度
            property.position = light.position// 灯光位置
            if(light.name.indexOf('_bindCamera')!==-1){
                property.isBindCamera = true//是否绑定相机
            }
        }

        return property
    }
    // 更改光的信息参数
    /**
     * @param light 要更改的具体的某个光
     * @param name 更改光的信息参数
     * @param property 更改光信息的值
     */
    this.changeLightProperty = function (light, name, property) {
        if (name === 'color') {
            light.color = new Three.Color(property)
        } else if(name === 'groundColor'){
            light.groundColor = new Three.Color(property)
        }else if (name === 'type') {
            light.name = property
        } else if(name==='bias'){
            light.shadow.bias=property
        } else if(name==='castShadow'){
           light.castShadow=property
            if(light.type===directionalLight){
                // 配置shadow信息
                light.shadow.mapSize.width = 2048;
                light.shadow.mapSize.height = 2048;
                const d = 50;
                light.shadow.camera.left = - d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = - d;
                light.shadow.camera.far = 3500;
                light.shadowDarkness = 0.3;
            }
        } else if(name==='position'){
            light.position.x=property.x
            light.position.y=property.y
            light.position.z=property.z
        }else if(name==='rotation'){
            light.rotation.x=property.x
            light.rotation.y=property.y
            light.rotation.z=property.z
        }else{
            light[name] = property
        }
    }
    // 更改灯光
    this.changeLight = function (index, properties) {
        // console.log('change light===>'+index)
        // console.log(this.lights[index].light)
        // console.log(this.scene)
        if (properties === null) {
            this.lightsInScene.remove(this.lights[index].light)
            this.lights[index].light = null
            this.lights[index].helper.visible=false
            this.lights[index].helper=null
        } else {
            if (this.lights[index].light != null) {// 如果该索引有光
                //判断是不是当前类型的光
                if (this.lights[index].properties.type === properties.type) {
                    // 根据参数更改光的属性
                    for (let key in properties) {
                        this.changeLightProperty(this.lights[index].light, key, properties[key])
                    }
                } else {// 如果不是当前光的类型
                    // 去除掉场景中的第i个光,根据属性创建光
                    this.lightsInScene.remove(this.lights[index].light)
                    this.lights[index].helper.visible=false
                    this.lightsInScene.remove(this.lights[index].helper)
                    this.lights[index].light = null
                    this.lights[index].helper.visible=false
                    this.createPhyLight(index, properties.type, properties)
                }
            } else { // 如果这个地方没有光
                this.createPhyLight(index, properties.type, properties)
            }
        }
        this.lights[index].properties = properties
    }
    // 根据类型创建物理光
    this.createPhyLight = function (index, type, properties) {
        if (type === directionalLight) {
            this.lights[index].light = new Three.DirectionalLight();
            this.lights[index].helper=new Three.DirectionalLightHelper( this.lights[index].light, 10 );
            this.lights[index].helper.visible=false
        }else if (type===pointLight){
            this.lights[index].light = new Three.PointLight();
            this.lights[index].helper= new Three.PointLightHelper(   this.lights[index].light, 10 );
            this.lights[index].helper.visible=false
        }else if(type===spotLight){
            this.lights[index].light = new Three.SpotLight();
            this.lights[index].helper= new Three.SpotLightHelper(  this.lights[index].light );
            this.lights[index].helper.visible=false
        }else if(type===hemisphereLight){
            this.lights[index].light = new Three.HemisphereLight();
            this.lights[index].helper = new Three.HemisphereLightHelper( this.lights[index].light, 10 );
            this.lights[index].helper.visible=false
        }else{
            return
        }
        for (let key in properties) {
            this.changeLightProperty(this.lights[index].light, key, properties[key])
        }
        this.lights[index].light.name=type
        this.lights[index].properties=properties
        this.lightsInScene.add(this.lights[index].helper)
        this.lightsInScene.add(this.lights[index].light)
    }
    this.createAmbi=function (property){
        this.ambientLightInScene = new Three.AmbientLight(property.color, property.intensity);
        this.ambientLightInScene.name = ambientLight;
        this.scene.add(this.ambientLightInScene)
    }
    // 设置灯光名称中如果绑定了相机,灯光位置同相机位置
    this.bindCameraLight = function () {

        for (let key in this.lights) {
            if (this.lights[key].light != null) {
                if (this.lights[key].light.name.indexOf('_bindCamera') !== -1) {
                    this.lights[key].light.position=new Three.Vector3(0,1,0)

                }
            }
        }
    }
    // 控制物理灯光是否可见
    this.showPhysicalLight=function (showPhysicalLight){
        this.lightsOn=showPhysicalLight
            // 所有灯光visible为true
            for (let key in this.lights) {
                if (this.lights[key].light != null) {
                        this.lights[key].light.visible=showPhysicalLight
                }
            }
    }
    // 控制环境光是否可见
    this.showAmbientLight=function (ambientLightMoFlag){
        this.ambientLightOn=ambientLightMoFlag
       this.ambientLightInScene.visible=ambientLightMoFlag
    }
    this.saveLight=function () {
        this.lightSaveNode.phyLightSave=[]
        for (let key in this.lights) {
            if (this.lights[key].light != null) {
                this.lightSaveNode.phyLightSave.push(this.lights[key].properties)
            }
        }
        this.lightSaveNode.lightsOn=this.lightsOn
        this.lightSaveNode.ambientLightOn=this.ambientLightOn
        this.lightSaveNode.ambientLightSave=this.getLightProperty(this.ambientLightInScene)
        return this.lightSaveNode
    }
    this.adjustPosition=function (e){
        this.lights[e.index].helper.visible=true// 显示helper
    }
}
export {Light}
