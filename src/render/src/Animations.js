import * as Three from "three";

/**
 * 模型动画相关,不需要封装单例模式的threejs的mixer
 */
function Animation(model3d) {
    this.model3d=model3d// 模型对象

    this.animations=[]// 模型的动画
    this.names=[]// 所有动画的名称
    this.actions = {}; // 所有动画
    this.mixer=null;
    this.activeAction=null// 当前要播放的动画
    this.getAnimation=function (){
        this.animations=this.model3d.animations
        if(this.animations.length!==0) {

            this.mixer = new Three.AnimationMixer(this.model3d);
            for (let i = 0; i !== this.animations.length; ++i) {
                let clip = this.animations[i];
                const name = clip.name
                this.names.push(name)
                this.actions[clip.name] = this.mixer.clipAction(clip);
            }
        }

    }
    this.getActionByName=function (name){
        if(this.activeAction!=null){
            this.activeAction.stop ()
        }
        this.activeAction = this.actions[name];
        this.activeAction.play()
    }
}
export {Animation}
