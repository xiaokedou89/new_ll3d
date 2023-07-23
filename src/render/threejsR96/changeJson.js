// 旧版本的json格式转换为新版本的json格式
import * as OLDThree from '@/render/threejsR96/three.module.js';
export async function changeJson(jsonString){
    if(jsonString==null||jsonString==""){
        return 
    }
    let jsonData=JSON.parse(jsonString)
    
    let json={
        'obj':null,
        'fog':null,
        'material':null,
        'bg':null,
        'camera':null,
        'light':null
    }
    return changeLight(json,jsonData)
}
  // 修改灯光json
  function changeLight(json,jsonData){
    return new Promise((resolve, reject) => {
     let oldTexture=jsonData.texturePro
    let oldLight=jsonData.scene
    let oldBg=jsonData.bg
    let oldCamera=jsonData.camera
    let oldFog=jsonData.fogPro
    let oldObj=jsonData.obj
    let newLight={
        "ambientLightOn":true,//是否打开环境光
        "ambientLightSave":{//环境光属性
            "color":'',//颜色
            "intensity":1,//强度
            "type":"AmbientLight"
        },
        "lightsOn":true,//是否打开物理灯光
        "phyLightSave":[]
    }
    const loader = new OLDThree.ObjectLoader();
    loader.parse( oldLight, function ( scene ) {
           
            let light=[]
            if(scene.children[0] instanceof OLDThree.Group){
                light=scene.children[0].children
            }else{
                light=scene.children
            }
            for(let i=0;i<light.length;i++){
                if(light[i].type=='AmbientLight'){
                    newLight.ambientLightSave.color=light[i].color
                    newLight.ambientLightSave.intensity=light[i].intensity
                }else if(light[i].type=="DirectionalLight"){
                    let data={
                        'lightPositionFlag': false,
                        'type':'directionalLight',//灯光类型平行光
                        'color':light[i].color,// 灯光颜色
                        'intensity':light[i].intensity,//灯光强度
                        'position':light[i].position,// 灯光位置
                        'castShadow':light[i].castShadow,//是否产生阴影
                        'bias':light[i].bias,//阴影斜纹,设置的是shadow.bias
                        'isBindCamera':false,//是否绑定相机
                    }
                    newLight.phyLightSave.push(data)
                }else if(light[i].type=='PointLight'){
                    let data={
                        lightPositionFlag: false,
                        type:'pointLight',// 点光源
                        color:light[i].color,// 灯光颜色
                        intensity:light[i].intensity,//光照强度
                        position:light[i].position,// 灯光位置
                        decay:light[i].decay,//衰减量
                        castShadow:light[i].castShadow,//是否产生阴影
                        bias:light[i].bias,//阴影斜纹,设置的是shadow.bias
                        isBindCamera:false,//是否绑定相机
                    }
                    newLight.phyLightSave.push(data)
                }else if(light[i].type=='SpotLight'){
                    let data={
                        lightPositionFlag: false,
                        type:'spotLight',// 聚光灯
                        color:light[i].color,// 灯光颜色
                        intensity:light[i].intensity,//光照强度
                        distance:light[i].distance,//从光源发出光的最大距离，其强度根据光源的距离线性衰减
                        decay:light[i].decay, //沿着光照距离的衰减量。
                        angle:light[i].angle, //光线散射角度，0-90最大为Math.PI/2。
                        penumbra:light[i].penumbra, // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
                        castShadow:light[i].castShadow,//是否产生阴影
                        bias:light[i].bias,//阴影斜纹,设置的是shadow.bias
                        isBindCamera:false,//是否绑定相机
                        position:light[i].position,// 灯光位置
                    }
                    newLight.phyLightSave.push(data)
                }
                else if(light[i].type=='HemisphereLight'){
                    let data={
                        lightPositionFlag: false,
                        type:'hemisphereLight',//半球光
                        color :light[i].color,// 天空中发出光线的颜色。 缺省值 0xffffff
                        groundColor : light[i].groundColor,//地面发出光线的颜色。 缺省值 0xffffff
                        intensity : light[i].intensity,// (可选参数) 光照强度。 缺省值 1
                        isBindCamera:false,//是否绑定相机
                        position:light[i].position// 灯光位置
                    }
                    newLight.phyLightSave.push(data)
                }
            }
            // 该方法是异步的，在这里保存json数据比较稳妥
            json.light=newLight
            if(oldBg!=null){
                json.bg=changeBg(oldBg)
            }
            json.camera=changeCamera(oldCamera)
            if(oldFog!=null){
                json.fog=changeFog(oldFog)
            }
            if(oldObj!=null){
                json.obj=changeObj(oldObj)
            }
            if(oldTexture!=null){
                json.material=changeMaterial(oldTexture)
            }
            console.log('json')
            console.log(json)
            resolve(json)
            // saveJson(id,json)
        })
    });
}
function changeMaterial(oldTexture){
    // new texture 
    let newTexture=[
         {
        "index": -1,
        "materialEditor": {
            "type": "phong",
            "surface": null,
            "opacity": 0,
            "basic": {
                "map": "null",
                "color": null,
                "basicMapArr": []
            },
            "specular": {
                "specularMap": null,
                "specular": null,
                "shiness": 30,
                "specularMapArr": []
            },
            "emissive": {
                "emissiveMap": null,
                "emissive": null,
                "emissiveMapArr": [],
                "emissiveIntensity": 0
            },
            "bump": {
                "bumpMap": null,
                "bumpMapArr": [],
                "bumpScale": 0
            },
            "ao": {
                "aoMap": null,
                "aoMapArr": [],
                "aoMapIntensity": 0
            },
            "light": {
                "lightMap": null,
                "lightMapArr": [],
                "lightMapIntensity": 0
            },
            "normal": {
                "normalMap": null,
                "normalMapArr": [],
                "normalScale": {
                    "x": 0,
                    "y": 0
                }
            },
            "displacement": {
                "displacementMap": null,
                "displacementMapArr": [],
                "displacementScale": 0,
                "displacementBias": 0
            },
            "alpha": {
                "alphaMap": null,
                "alphaMapArr": []
            },
            "env": {
                "envMapShowType": null,
                "envMapTypeSet": null,
                "envMap": null,
                "envMapArr": [],
                "combine": null,
                "reflectivity": 0,
                "refactionRation": 0
             }
        }
    }
    ]
    
    newTexture[0].materialEditor.alpha.alphaMap=oldTexture.alphaMap
    newTexture[0].materialEditor.ao.aoMap=oldTexture.aoMap
    newTexture[0].materialEditor.ao.aoMapIntensity=oldTexture.aoMapIntensity
    if(oldTexture.specularMap!=null){
        newTexture[0].materialEditor.specular.specularMap=oldTexture.specularMap.img
    }
    newTexture[0].materialEditor.specular.specular=oldTexture.specalar
    newTexture[0].materialEditor.specular.shiness=oldTexture.shiness
    return newTexture
}
function changeBg(bg_){
    // 背景图的相关属性
    let newBg={
        'url':null,// 图片路径
        'type':1// 图片类型 1指的是普通图片2 指的是全景图片
    }
    newBg.url=bg_.currentB
    newBg.type=bg_.type
    return newBg
}
function changeFog(fog_){
    // 雾的相关属性
    let fog={
        color:fog_.color,
        density:fog_.density
    }
    return fog
}
// 修改模型的基本属性
function changeObj(obj_){
    let obj={
        position:obj_.position,
        rotation:obj_.rotation,
        scale:obj_.scale
    }
    return obj
}
function changeCamera(camera_){
    let camera={
        position:null
    }
    camera.position=camera_.position
    return camera
}