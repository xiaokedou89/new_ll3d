import * as Three from "three";
import {filePrefix, image, defaultPhong, defaultNormal} from "@/utils/global";

/**
 * 纹理处理，需要将模型内容传入
 */

var TextureUtil = (function(){
    var instance;
    var TextureUtil = function(  ){
        if ( instance ){
            return instance;
        }
        this.init();
        return instance = this;
    };
    TextureUtil.prototype.init = function(){
        this.model3d=null // 要修改的模型对象
        this.materialsFront= JSON.parse(JSON.stringify(defaultNormal))
        this.textureLoader=new Three.TextureLoader()
        this.phongMaterialPro= {}// MeshPhongMaterial的一些构造函数
        this.lambertMaterialPro={}// LambertMaterial的一些构造函数
        this.physicalMaterialPro={}// physicalMaterial的一些构造函数
        this.materialPro=null
        this.materialMap = new Map();// 保存的素材对象,应该是个整体的大对象，-1为整体，0从length为多模型子对象的index
        this.materials=[]// 要更改的素材对象
        this.flag=false
        // 是要改单个的还是全部的
        this.addModel=function (index,model){
            // console.log(model)
            this.model3d=model
            this.giveMaterial(index)// 改的内容进行保存
            this.model3d.index=index//将index值进行设定，以后可以直接通过model3d知道改的是整体对象的什么部分
            this.flag=true

        }
        this.initMaterialPro=function (){// 一开始将构造的参数数据进行初始化
            this.initMeshPhongMaterial(this.phongMaterialPro)// 初始化MeshPhongMaterial的参数
            this.initMeshPhysicalMaterial(this.physicalMaterialPro)// 初始化物理网格材质的基本参数
            this.initMeshLambertMaterial(this.lambertMaterialPro)//初始化MeshLambertMaterial的基本参数

        }
        // 将纹理的基本属性进行初始化,如果有具体的则直接使用设置好的
        this.LoadTexturePro=function(t) {
            var that=this
            var m;// 材质对象
            if (t.disable) {
                return
            }
            this.configMaterialPro(t)

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
                    // mesh.material=m
                    that.changeMeshMaterial(mesh,m);
                }
            });
        }


        this.changeMeshMaterial=function (one,m){
            if (one.material.skinning) {
                one.material = m.clone();
                one.material.skinning = true;
            } else {
                one.material = m;
            }
            one.castShadow = true;
            one.receiveShadow =true;
        };
        //初始化Phong网格材质
        this.initMeshPhongMaterial=function (texturePro) {

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
        this.initMeshPhysicalMaterial=function (texturePro) {
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
        this.initMeshLambertMaterial=function (texturePro) {
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
        this.changeMaterial=function (type,material){// 修改模型材质内容
            if (this.model3d==null||this.model3d.index==null){
                return
            }
            material.type=type
            this.getMaterialPro(type)
            this.LoadTexturePro(material)
            this.materialMap.set(this.model3d.index,material)//修改后的纹理信息
        }
        // 根据type得到更改的材质参数
        this.getMaterialPro=function (type){
            if(type==='phong'){
                this.materialPro=this.phongMaterialPro
            }else if (type==='normal'){
                this.materialPro=this.physicalMaterialPro
            }else if(type==='lambert'){
                this.materialPro=this.lambertMaterialPro
            }
        }
        this.configMaterialPro=function (material){
            // console.log('config')
            // console.log(material)
            if(this.model3d===null)
                return
            this.model3d.materialBase=material
            for (var obj in material){
                if(obj==null){
                    continue
                }
                if(typeof material[obj]==="object"){
                    for(var i in material[obj]){
                        if (i.toLowerCase().endsWith("map")){
                            if(material[obj][i]!=null) {
                                this.materialPro[i] = this.textureLoader.load(filePrefix + image + material[obj][i])
                            }else{
                                this.materialPro[i] =null
                            }
                        }else if(i.toLowerCase().endsWith("color")){
                            // console.log(i)
                            // console.log(material[obj][i])
                            this.materialPro[i]=material[obj][i]
                        } else{
                            this.materialPro[i]=material[obj][i]
                        }
                    }
                }
            }
        }
        this.giveMaterial=function (index){
            if(this.model3d.materialBase!=null&&this.model3d.materialBase!=undefined){
                this.materialsFront=this.model3d.materialBase
            }else {
                if (this.model3d.material==undefined){//模型材质不在其挂载上
                    this.model3d=this.model3d.children[0]
                }
                //判断当前对象的材质类型
                if(this.model3d.material.length>0) {
                    var material = this.model3d.material[this.model3d.material.length-1].type
                    if (material === 'MeshPhongMaterial') {
                        this.materialsFront = JSON.parse(JSON.stringify(defaultPhong))
                    }
                    this.getMaterialByModel(this.materialsFront, this.model3d.material[this.model3d.material.length-1])
                }else{
                    var material = this.model3d.material.type
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
        this.getMaterialByModel=function (materialsFront,material){
            // console.log(`materialFront`)
            // console.log(materialsFront)
            // console.log('material')
            // console.log(material)
            for (var obj in materialsFront){
                if(obj==null){
                    continue
                }
                if(typeof materialsFront[obj]==="object"){
                    for(var i in materialsFront[obj]){
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
            // console.log('materialsFront')
            // console.log(materialsFront)
        }
        // 点击保存的时候使用
        this.saveTextures=function (){
            var that=this
            console.log('map')
            console.log(this.materialMap)
            this.materialMap.forEach((v,k)=>{
                const materialEntry={
                    index:null,//多对象的第几个索引
                    materialEditor:null// 更改的材质内容
                }
                materialEntry.index=k
                materialEntry.materialEditor=v
                that.materials.push(materialEntry)
            })
            // console.log('保存素材')
            // console.log(that.materials)
            return that.materials
        }
        this.initTexturesByProperty=function (model3d,textures){
            this.initMaterialPro()
            // console.log(textures)
            for(var i=0;i<textures.length;i++){
                // console.log('====')
                // console.log(textures[i].index)
                // console.log(model3d.children[textures[i].index])
                this.model3d=model3d.children[textures[i].index]
                this.changeMaterial(textures[i].materialEditor.type,textures[i].materialEditor)
                this.materialMap.set(textures[i].index,textures[i].materialEditor)
            }
        }
    };
    return TextureUtil;
})();

export {TextureUtil}
