import * as THREE from 'three'
// import Component from '../../Component'
import Input from '@/render/components/Input'
import {Ammo} from '@/render/ammo/AmmoHelper'
import {createBody,generatePhysicsBody} from '@/render/components/physicsUtils'
// 第一人称控制器
const DISABLE_DEACTIVATION = 4;
export default class PlayerControls{
    constructor(camera,position,world,scene){
        // super();
        this.name = 'PlayerControls';
        this.camera = camera;

        this.timeZeroToMax = 0.08;
        this.center=position
        this.maxSpeed = 3.0;
        this.speed = new THREE.Vector3();
        this.acceleration = this.maxSpeed / this.timeZeroToMax;
        this.decceleration = -3.0;

        this.mouseSpeed = 0.002;
        this.isLocked = false;

        this.angles = new THREE.Euler();
        this.pitch = new THREE.Quaternion();
        this.yaw = new THREE.Quaternion();
        this.jumpVelocity = 3;
        this.yOffset = 0.5;
        this.tempVec = new THREE.Vector3();
        this.moveDir = new THREE.Vector3();
        this.xAxis = new THREE.Vector3(1.0, 0.0, 0.0);
        this.yAxis = new THREE.Vector3(0.0, 1.0, 0.0);
        this.physicsBody =null // 物理刚体
        this.body=null
        this.parent=null // 渲染的物体
        this.world=world// 物理世界
        this.scene=scene
        this.canJump = false;
        this.up = new Ammo.btVector3(0,1,0);
        this.tempUVec = new Ammo.btVector3();
        this._prevMouseX = 0;
        this._prevMouseY = 0;
        this.temoPosition=null;// 使用tween移动相机后的相机位置
        this.tempQuaternion=null;// 使用tween移动相机后的相机旋转位置
        this.flag=false;// 控制刚体移动的锁
        this.init(this.center)
        this.Initialize()
    }
    // 在指定位置上创建刚体，看向指定方向
    init(position){
        this.initMesh(position)
    }
    initMesh(position,quaterion){
        // Box
		const geometry = new THREE.BoxBufferGeometry(1, 1,1)
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
		this.parent = new THREE.Mesh(geometry, material)
		this.parent.name="mesh"
		this.parent.position.set(position.x,position.y,position.z)
        this.parent.visible=false
        this.transform = new Ammo.btTransform();
        this.zeroVec = new Ammo.btVector3(0.0, 0.0, 0.0);
        this.angles.setFromQuaternion(this.parent.quaternion);
        this.scene.add(this.parent)
        this.initPhysicsBody()
    }
    initPhysicsBody(){
                    const height = 1,
                    radius = 0.3;
                    let mass=0.5;
            const transform = new Ammo.btTransform();
            transform.setIdentity();
            const pos = this.parent.position;
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            const motionState = new Ammo.btDefaultMotionState(transform);
            const shape=new Ammo.btBoxShape(new Ammo.btVector3( 0.5,  0.5, 0.5));
            const localInertia = new Ammo.btVector3(0,0,0);
            const bodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
            this.physicsBody = new Ammo.btRigidBody(bodyInfo);
            this.physicsBody.setFriction(0);
            this.physicsBody.setActivationState(DISABLE_DEACTIVATION);
            this.world.addRigidBody(  this.physicsBody);
        //    this.UpdateRotation()
    }
    
    // 创建刚体
    Initialize(){
        Input.AddMouseDownListner(this.onMouseDown)
        Input.AddMouseUpListner(this.OnMouseUp)
    
        document.addEventListener('pointerlockchange', this.OnPointerlockChange)
    }
    OnMouseUp=(event)=>{
        // 旋转完成
        Input.removeMouseMoveListener(this._OnMouseMove)
    }
    onMouseDown=(event)=>{
        if(this.flag){
           // this.world.setGravity( new Ammo.btVector3( 0.0, -9.8, 0.0 ) );
            this.changePhysics(this.temoPosition,this.tempQuaternion);            
        }
        Input.AddMouseMoveListner(this._OnMouseMove);
        this._prevMouseX = event.screenX;
        this._prevMouseY = event.screenY;
    }
    _OnMouseMove=(event)=>{
        let movementX = this._prevMouseX ? event.screenX - this._prevMouseX : 0;
        let movementY = this._prevMouseY ? event.screenY - this._prevMouseY : 0;
        this.angles.y -= movementX * this.mouseSpeed;
        this.angles.x -= movementY * this.mouseSpeed;

        this.angles.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.angles.x));
        this.UpdateRotation();
        this._prevMouseX = event.screenX;
        this._prevMouseY = event.screenY;
    }

    UpdateRotation(){
        this.pitch.setFromAxisAngle(this.xAxis, this.angles.x);
        this.yaw.setFromAxisAngle(this.yAxis, this.angles.y);
        this.parent.quaternion.multiplyQuaternions(this.yaw, this.pitch).normalize();
        this.camera.quaternion.copy(this.parent.quaternion);
    }

    Accelarate = (direction, t) => {
        const accel = this.tempVec.copy(direction).multiplyScalar(this.acceleration * t);
        this.speed.add(accel);
        this.speed.clampLength(0.0, this.maxSpeed);
    }

    Deccelerate = (t) => {
        const frameDeccel = this.tempVec.copy(this.speed).multiplyScalar(this.decceleration * t);
        this.speed.add(frameDeccel);
    }
    getForward(){
        let temp1=Input.GetKeyDown("KeyS") - Input.GetKeyDown("KeyW");
        let temp2=Input.GetKeyDown("ArrowDown")-Input.GetKeyDown("ArrowUp");
        let temp3=Input._OnMouseWheel()
        if(temp1!=0){
            return temp1;
        }else if(temp2!=0){
            return temp2
        }else if(temp3!=0){
            return temp3
        }else{
            return 0;
        }
    }
    getRight(){
        let temp1=Input.GetKeyDown("KeyD") - Input.GetKeyDown("KeyA");
        let temp2=Input.GetKeyDown("ArrowRight")- Input.GetKeyDown("ArrowLeft")
        if(temp1!=0){
            return temp1;
        }else if(temp2!=0){
            return temp2
        }else{
            return 0;
        }
    }
    Update(t){
             let forwardFactor=this.getForward()
             if((forwardFactor!=0)&&(this.flag)){
                this.world.setGravity( new Ammo.btVector3( 0.0, -9.8, 0.0 ) );
                this.changePhysics(this.temoPosition,this.tempQuaternion)
                
            }
            else if((forwardFactor!=0)){
                this.world.setGravity( new Ammo.btVector3( 0.0, -9.8, 0.0 ) );
            }
                 // 控制旋转
                 if(Input.GetKeyDown("KeyD")||Input.GetKeyDown("ArrowRight")){// 摁下d||摁下右键
                    this.yaw.setFromAxisAngle(this.yAxis,  this.angles.y-=0.01);
                    this.parent.quaternion.multiplyQuaternions(this.yaw, this.pitch).normalize();
                    this.camera.quaternion.copy(this.parent.quaternion);
                }
                if(Input.GetKeyDown("KeyA")||Input.GetKeyDown("ArrowLeft")){// 摁下d||摁下右键
                    this.yaw.setFromAxisAngle(this.yAxis,  this.angles.y+=0.01);
                    this.parent.quaternion.multiplyQuaternions(this.yaw, this.pitch).normalize();
                    this.camera.quaternion.copy(this.parent.quaternion);
                }
            if(!this.flag){
                    let rightFactor=0.0
                    const direction = this.moveDir.set(rightFactor, 0.0, forwardFactor).normalize();
                    const velocity = this.physicsBody.getLinearVelocity();
                    if(Input.GetKeyDown('Space') && this.canJump){
                        velocity.setY(this.jumpVelocity);
                        this.canJump = false;
                    }
                    
                    this.Deccelerate(t);
                    this.Accelarate(direction, t);
                    const moveVector = this.tempVec.copy(this.speed);
                    moveVector.applyQuaternion(this.yaw);
                    velocity.setX(moveVector.x);
                    velocity.setZ(moveVector.z);
                    this.physicsBody.setLinearVelocity(velocity);
                    this.physicsBody.setAngularVelocity(this.zeroVec);
                    const ms = this.physicsBody.getMotionState();
                    if(ms){
                        ms.getWorldTransform(this.transform);
                        const p = this.transform.getOrigin();
                        this.parent.position.set(p.x(),p.y(),p.z());
                        this.camera.position.set(p.x(), p.y() + this.yOffset, p.z());
                    }
                    
        }
    }
    changePhysics(pos,quaterion){
        const ms = this.physicsBody.getMotionState();
        if(ms){
            const transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            this.parent.position.set(pos.x,pos.y,pos.z);
            this.angles.setFromQuaternion(quaterion);
            if((quaterion.x==0)&&(quaterion.y==1)&&(quaterion.z==0)){
                this.angles=new THREE.Euler(-0,-3.141592653589793,-0,"XYZ")
            }
            this.physicsBody.setWorldTransform(transform)
            ms.setWorldTransform(transform)

            this.physicsBody.setLinearVelocity(new Ammo.btVector3(0.0, 0.0, 0.0));
            this.physicsBody.setAngularVelocity(new Ammo.btVector3(0.0, 0.0, 0.0));
            this.physicsBody.clearForces();
            this.UpdateRotation()
            this.flag=false
        }
    }
    QueryJump(){
        const dispatcher = this.world.getDispatcher();
        const numManifolds = dispatcher.getNumManifolds();

        for ( let i = 0; i < numManifolds; i++ ) {
            const contactManifold = dispatcher.getManifoldByIndexInternal( i );
            const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
            const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

            if(rb0 != this.physicsBody && rb1 != this.physicsBody){
                continue;
            }

            const numContacts = contactManifold.getNumContacts();

            for ( let j = 0; j < numContacts; j++ ) {
                const contactPoint = contactManifold.getContactPoint( j );

                const normal = contactPoint.get_m_normalWorldOnB();
                this.tempUVec.setValue(normal.x(),normal.y(),normal.z());

                if(rb1 == this.body){
                    this.tempUVec.setValue(-this.tempUVec.x(),-this.tempUVec.y(),-this.tempUVec.z());
                }

                const angle = this.tempUVec.dot(this.up);
                this.canJump = angle > 0.5;

                if(this.canJump){
                    return;
                }
            }
        }
    }

    PhysicsUpdate(){
         this.QueryJump();
    }
}
