import * as _Ammo from "ammo.js"
// 初始化Ammo对象
let Ammo=null
class AmmoHelper{

    static Init(callback = ()=>{}){
      _Ammo().then((ammo)=>{
          Ammo = ammo;
          console.log('init complete')
          callback();
      });
    }
}
export {Ammo,AmmoHelper}
