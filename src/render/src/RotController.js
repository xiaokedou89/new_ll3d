import
{
    Object3D, Vector2, Vector3

} from "three";


class RotControls {
    object=null;//具体要操作的对象
    enabled=true;// 是否启用
    enabledPan=true;// 是否启用平移
    enabledRotate=true;// 是否启用旋转
    enabledZoom=true; // 是否启用放大与缩小
    //object
    constructor( domElement) {
        //错误检测
        // if (object === undefined) console.warn("RotControls: 传入对象不能为空");
        // if (!(object instanceof Object3D)) console.warn("RotControls: 传入对象需要是一个有效的Object3D对象 ")
        if (domElement === undefined) console.warn("RotControls: 没有选择监听的dom元素");
        //初始化和变量声明
        // this.object = object;
        this.domElement = domElement;
        this.lastPoint1 = new Vector2();
        this.lastPoint2 = new Vector2();
        //参数配置
        this.panSpeed = 100
        this.rotateSpeed = 10;

        //预处理



        this.domElement.style.touchAction = 'none';

        //函数声明
        //获取touch位置的相对坐标
        this.getLocalPos = (e, index) => {
            let br = this.domElement.getBoundingClientRect();
            return new Vector2(e.targetTouches[index].clientX - br.left, e.targetTouches[index].clientY - br.top)
        }

        //监听事件

        ////监听触摸事件
        this.touchstart = (e) => {
            e.preventDefault()
            switch (e.targetTouches.length) {
                case 1:
                    this.lastPoint1.set(this.getLocalPos(e, 0).x, this.getLocalPos(e, 0).y)
                    break;
                case 2:
                    this.lastPoint1 = (this.getLocalPos(e, 0))
                    this.lastPoint2 = (this.getLocalPos(e, 1))
                    break;
            }
        };
        this.touchmove = (e) => {
            e.preventDefault()
            if (e.targetTouches.length === 1) {
                let delta = this.lastPoint1.sub(this.getLocalPos(e, 0))
                this.inputRotation(delta.x, delta.y,0);
                this.lastPoint1 = this.getLocalPos(e, 0)

            } else if (e.targetTouches.length === 2) {
                let lastCenter = new Vector2().addVectors(this.lastPoint1, this.lastPoint2).multiplyScalar(0.5)
                let lastDistance = this.lastPoint1.distanceTo(this.lastPoint2);
                let lastDir = this.lastPoint2.sub(this.lastPoint1)
                let lastAngle = Math.atan2(lastDir.y, lastDir.x)

                let point1 = this.getLocalPos(e, 0);
                let point2 = this.getLocalPos(e, 1);
                let nowCenter = new Vector2().addVectors(point1, point2).multiplyScalar(0.5)
                let nowDistance = point1.distanceTo(point2);
                let nowDir = point2.sub(point1)
                let nowAngle = Math.atan2(nowDir.y, nowDir.x)

                let offset = nowCenter.sub(lastCenter)

                this.inputScale(nowDistance / lastDistance)
                this.inputRotation(0, 0, nowAngle - lastAngle)
                this.inputPosition(offset.x, offset.y)


                this.lastPoint1 = this.getLocalPos(e, 0)
                this.lastPoint2 = this.getLocalPos(e, 1)

            }
        };
        this.touchend = (e) => {
            e.preventDefault()
            switch (e.targetTouches.length) {
                case 1:
                    this.lastPoint1.set(this.getLocalPos(e, 0).x, this.getLocalPos(e, 0).y)
                    break;
                case 2:
                    this.lastPoint1 = (this.getLocalPos(e, 0))
                    this.lastPoint2 = (this.getLocalPos(e, 1))
                    break;
            }
        };
        ////监听鼠标事件
        this.mousedown = (e) => {
            switch (e.buttons) {
                case 1:
                    this.lastPoint1.set(e.offsetX, e.offsetY)
                    if (e.ctrlKey) {
                        //Ctrl加左键

                    } else {
                        //左键
                    }
                    break;
                //右键
                case 2:
                    this.lastPoint1.set(e.offsetX, e.offsetY)
                    break;
                //中键
                case 4:
                    break;
            }
        }
        this.mouseup = (e) => {
        }
        this.mousemove = (e) => {
            switch (e.buttons) {
                case 1:
                    if (e.ctrlKey) {//Ctrl加左键
                        this.lastPoint2.set(this.domElement.clientWidth / 2, this.domElement.clientHeight / 2);

                        let lastDir = this.lastPoint1.sub(this.lastPoint2);
                        let nowDir = new Vector2(e.offsetX, e.offsetY).sub(this.lastPoint2);
                        let lastAngle = Math.atan2(lastDir.y, lastDir.x)
                        let newAngle = Math.atan2(nowDir.y, nowDir.x)
                        let delta = newAngle - lastAngle;

                        this.inputRotation(0, 0, delta)
                    } else {//左键
                        let delta = this.lastPoint1.sub(new Vector2(e.offsetX, e.offsetY))
                        // console.log('控制旋转')
                        this.inputRotation(delta.x, delta.y,0);

                    }
                    this.lastPoint1.set(e.offsetX, e.offsetY)
                    break;
                //右键
                case 2:
                    // eslint-disable-next-line no-case-declarations
                    let delta = new Vector2(e.offsetX, e.offsetY).sub(this.lastPoint1)
                    // console.log('rot')
                    this.inputPosition(delta.x, delta.y)

                    this.lastPoint1.set(e.offsetX, e.offsetY)
                    break;
                //中键
                case 4:
                    break;
            }

        }
        this.onmousewheel = (e) => {
            if (this.enabledZoom) {
                let delta = e.deltaY > 0 ? -1 : 1;
                this.inputScale(delta * 0.1 + 1)
            }
        }




        ////交互函数
        this.inputRotation = (x, y, z) => {
            if(this.enabledRotate) {
                // console.log('rotate')
                this.object.rotateOnWorldAxis(new Vector3(0, 1, 0), -x / 100 * this.rotateSpeed)
                this.object.rotateOnWorldAxis(new Vector3(1, 0, 0), -y / 100 * this.rotateSpeed)
                this.object.rotateOnWorldAxis(new Vector3(0, 0, 1), -z)
            }
        }
        this.inputPosition = (x, y) => {
            if(this.enabledPan) {
                // console.log('pan')
                this.object.translateOnAxis(new Vector3(1, 0, 0), (x / 100) * this.panSpeed)
                this.object.translateOnAxis(new Vector3(0, 1, 0), (-y / 100) * this.panSpeed)
            }
        }
        this.inputScale = (delta) => {
            if (this.enabledZoom) {
                // console.log('zoom')
                this.object.scale.multiplyScalar(delta)
            }
        }


    }
    // Set current object
    attach( object ) {
        if(this.enabled) {
            this.object = object;
            this.addEventListener()
        }
        return this;

    }

    // Detatch from object
    detach() {
        if(this.enabled) {
            this.object = undefined;
            // this.visible = false;
            // this.axis = null;
            ////绑定dom事件必须有操作对象才可以进行操作
            this.removeEventListener()
        }
        return this;

    }
    addEventListener(){
        // 错误检测
        if (this.object === undefined) console.warn("RotControls: 传入对象不能为空");
        if (!(this.object instanceof Object3D)) console.warn("RotControls: 传入对象需要是一个有效的Object3D对象 ")
        ////绑定dom事件必须有操作对象才可以进行操作
        this.domElement.addEventListener("touchstart", this.touchstart);
        this.domElement.addEventListener("touchmove", this.touchmove);
        this.domElement.addEventListener("touchend", this.touchend);
        this.domElement.addEventListener("mousedown", this.mousedown);
        this.domElement.addEventListener("mousemove", this.mousemove);
        this.domElement.addEventListener("mouseup", this.mouseup);
        this.domElement.addEventListener("wheel", this.onmousewheel)
    }
    removeEventListener(){
        ////绑定dom事件必须有操作对象才可以进行操作
        this.domElement.removeEventListener("touchstart", this.touchstart);
        this.domElement.removeEventListener("touchmove", this.touchmove);
        this.domElement.removeEventListener("touchend", this.touchend);
        this.domElement.removeEventListener("mousedown", this.mousedown);
        this.domElement.removeEventListener("mousemove", this.mousemove);
        this.domElement.removeEventListener("mouseup", this.mouseup);
        this.domElement.removeEventListener("wheel", this.onmousewheel)
    }
    changeEnable(enabled){
        this.enabled=enabled
        if (enabled){

            this.addEventListener()
        }else{
            this.removeEventListener()
        }
    }
}

export {RotControls}
