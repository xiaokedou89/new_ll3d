import * as Three from "three";
import {filePrefix, image, defaultPhong, defaultNormal, backgroundType} from "@/utils/global";

/**
 * threejs 的纹理，使用单例模式进行封装
 * @type {function(): TextureLoader}
 */
let ThreeTexture = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Three.TextureLoader();
        }
        return instance;
    }
})();
/**
 * 背景纹理处理，用于设置场景背景，支持普通背景图及全景图两种格式
 */
var SceneTexture = (function(){
    var instance;
    var SceneTexture = function(scene){
        if ( instance ){
            this.scene=scene //整个场景对象
            return instance;
        }
        this.textureLoader = new ThreeTexture();
        return instance = this;
    };

    SceneTexture.prototype.setBackground=function (type,url){
        let texture= this.textureLoader.load(url )
        this.scene.background=texture
        if (type==backgroundType.panorama){
            // 设置模型的背景图为全景，只需要更改贴图映射方式
            texture.mapping = THREE.EquirectangularReflectionMapping;
        }
    }
    return SceneTexture;
})();
/**
 * 模型纹理处理，需要将模型内容传入
 */
var ModelTexture = (function(){
    var instance;
    var ModelTexture = function(  ){
        if ( instance ){
            return instance;
        }
        this.model3d=null
        this.textureLoader = new ThreeTexture();
        this.materialsFront= JSON.parse(JSON.stringify(defaultNormal))
        this.phongMaterialPro= {}// MeshPhongMaterial的一些构造函数
        this.lambertMaterialPro={}// LambertMaterial的一些构造函数
        this.physicalMaterialPro={}// physicalMaterial的一些构造函数
        this.materialPro=null
        this.materialMap = new Map();// 保存的素材对象
        this.materials=[]// 要更改的素材对象
        this.flag=false
        return instance = this;
    };
    ModelTexture.prototype.addModel=function (index,model){
        this.model3d=model
        // console.log('model')
        // console.log(model)
        this.giveMaterial(index)
        this.flag=true

    }
    ModelTexture.prototype.initMaterialPro=function (){// 一开始将构造的参数数据进行初始化
        this.initMeshPhongMaterial(this.phongMaterialPro)// 初始化MeshPhongMaterial的参数
        this.initMeshPhysicalMaterial(this.physicalMaterialPro)// 初始化物理网格材质的基本参数
        this.initMeshLambertMaterial(this.lambertMaterialPro)//初始化MeshLambertMaterial的基本参数

    }
    // 将纹理的基本属性进行初始化,如果有具体的则直接使用设置好的
    ModelTexture.prototype.LoadTexturePro=function(t) {
        let that=this
        let m;// 材质对象
        // console.log(t)
        if (t.disable) {
            return
        }
        this.configMaterialPro(t)
        // console.log('material')
        // console.log(this.materialPro)
        switch (t.type) { //可以更改纹理的类型
            case 'phong':
                m = new Three.MeshPhongMaterial(this.materialPro);
                break;
            case 'normal':
                m = new Three.MeshPhysicalMaterial(this.materialPro);
                break;
            case 'lambert':
                m = new Three.MeshLambertMaterial(this.materialPro);
                break;
            default :
                m = new Three.MeshPhongMaterial(this.materialPro);
                break;
        }
        m.shading = Three.SmoothShading;
        m.flatShading = Three.SmoothShading;

        if(this.model3d.isMesh){
            this.changeMeshMaterial(this.model3d,m)
        }
        this.model3d.traverse(function (mesh) {
            if (mesh.isMesh) {
                that.changeMeshMaterial(mesh,m);
            }
        });
    }


    ModelTexture.prototype.changeMeshMaterial=function (one,m){
        // console.log('修改后的材质')
        // console.log(m)
        if (one.material.skinning) {
            one.material = m.clone();
            one.material.skinning = true;
        } else {
            one.material = m;
        }
        // import 重要有可能是因为此处模型无贴图
        one.material.emissive = one.material.color;
        one.material.emissiveMap = one.material.map;
        one.castShadow = true;
        one.receiveShadow =true;
    };
    //初始化Phong网格材质
    ModelTexture.prototype.initMeshPhongMaterial=function (texturePro) {

        //是否废掉
        texturePro.disable = false;
        texturePro.type = 'MeshPhongMaterial';
        texturePro.map = null;//基本贴图

        texturePro.aoMap = null;
        texturePro.aoMapIntensity = 1;//ao强度

        texturePro.specular = '0x111111';//镜面颜色
        texturePro.specularMap = null;
        texturePro.shininess = 30;//镜面反射强度

        texturePro.emissive = '0xffffff';//高光颜色
        texturePro.emissiveMap = null;//高光贴图
        texturePro.emissiveIntensity = 0;//高光轻度

        texturePro.bumpMap = null;//凹凸贴图
        texturePro.bumpScale = 1;//凹凸高度/深度

        texturePro.normalMap = null;//法向贴图
        texturePro.normalScale = new Three.Vector2(1, 1);//法向深度

        texturePro.displacementMap = null;//位移贴图
        texturePro.displacementScale = 1;//位移值
        texturePro.displacementBias = 0;//位移偏差

        texturePro.alphaMap = null;//透明贴图

        texturePro.transparent = true;//是否透明
        texturePro.opacity = 1;//透明度

        //灯光贴图
        texturePro.lightMap = null;
        texturePro.lightMapIntensity = 1;//灯光贴图强度强度

        texturePro.castShadow = false;
        texturePro.receiveShadow = false;

        texturePro.envMap = null;//环境贴图
        texturePro.envMapShowType = 1;
        texturePro.envMapOn = false;
        texturePro.envMapOn2 = false;

        texturePro.combine = Three.MultiplyOperation;//组合
        // Options are MultiplyOperation (default), MixOperation, AddOperation. If mix is chosen, the reflectivity is used to blend between the two colors.
        texturePro.envMapTypeSet = 0;//反射
        texturePro.reflectivity = 1;// 反射率
        texturePro.refractionRatio = 0.98;//折射率

        texturePro.side = Three.FrontSide;//渲染面
        texturePro.wireframe = false;
        texturePro.wireframeLinewidth = 1
        texturePro.wireframeLinecap = 'round1';//butt", d"round" and "square
        texturePro.wireframeLinejoin = 'round2';//d round", "bevel" and "miter"

    }
    // 初始化物理网格材质的基本参数
    ModelTexture.prototype.initMeshPhysicalMaterial=function (texturePro) {
        texturePro.type = 'MeshPhysicalMaterial';
        texturePro.disable = false;
        texturePro.map = null;
        texturePro.alphaMap = null;
        texturePro.aoMap = null; // *
        texturePro.aoMapIntensity = 1; //0-in //*
        texturePro.bumpMap = null;//*
        texturePro.bumpScale = 1;//0-1//*
        texturePro.envMapIntensity = 0.01;
        texturePro.clearCoat = 0;
        texturePro.clearCoatRoughness = 0;
        texturePro.displacementMap = null; //*
        texturePro.displacementScale = 1;// //*
        texturePro.displacementBias = 0;// //*
        texturePro.emissive = "0xffffff"; //*
        texturePro.emissiveMap = null;//*
        texturePro.emissiveIntensity = 0;//*
        texturePro.envMap = null;//*
        texturePro.envMapShowType = 1;
        texturePro.envMapTypeSet = 0;
        texturePro.reflectivity = 0.5;
        texturePro.refractionRatio = 0.98;//*
        texturePro.clearCoat = 0;//清漆
        texturePro.clearCoatRoughness = 0;//清漆粗糙度
        //灯光贴图
        texturePro.lightMap = null;
        texturePro.lightMapIntensity = 1;//灯光贴图强度强度
        texturePro.envMapOn = false;
        texturePro.envMapOn2 = false;
        texturePro.envMapIntensity = 0.01//待测
        texturePro.metalness = 0.0;   // 0.0 - 1.0
        texturePro.metalnessMap = null //金属性
        texturePro.normalMap = null;//*
        texturePro.normalScale = new Three.Vector2(1, 1);//*
        texturePro.roughness = 0; //粗糙度 0.0 - 1.0 待测
        texturePro.roughnessMap = null;
    }
    // 初始化MeshLambertMaterial的基本参数
    ModelTexture.prototype.initMeshLambertMaterial=function (texturePro) {
        texturePro.type = 'MeshLambertMaterial';
        texturePro.disable = false;
        texturePro.map = null;//基本贴图

        texturePro.aoMap = null;
        texturePro.aoMapIntensity = 1;//ao强度

        texturePro.specularMap = null;

        texturePro.emissive = '0xffffff';//高光颜色
        texturePro.emissiveMap = null;//高光贴图
        texturePro.emissiveIntensity = 0;//高光轻度
        texturePro.alphaMap = null;//透明贴图

        texturePro.transparent = true;//是否透明
        texturePro.opacity = 1;//透明度

        texturePro.castShadow = false;
        texturePro.receiveShadow = false;

        //灯光贴图
        texturePro.lightMap = null;
        texturePro.lightMapIntensity = 1;//灯光贴图强度强度

        texturePro.envMap = null;//环境贴图
        texturePro.envMapShowType = 1;//1 是禁止 2是强制 其他是灵活 *** ==> 3 是灵活 4是强制 其他是禁止
        texturePro.envMapOn = false;
        texturePro.envMapOn2 = false;
        texturePro.combine = Three.MultiplyOperation;//组合
        // Options are MultiplyOperation (default), MixOperation, AddOperation. If mix is chosen, the reflectivity is used to blend between the two colors.
        texturePro.envMapTypeSet = 0;//反射
        texturePro.reflectivity = 1;// 反射率
        texturePro.refractionRatio = 0.98;//折射率

        texturePro.side = Three.FrontSide;//渲染面
        texturePro.wireframe = false;
        texturePro.wireframeLinewidth = 1
        texturePro.wireframeLinecap = 'round1';//butt", d"round" and "square
        texturePro.wireframeLinejoin = 'round2';//d round", "bevel" and "miter"

    }
    ModelTexture.prototype.changeMaterial=function (type,material){
        if (this.model3d==null){
            return
        }
        this.getMaterialPro(type)
        this.LoadTexturePro(material)
    }
    // 根据type得到更改的材质参数
    ModelTexture.prototype.getMaterialPro=function (type){
        if(type==='phong'){
            this.materialPro=this.phongMaterialPro
        }else if (type==='normal'){
            this.materialPro=this.physicalMaterialPro
        }else if(type==='lambert'){
            this.materialPro=this.lambertMaterialPro
        }
    }
    ModelTexture.prototype.configMaterialPro=function (material){
        if(this.model3d===null)
            return
        this.model3d.materialBase=material
        for (let obj in material){
            if(obj==null){
                continue
            }
            if(typeof material[obj]==="object"){
                for(let i in material[obj]){
                    if (i.toLowerCase().endsWith("map")){
                        if(material[obj][i]!=null) {
                            this.materialPro[i] = this.textureLoader.load(filePrefix + image + material[obj][i])

                        }else{
                            this.materialPro[i] =null
                        }
                    }else if(i.toLowerCase().endsWith("color")){
                        if (material[obj][i]==null){
                            this.materialPro[i]=null
                        }else {
                            this.materialPro[i] = new Three.Color(material[obj][i])
                        }
                    } else{
                        this.materialPro[i]=material[obj][i]
                    }
                }
            }
        }
    }
    ModelTexture.prototype.giveMaterial=function (index){
        if(this.model3d.materialBase!=null&&this.model3d.materialBase!=undefined){
            this.materialsFront=this.model3d.materialBase
        }else {
            if (this.model3d.material==undefined){//模型材质不在其挂载上
                this.model3d=this.model3d.children[0]
            }
            //判断当前对象的材质类型
            if(this.model3d.material.length>0) {
                let material = this.model3d.material[this.model3d.material.length-1].type
                if (material === 'MeshPhongMaterial') {
                    this.materialsFront = JSON.parse(JSON.stringify(defaultPhong))
                }
                this.getMaterialByModel(this.materialsFront, this.model3d.material[this.model3d.material.length-1])
            }else{
                let material = this.model3d.material.type
                if (material === 'MeshPhongMaterial') {
                    this.materialsFront = JSON.parse(JSON.stringify(defaultPhong))
                }
                this.getMaterialByModel(this.materialsFront, this.model3d.material)
            }
        }
        this.materialMap.set(index,this.materialsFront)
    }

    /**
     * 根据要得到的值遍历模型的材质
     * @param materialsFront 要给前端的材质
     * @param material 模型的材质
     */
    ModelTexture.prototype.getMaterialByModel=function (materialsFront,material){
        // console.log('模型material')
        // console.log(material)
        for (let obj in materialsFront){
            if(obj==null){
                continue
            }

            if(typeof materialsFront[obj]==="object"){
                for(let i in materialsFront[obj]){
                    if (i.toLowerCase().endsWith("map")){
                        // materialsFront[obj][i]=material[i]
                    }else if(i.toLowerCase().endsWith("arr")){
                        if(material[i]==undefined) {
                            materialsFront[obj][i] = []
                        }else{
                            materialsFront[obj][i] = material[i]
                        }
                    }
                    else{
                        materialsFront[obj][i]=material[i]
                    }
                }
            }

        }
        // console.log('materialFront')
        // console.log(materialsFront)
    }
    // 点击保存的时候使用
    ModelTexture.prototype.saveTextures=function (){
        let that=this
        this.materialMap.forEach((v,k)=>{
            const materialEntry={
                index:null,//多对象的第几个索引
                materialEditor:null// 更改的材质内容
            }
            materialEntry.index=k
            materialEntry.materialEditor=v
            that.materials.push(materialEntry)
        })

        return that.materials
    }
    ModelTexture.prototype.initTexturesByProperty=function (model3d,textures){
        this.initMaterialPro()
        for(let i=0;i<textures.length;i++){
            this.model3d=model3d.children[textures[i].index]
            this.changeMaterial(textures[i].materialEditor.type,textures[i].materialEditor)
            this.materialMap.set(textures[i].index,textures[i].materialEditor)
        }
    }
    return ModelTexture;
})();


export {ModelTexture,SceneTexture}
