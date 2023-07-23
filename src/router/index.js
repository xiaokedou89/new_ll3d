import VueRouter from 'vue-router'
import Vue from 'vue'
import store from '@/store/index.js';
import { getUser, getToken } from '@/utils/storage.js';
import { i18n } from '@/assets/languages/i18n.js';
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//
const whiteList = [];

const routes = [
  // 登录
  {
    name: 'login',
    path: '/login',
		meta: { userSystem: false },
    component: () => import('@/views/login/login.vue')
  },
  // 注册
  {
    name: 'regin',
    path: '/regin',
		meta: { userSystem: false },
    component: () => import('@/views/regin/regin.vue')
  },
  {
    path: '/',
		meta: { userSystem: false },
    redirect: '/home'
  },
  {
    path: '/webar/show',
    name: 'show',
    meta: { userSystem: true },
    component: () => import('@/views/webar/index.vue')
  },
  {
    path: '/home',
    redirect: '/first',
		meta: { userSystem: false },
    component: () => import('@/views/home/index.vue'),
    children: [
      // 首页
      {
        path: '/first',
        name: 'first',
				meta: { userSystem: false, title: i18n.t('pageTitle.home') },
        component: () => import('@/views/home/first/first.vue')
      },
      // 模型列表
      {
        path: 'modelList',
        name: 'modelList',
				meta: { userSystem: false },
        component: () => import('@/views/home/modelList/modelList.vue')
      },
      // 标签模型列表
      {
        path: 'tagModelList',
        name: 'tagModelList',
        meta: { userSystem: false },
        component: () => import('@/views/home/tagModelList/tagModelList.vue')
      },
      // 模型列表详情页
      {
        path: 'modelListDetail',
        name: 'modelListDetail',
				meta: { userSystem: false },
        component: () => import('@/views/home/modelListDetail/modelListDetail.vue')
      },
      // webAR列表
      {
        path: 'webArList',
        name: 'webArList',
				meta: { userSystem: false },
        component: () => import('@/views/home/webArList/webArList.vue')
      },
      // 全景列表
      {
        path: 'arList',
        name: 'arList',
				meta: { userSystem: false },
        component: () => import('@/views/home/arList/arList.vue')
      },
      // 素材列表
      {
        path: 'materialList',
        name: 'materialList',
				meta: { userSystem: true },
        component: () => import('@/views/home/materialList/materialList.vue')
      },
      {
        path: 'arListDetail',
        name: 'arListDetail',
        component: () => import('@/views/home/arListDetail/arListDetail.vue')
      },
      // 上传模型
			{
        path: 'updataModel',
        name: 'updataModel',
				meta: { userSystem: true, title: i18n.t('uploadModel') },
        component: () => import('@/views/home/updataModel/updataModel.vue')
      },
      // 上传全景
      {
        path: 'updataVR',
				name: 'updataVR',
				meta: { userSystem: true, title: i18n.t('uploadModelPanorama') },
				component: () => import('@/views/home/updataVR/updataVR.vue')
      },
      // {
      //   path: 'updataVR-old',
      //   name: 'updataVR-old',
      //   component: () => import('@/views/home/updataVR/updataVR-old.vue')
      // },
      // 上传webAr
      {
      	path: 'updataWebAr',
      	name: 'updataWebAr',
				meta: { userSystem: true, title: i18n.t('uploadWebAr') },
      	component: () => import('@/views/home/updataWebAr/updataWebAr.vue')
      },
      // 上传素材
      {
        path: 'updataMaterial',
        name: 'updataMaterial',
				meta: { userSystem: true, title: i18n.t('uploadMaterial') },
        component: () => import('@/views/home/uploadMaterial/uploadMaterial.vue')
        // component: () => import('@/views/home/updataMaterial/updataMaterial.vue')
        // component: () => import('@/views/home/uploadMaterial/uploadMaterial.vue')
      },
      // new上传素材
      {
        path: 'materialUpdata',
        name: 'materialUpdata',
        meta: { userSystem: true, title: i18n.t('uploadMaterial') },
        component: () => import('@/views/home/uploadMaterial/uploadMaterial.vue')
      },
      {
        path: 'newMaterial',
        name: 'newMaterial',
        component: () => import('@/views/home/uploadMaterial/uploadMaterial.vue')
      },
      // 所有用户列表页
      {
        path: 'allUser',
        name: 'allUser',
        // meta: { userSystem: true },
        component: () => import('@/views/home/allUser/allUser.vue')
      },
      // 用户设置
      {
        path: 'userSetting',
        name: 'userSetting',
        meta: { userSystem: true },
        component: () => import('@/views/home/userSetting/userSetting.vue')
      },
      // 用户模型页
      {
        path: 'userList',
        name: 'userList',
        meta: { userSystem: true },
        component: () => import('@/views/home/userList/userList.vue')
      },
      // 用户全景列表页
      {
        path: 'userArList',
        name: 'userArList',
        meta: { userSystem: true },
        component: () => import('@/views/home/userArList/userArList.vue')
      },
      // 用户编辑全景页面
      {
        path: 'vrSetting',
        name: 'vrSetting',
        meta: { userSystem: true },
        component: () => import('@/views/home/vrSetting/vrSetting.vue')
      },
      // 用户消息页
      {
        path: 'message',
        name: 'message',
        meta: { userSystem: true },
        component: () => import('@/views/home/message/message.vue')
      },
      // 用户消息详情页
      {
        path: 'messageDetail',
        name: 'messageDetail',
        meta: { userSystem: true },
        component: () => import('@/views/home/messageDetail/messageDetail.vue')
      },
      // 网站信息页面
      {
        path: 'info',
        name: 'info',
        meta: { userSystem: false },
        component: () => import('@/views/home/info/info.vue')
      }
      // {
      //   path: 'updataSkybox',
      //   name: 'updataSkybox',
			// 	meta: { userSystem: true },
      //   component: () => import('@/views/home/updataSkybox/updataSkybox.vue')
      // },
      // {
      //   path: 'panList',
      //   name: 'panList',
      //   component: () => import('@/views/home/panList/panList.vue')
      // },
      // {
      //   path: 'skyBoxList',
      //   name: 'skyBoxList',
      //   component: () => import('@/views/home/skyBoxList/skyBoxList.vue')
      // },
    ]
  },
  // 模型详情页面
  {
    path: '/modelDetail',
    name: 'modelDetail',
    meta: { userSystem: false },
    component: () => import('@/views/modelDetail/modelDetail.vue')
  },
  // 模型相关路由
  {
    path: '/model',
    redirect: '/model/:id',
    component: () => import('@/views/model/index.vue'),
    children: [
        {
          path: '/model/editor',
					meta: { userSystem: true },
          component: () => import('@/views/model/editor.vue')
        },
        {
          path: '/model/:id',
          component: () => import('@/views/model/model.vue')
        }
    ]
  },
  // 全景-全景模型编辑器
  {
    name: 'VrModelEditor',
    path: '/vrmodelEditor',
		meta: { userSystem: true },
    component: () => import('@/views/vrmodelEditor/vrmodelEditor.vue')
  },
  // 全景-天空盒编辑器
  {
    name: 'panEditor',
    path: '/panEditor',
		meta: { userSystem: false },
    component: () => import('@/views/panorama/editor.vue')
  }
]

const result = routes.reduce(function (prev, item) {
  prev.push(item);
  if (Array.isArray(item.children)) {
    prev = prev.concat(item.children);
  }
  return prev;
},[]);

const router = new VueRouter({
  mode: 'history',
  routes
})
// 全局路由守卫
router.beforeEach(async(to, from, next) => {
  // 修改页面title标题，如页面需要单设标题使用to.meta.title或者页面加载后的钩子里改document.title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = i18n.t('pageTitle.main')
  }
	// 获取全局用户系统配置
  let isUserSystem = getUser();
	const hasToken = getToken();
  if (isUserSystem === null) {
    try {
      await store.dispatch('getAppConfig');
      isUserSystem = getUser();
    } catch (error) {
      isUserSystem = '0';
    }
  }
  if (isUserSystem === undefined || !+isUserSystem) {
    // console.log('has no UserSystem');
		// 没有用户系统直接跳转
		next();
  } else {
		if (!to.meta.userSystem) {
      // console.log('has userSystem , router is not need userSystem')
			// 当前路由不需要用户系统直接跳转
			next();
		} else {
      // console.log('need userSystem')
			// 当前路由需要用户系统，判断用户是否登录有无token
			if (hasToken) {
				// token存在，判断路由是否是登录页面
				if (to.path === '/login') {
					next({path: '/'});
				} else {
					// 不是登录页直接跳
					next();
				}
			} else {
        // console.log('router BeforeEach save redirect');
				// 没有token，用户未登录,重定向到login保存路径
				next(`/login?redirect=${to.path}`);
			}
		}
	}
  next();
});

export default router
