import {i18n} from '@/assets/languages/i18n.js'
export const defaultUserThumb = require('@/assets/default/user.jpg');
// input上传输入框个数限制
export const inputLintSize = 20
// textarea文本输入框个数限制
export const textareaLintSize = 100
// 列表默认拉取的size
export const listSize = 8;
// 首页分类推荐部分获取数据的parentId
export const recommendParentId = 50;
export const recommendParamsObj = {
    recommend: 1,
    status: 1,
    parentId: 1
};
// 发送验证码请求的type类型常量
export const verificationType = {
    LOGIN: 0,
    RESETPASSWORD: 1,
    OLDPHONE: 2,
    NEWPHONE: 3
};
// export const chineseSignReg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e|\u003d]/g;
export const chineseSignReg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e|\u003d|\u0028|\u0029|\u0020]/g;
// 底部qq图片的链接和指向
export const footerQQimg = 'https://pub.idqqimg.com/qconn/wpa/button/button_111.gif'
export const footerQQHref = 'tencent://message/?uin=1928132302&site=qq&menu=yes'
export const footerCOMimg = '//pub.idqqimg.com/wpa/images/group.png'
export const footerCOMHref = '//shang.qq.com/wpa/qunwpa?idkey=a4aeac35595f105f301d26558788f7d195cf3e02d579fbcbb55990ad8c7db5d5'
// export const wxLogin = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx4b0d639dd15e0e64&scope=snsapi_login&state=2&response_type=code&redirect_uri=http://www.ll3d.com/identity/other/signup?targetUrl=';
// export const qqLogin = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=101373962&state=3&response_type=code&redirect_uri=http://www.ll3d.com/identity/other/signup?targetUrl=';
// export const wbLogin = 'https://api.weibo.com/oauth2/authorize?client_id=864451414&state=1&response_type=code&redirect_uri=http://www.ll3d.com/identity/other/signup?targetUrl=###';
export const otherLoginType = {
    QQ: 'qq',
    WEIXIN: 'weixin',
    SINA: 'Sina'
};
// 模型详情页淘宝引用拼接路径
export const taobaoLink = 'https://msmk.ews.m.jaeapp.com/model/'
export const weiboShare = 'https://service.weibo.com/share/share.php?url=';
export const qqShare = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=';
// 首页图标文字介绍部分遍历数组
export const firstPics = [
  { index: 1, tooltip: i18n.t('first.picsTool1'), title: i18n.t('first.picsTitle1')},
  { index: 2, tooltip: i18n.t('first.picsTool2'), title: i18n.t('first.picsTitle2')},
  { index: 3, tooltip: i18n.t('first.picsTool3'), title: i18n.t('first.picsTitle3')},
  { index: 4, tooltip: i18n.t('first.picsTool4'), title: i18n.t('first.picsTitle4')},
  { index: 5, tooltip: i18n.t('first.picsTool5'), title: i18n.t('first.picsTitle5')},
  { index: 6, tooltip: i18n.t('first.picsTool6'), title: i18n.t('first.picsTitle6')},
  { index: 7, tooltip: i18n.t('first.picsTool7'), title: i18n.t('first.picsTitle7')},
  { index: 8, tooltip: i18n.t('first.picsTool8'), title: i18n.t('first.picsTitle8')},
]
// 全景列表页请求参数类型单选数组
export const arListTypes = [
    { value: 'model', name: i18n.t('modelVr')},
    { value: 'skybox', name: i18n.t('skybox')}
];
// 获取模型列表type参数常量
export const modelListParams = {
    type: {
        MODEL: 'model',
        WEBAR: 'webar',
        VR: 'vr'
    },
    sort: {
        DOWNLOAD: 'download',
        COMPREHENSIVE: 'comprehensive',
        TIME: 'time'
    },
    isDownload: {
        all: -1,
        no: 0,
        yes: 1
    },
    time: {
        all: -1,
        day: 1,
        week: 7,
        month: 30
    }
}
// 获取模型相关模型type参数
export const aboutModelType = {
    // 模型相关模型
    COMPREHENSIVE: 'comprehensive',
    // 模型推荐模型
    THUMB: 'support'
}
/*
"typeSelf": "私有的",private
  "typeAll": "所有", all
  "typeOutrack": "下架", outrack
  "typeCollect": "收藏", 1
  "typeSupport": "点赞", 2
  "typeDownload": "下载", 3
  "typeFans": "粉丝",
  "typeFollows": "关注的人",
  "typeAr": "AR模型", webar
*/
// 根据用户相关查询获取模型参数对象
export const userModelType = {
    PRIVATE: 'private',
    ALL: 'all',
    OUTRACK: 'outrack',
    AR: 'webar',
    RECENTLY: 'recently'
};
// 模型添加点赞收藏浏览接口的type参数类型
export const modelLogType = {
    // 0浏览 1收藏 2点赞 3下载
    BROWSER: {
        type: 0,
        key: 'browser'
    },
    COLLECT: {
        type: 1,
        key: 'collect'
    },
    SUPPORT: {
        type: 2,
        key: 'support'
    },
    DOWNLOAD: {
        type: 3,
        key: 'download'
    }
 }
// 用户列表页单选框绑定数组
export const paramsTypes = [
    // 私有 value: private  type: model
    { name: i18n.t('typeSelf'), value: userModelType.PRIVATE, type: 'model'},
    // 所有 value: all  type: model
    { name: i18n.t('typeAll'), value: userModelType.ALL, type: 'model' },
    // 下架 value: outrack  type: model
    { name: i18n.t('typeOutrack'), value: userModelType.OUTRACK, type: 'model' },
    // 收藏 value: 1  type: modelLog
    { name: i18n.t('typeCollect'), value: modelLogType.COLLECT.type, type: 'modelLog' },
    // 点赞 value: 2  type: modelLog
    { name: i18n.t('typeSupport'), value: modelLogType.SUPPORT.type, type: 'modelLog' },
    // 下载 value: 3  type: modelLog
    { name: i18n.t('typeDownload'), value: modelLogType.DOWNLOAD.type, type: 'modelLog' },
    // 粉丝 value: fans  type: userFans
    { name: i18n.t('typeFans'), value: 'fans', type: 'userFans' },
    // 关注 value: follows  type: userFollows
    { name: i18n.t('typeFollows'), value: 'follows', type: 'userFollows' },
    // webar value: webar  type: model
    { name: i18n.t('typeAr'), value: userModelType.AR, type: 'model' }
    // { name: i18n.t('typeVrModel'), value: 10 },
    // { name: i18n.t('typeVrSkybox'), value: 11 },
]
// 首页探索更多模型部分单选框遍历数组
// export const exploreSorts = [
//     { index: 0, type: modelListParams.type.MODEL, sort: modelListParams.sort.COMPREHENSIVE, homeStatus: true, btnTxt: i18n.t('first.exploreBtnModel'), label: i18n.t('first.exploreComLabel')},
//     { index: 1, type: modelListParams.type.MODEL, sort: modelListParams.sort.DOWNLOAD, homeStatus: true, btnTxt: i18n.t('first.exploreBtnModel'), label: i18n.t('first.exploreDowLabel') },
//     { index: 2, type: modelListParams.type.WEBAR, sort: null, homeStatus: true, btnTxt: i18n.t('first.exploreBtnWebAR'), label: i18n.t('first.exploreWebLabel') },
// ]
export const exploreSorts = [
    { index: 0, type: modelListParams.type.MODEL, sort: modelListParams.sort.COMPREHENSIVE, homeStatus: true, btnTxt: i18n.t('first.exploreBtnModel'), label: i18n.t('first.exploreComLabel')},
    { index: 1, type: modelListParams.type.VR, btnTxt: i18n.t('first.exploreBtnVr'), label: i18n.t('first.exploreVrLabel')},
    { index: 2, type: modelListParams.type.MODEL, sort: modelListParams.sort.DOWNLOAD, homeStatus: true, btnTxt: i18n.t('first.exploreBtnModel'), label: i18n.t('first.exploreDowLabel') },
    { index: 3, type: modelListParams.type.WEBAR, sort: null, homeStatus: true, btnTxt: i18n.t('first.exploreBtnWebAR'), label: i18n.t('first.exploreWebLabel') },
]
// 上传模型左边的状态数组的静态值
export const UploadFile = Symbol.for('uploadFile');
export const TransferDone = Symbol.for('transferDone');
export const DealModel = Symbol.for('dealModel');
// 用户设置左边的状态数组静态值
export const BasicSetting = Symbol.for('basicSetting');
export const PhoneSetting = Symbol.for('phoneSetting');
export const PasswordSetting = Symbol.for('passwordSetting');
export const InfoSetting = Symbol.for('infoSetting');
// 消息页面单选框切换type静态值
export const messageStatic = {
    INNER: Symbol.for('inner'),
    SYSTEM: Symbol.for('system'),
    SEND: Symbol.for('send')
};
// 消息页面切换站内消息、系统消息、发送消息单选框绑定数组
export const messageRadios = [
    { value: messageStatic.INNER, label: i18n.t('mesHeaderTitle') },
    { value: messageStatic.SYSTEM, label: i18n.t('systemMessage') },
    { value: messageStatic.SEND, label: i18n.t('sendMessage') }
];
// 消息页面获取消息type对象
export const messageType = {
    INNER: 0,
    SYSTEM: 1,
    ADMIN: 2
};
// 上传页面上传状态展示单选框绑定数组
export const uploadStatusArr = [
    // 上传文件
    { name: i18n.t('uploadFile'), value: UploadFile},
    // 传输完成
    { name: i18n.t('transferDone'), value: TransferDone},
    // 处理模型
    { name: i18n.t('dealModel'), value: DealModel}
];
export const SkyboxMaterial = Symbol.for('skyboxM');
export const ImageMaterial = Symbol.for('imageM');
export const VideoMaterial = Symbol.for('videoM');
export const MusicMaterial = Symbol.for('musicM');
export const imageUploadLint = 5 * 1024 * 1024;
export const videoUploadLint = 100 * 1024 * 1024;
export const voiceUploadLint = 20 * 1024 * 1024;
// 上传素材页面素材类型选择单选框绑定数组
export const uploadMaterialTypes = [
    { name: i18n.t('uploadSkybox'), value: SkyboxMaterial, type: 'skybox', title: i18n.t('skyboxLabel') },
    { name: i18n.t('uploadImage'), value: ImageMaterial, type: 'image', title: i18n.t('image.label') },
    { name: i18n.t('uploadVideo'), value: VideoMaterial, type: 'video', title: i18n.t('video.label') },
    { name: i18n.t('uploadMusic'), value: MusicMaterial, type: 'music', title: i18n.t('voice.label') }
];
// vr编辑页面左侧全局设置点击切换的弹框类型
export const vrSettingDialogTypes = {
    BGMUSIC: { type: Symbol.for('bgMusic'), title: i18n.t('bgMusicSetting') },
    AUTHOR: { type: Symbol.for('customAuthor'), title: i18n.t('authorSetting') },
    LOGO: { type: Symbol.for('customLogo'), title: i18n.t('logoSetting') },
    OPENTIP: { type: Symbol.for('openTip'), title: i18n.t('openTip') }
};
export const settingStatusArr = [
    { value: BasicSetting, name: i18n.t('basicSetting'), title: i18n.t('basicTitle') },
    { value: PhoneSetting, name: i18n.t('phoneSetting'), title: i18n.t('phoneTitle') },
    { value: PasswordSetting, name: i18n.t('passwordSetting'), title: i18n.t('passwordTitle') },
    { value: InfoSetting, name: i18n.t('infoSetting'), title: i18n.t('infoTitle') },
];
// 用户列表页
export const TYPEMODEL = 'model';
export const TYPEWEBAR = 'webar';
export const interRecordHref = 'https://beian.miit.gov.cn/'
// 获取文件接口路径
export const image = "/file/image?filename=";
export const video = "/file/video?filename=";
export const music = "/file/voice?filename=";
export const common = "/file/common?filename=";
export const modelUrl = "/file/model?filename=";
export const skyBoxUrl = "/file/skybox?filename=";
// 素材类型,在放置素材和加载素材的时候会使用
export const imgMaterial=0
export const videoMaterial=2
export const audioMaterial=3
export const modelMaterial=4
export const skyBoxMaterial=1
// export const iconMaterial = 4
// http://sanweiyun.tpddns.cn:8100
// http://35.108.52.215:8100
// export let webArUrl = 'https://www.ll3d.com/webar/show/'
export let webArUrl = '/webar/show/'
export let VrShowUrl = 'https://www.ll3d.com/vr/show/id='
// export let globalUrl = "/api1";
export let globalUrl = '/web-api';
export let mapUrl = 'https://restapi.amap.com/v3/config/district?parameters';
export const mapKey = '96c1decce8f7c26581e6e56707b7e9a2';
// export let uploadUrl = "/api2";
export let uploadUrl = '/file-api';
export let storeUrl = "/api3";
export const filePrefix = uploadUrl;
export let storeModel = 'https://store.ll3d.com/fs/model/upload'
export let storeModelDownload = 'https://store.ll3d.com/fs/original/file/'
export let storeGetModel = 'https://store.ll3d.com/fs/download'
export let storeFile = 'https://store.ll3d.com/fs/upload'
export let fileUploadPath = uploadUrl + '/file/upload/';
export let uploadModel = uploadUrl + '/file/upload/model'
export let uploadSkybox=uploadUrl+'/file/upload/skybox'
export let uploadFile = uploadUrl + '/file/upload/common'
export let uploadFaceFile = uploadUrl + '/file/upload/image'
export const hotAddress='./icons/hot'
// export let localUrl = "/api2";
export let localUrl = "/file-api";
export let supportFileExtension=["obj","OBJ","fbx","FBX","stl","STL","gltf","GLTF","glb"]
export let directionalLight="directionalLight";//平行光
export let pointLight="pointLight";//点光源
export let spotLight="spotLight";//聚光灯
export let hemisphereLight="HemisphereLight"//半球光
export let ambientLight="AmbientLight"// 环境光
export let colorDefault='rgb(255,255,255)'
export let intensity=1
export let defaultVector3={
    x:0,
    y:0,
    z:0
}
// 平行光
export const directionalLightPro={
    lightPositionFlag: false,
    type:directionalLight,//灯光类型平行光
    color:colorDefault,// 灯光颜色
    intensity:1,//灯光强度
    position:defaultVector3,// 灯光位置
    castShadow:false,//是否产生阴影
    bias:0,//阴影斜纹,设置的是shadow.bias
    isBindCamera:false,//是否绑定相机
}

// 点光源
export const pointLightPro={
    lightPositionFlag: false,
    type:pointLight,// 点光源
    color:colorDefault,// 灯光颜色
    intensity:1,//光照强度
    position:defaultVector3,// 灯光位置
    decay:1,//衰减量
    castShadow:false,//是否产生阴影
    bias:0,//阴影斜纹,设置的是shadow.bias
    isBindCamera:false,//是否绑定相机
}

// 聚光灯
export const spotLightPro={
    lightPositionFlag: false,
    type:spotLight,// 聚光灯
    color:colorDefault,// 灯光颜色
    intensity:1,//光照强度
    distance:0,//从光源发出光的最大距离，其强度根据光源的距离线性衰减
    decay:1, //沿着光照距离的衰减量。
    angle:0, //光线散射角度，0-90最大为Math.PI/2。
    penumbra:0, // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
    castShadow:false,//是否产生阴影
    bias:0,//阴影斜纹,设置的是shadow.bias
    isBindCamera:false,//是否绑定相机
    position:defaultVector3,// 灯光位置
}

// 半球光
export const hemisphereLightPro={
    lightPositionFlag: false,
    type:hemisphereLight,//半球光
    color :colorDefault,// 天空中发出光线的颜色。 缺省值 0xffffff
    groundColor : colorDefault,//地面发出光线的颜色。 缺省值 0xffffff
    intensity : 1,// (可选参数) 光照强度。 缺省值 1
    isBindCamera:false,//是否绑定相机
    position:defaultVector3// 灯光位置
}

// 环境光
// 场景中的环境光配置信息,只有一个即可
export const ambientLightPro={
    type:ambientLight,//环境光
    color:colorDefault,//颜色的rgb数值。缺省值为 0xffffff。
    intensity:1//光照的强度。缺省值为 1。
}



export function getLightType(type) {
    let name
    switch (type) {
        case directionalLight:
            name = i18n.t("light.directionalLight")
            break
        case pointLight:
            name = i18n.t("light.pointLight")
            break
        case spotLight:
            name = i18n.t("light.spotLight")
            break
        case hemisphereLight:
            name = i18n.t("light.hemisphereLight")
            break
        default:
            name = i18n.t("light.none")
            break
    }
    return name
}

// 光的各项描述
export const description = {
    unsetLightDes: i18n.t("light.unsetLightDes"),
    directionalLightPosition: i18n.t("light.directionalLightPosition"),
    directionalLightDes:  i18n.t("light.directionalLightPosition"),
    pointLightPosition:  i18n.t("light.directionalLightPosition"),
    pointLightDes: i18n.t("light.directionalLightPosition"),
    spotLightPosition:  i18n.t("light.directionalLightPosition"),
    spotLightDes: i18n.t("light.directionalLightPosition"),
    hemisphereLightPosition: i18n.t("light.directionalLightPosition"),
    hemisphereLightDes: i18n.t("light.directionalLightPosition"),
}

// 贴图类型文字
export const mapType = {
	basic: 'basic', // 基本贴图
	specular: 'specular', // 镜面贴图
	emissive: 'emissive', // 高光贴图
	bump: 'bump', // 凹凸贴图
	ao: 'ao', // ao贴图
	light: 'light', // 灯光贴图
	normal: 'normal', // 法线贴图
	displacement: 'displacement', // 位移贴图
	alpha: 'alpha', // 透明贴图
	env: 'env', // 环境贴图
	metalness: 'metalness', // 金属贴图
	roughness: 'roughness' // 粗糙贴图
}

// 所有类型贴图对象
let basic = { // 基本贴图
	map: null,
	color: null,
    basicMapArr: []
}
let specular = { // 镜面贴图
	specularMap: null,
	specular: null,
	shiness: 30,
    specularMapArr: []
}
let emissive = { // 高光贴图
	emissiveMap: null,
	emissive: null,
    emissiveMapArr: [],
	emissiveIntensity: null
}
let bump = { // 凹凸贴图
	bumpMap: null,
    bumpMapArr: [],
	bumpScale: null
}
let ao = { // ao贴图
	aoMap: null,
    aoMapArr: [],
	aoMapIntensity: null
}
let light = { // 灯光贴图
	lightMap: null,
    lightMapArr: [],
	lightMapIntensity: null
}
let normal = { // 法线贴图
	normalMap: null,
    normalMapArr: [],
	normalScale: {
		x: null,
		y: null
	}
}
let displacement = { // 位移贴图
	displacementMap: null,
    displacementMapArr: [],
	displacementScale: null,
	displacementBias: null
}
let alpha = { // 透明贴图
	alphaMap: null,
    alphaMapArr: []
}
let env = { // 环境贴图
	envMapShowType: null,
	envMapTypeSet: null,
	envMap: null,
    envMapArr: [],
	combine: null,
	reflectivity: null,
	refactionRation: null
}
let metalness = { // 金属贴图
	metalnessMap: null,
    metalnessMapArr: [],
	metalness: null
}
let roughness = { // 粗糙贴图
	roughnessMap: null,
    roughnessMapArr: [],
	roughness: null
}
// 全贴图类型对象用来做过滤
// 默认phong材质对象
export const defaultPhong = {
  type: 'phong',
  surface: null, // 渲染表面
  opacity: null, // 不透明度
  basic,
  specular,
  emissive,
  bump,
  ao,
  light,
  normal,
  displacement,
  alpha,
  env
}

// 默认物理材质对象
export const defaultNormal = {
	type: 'normal',
	surface: null, // 渲染表面
    opacity: null, // 不透明度
	basic,
	emissive,
	bump,
	metalness,
	roughness,
	ao,
	light,
	normal,
	displacement,
	alpha,
	env
}

// 默认lambert材质对象
export const defaultLambert = {
	type: 'lambert',
	surface: null, // 渲染表面
    opacity: null, // 不透明度
	basic,
	specular,
	emissive,
	ao,
	light,
	alpha,
	env
}

export const transformLocation = function (str) {

}

// 默认模型渲染页面侧边栏Scene场景obj常规对象
export const sceneObj = {
    // 位置
    position: { x: 0, y: 0, z: 0 },
    // 旋转
    rotation: { x: 0, y: 0, z: 0 },
    // 比例
    scale: { x: 0, y: 0, z: 0}
};
// 默认模型渲染页面侧边栏Scene场景camera相机对象
export const sceneCamera = {
    // 广角
    fov: 0,
    // 放大倍数
    max: 1,
    // 缩小倍数
    min: 1
};
// 默认模型渲染页面侧边栏Scene场景全景雾化fogPro对象
export const sceneFogPro = {
    // 雾颜色
    color: '#000',
    // 雾浓度
    density: 0
};
// 默认模型渲染页面侧边栏Scene场景背景对象
export const sceneBg = {
    // 背景类型，0为全景背景图，1为图片背景图
    type: 1,
    url: ''
};
// 默认渲染场景雾属性
export const defaultFog={
    color: "0xffffff",
    density: 0
}

// 判断请求的图片src，正则匹配是网络图片还是后端图片
export function isNetworkImg(src) {
    return /^http(s)?/.test(src);
}
