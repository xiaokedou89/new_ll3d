<template>
    <div id="content" ref="content" style="height:100%;width: 100%;position: absolute;">
    </div>
</template>
<script>
  import * as THREE from "three"
import * as CANNON from "cannon" // 引入物理引擎
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import {
        AmbientLight,
        Scene,
        Group,
        PerspectiveCamera,
        Mesh,
        WebGLRenderer,
        TextureLoader,
        PlaneGeometry,
        BoxGeometry,
        Sprite,
        SphereGeometry,
        DoubleSide,
        SpriteMaterial,
        MeshPhongMaterial,
    } from 'three'
    export default {
        data () {
            return {
                content: '',
                scene: '',
                camera: '',
                Controls: '',
                renderer: '',
                ambientLight: '',
                sprite: '',
                spriteMap: new TextureLoader().load('./static/image/sprite.png'),
                group: '',
                sun: '',
                sunMap: new TextureLoader().load('./static/image/sun.png'),
                skillsMap: new TextureLoader().load('./static/image/allSkills.png'),
                world: new CANNON.World(),
                sphereBody: '',
                floorMesh: '',
                earthMap: new TextureLoader().load('./static/image/earth.jpg'),
                earth: ''
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                console.log('init test')
                this.initScene()
                this.initCamera()
                this.initLight()
                this.initRenderer()
                //   this.initControls()
                this.initfloor()
                this.initSprite()
                this.initCannon()
                this.initAxesHelper()
                this.initEarth()
                this.initCannonWall()
                this.render()
                this.myKeyup()

            },
            //键盘事件 移动地球模型   待优化  //锁定视角下无问题，开放视角无法判断移动方向
            myKeyup () {
                document.onkeydown = (e) => {
                    if (e.repeat) return //每次按键只触发一次方法，长时间按下不会连续触发
                    if (e.key == 'w') {
                        this.sphereBody.velocity.set(-50, 0, 0)
                    }
                    else if (e.key == 's') {
                        this.sphereBody.velocity.set(50, 0, 0)
                    }
                    else if (e.key == 'a') {
                        this.sphereBody.velocity.set(0, 0, 50)
                    }
                    else if (e.key == 'd') {
                        this.sphereBody.velocity.set(0, 0, -50)
                    }
                    //跳跃方法，禁止连跳🈲
                    else if (e.key == ' ') {
                        if (this.sphereBody.position.y <= 5) this.sphereBody.velocity.set(0, 50, 0)
                    }
                    //重置模型位置             待优化  //有惯性阻止不了
                    else if (e.key == 'q') {
                        this.sphereBody.position.set(0, 5, 0)
                        this.sphereBody.velocity.set(0, 0, 0)
                    }
                }
            },
            //初始化相机
            initCamera () {
                this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
                //   this.camera.position.set(0, 30, 500)
                const helper = new THREE.CameraHelper(this.camera);
                //   this.scene.add(helper);
            },
            //初始化相机控制器
            initControls () {
                this.Controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.Controls.enableRotate = false
                this.Controls.enablePan = false
                this.Controls.enableZoom = false
                //   this.controls.autoRotate = true;
                //   this.controls.enableKeys = true;
            },
            // 初始化地面
            initfloor () {
                let grid = new TextureLoader().load('./static/image/grid.webp')
                grid.wrapS = THREE.RepeatWrapping
                grid.wrapT = THREE.RepeatWrapping
                let floorMesh = new PlaneGeometry(1000, 1000)
                let skills = new PlaneGeometry(100, 100)
                let material = new THREE.MeshLambertMaterial({
                    color: 0xf7f7f7,
                    map: grid,
                    side: DoubleSide,
                    transparent: true,
                    opacity: 0.1
                });
                let material1 = new THREE.MeshLambertMaterial({
                    map: this.skillsMap,
                    side: DoubleSide,
                });
                this.floorMesh = new Mesh(floorMesh, material)
                let mesh1 = new Mesh(skills, material1)
                this.scene.add(this.floorMesh)
                this.scene.add(mesh1)
                this.floorMesh.rotateX(-Math.PI / 2);
                mesh1.rotateX(-Math.PI / 2);
                mesh1.position.set(0, 0.01, 0)
            },
            // 初始化灯光
            initLight () {
                this.ambientLight = new AmbientLight(0xffffff, 1)
                this.scene.add(this.ambientLight)
            },
            //初始化场景
            initScene () {
                this.scene = new Scene()
                let box = new SpriteMaterial({
                    map: this.sunMap
                })
                this.sun = new Sprite(box)
                //太阳精灵图对象
                this.scene.add(this.sun)
                this.sun.position.set(-30, 50, -80)
                this.sun.scale.set(20, 20, 1)
                //墙壁边界对象
                let rlWall = new BoxGeometry(200, 5, 0.1)
                let baWall = new BoxGeometry(0.1, 5, 200)
                let wallMaterial = new MeshPhongMaterial({
                    map: this.sunMap
                })
                let rightWallMesh = new Mesh(rlWall, wallMaterial), leftWallMesh = new Mesh(rlWall, wallMaterial) //左右墙壁
                let beforeWallMesh = new Mesh(baWall, wallMaterial), afterWallMesh = new Mesh(baWall, wallMaterial) //前后墙壁
                this.scene.add(rightWallMesh, leftWallMesh, beforeWallMesh, afterWallMesh)
                rightWallMesh.position.set(0, 0, -100)
                leftWallMesh.position.set(0, 0, 100)
                beforeWallMesh.position.set(100, 0,)
                afterWallMesh.position.set(-100, 0,)
            },
            // 坐标系辅助线
            initAxesHelper () {
                let AxesHelper = new THREE.AxesHelper(500);
                this.scene.add(AxesHelper);
            },
            // 初始化星星精灵对象
            initSprite () {
                //创建组对象
                this.group = new Group()
                //循环制造1000只精灵
                for (let i = 0; i < 1000; i++) {
                    let spriteMaterial = new SpriteMaterial({
                        //   color: 0x000000,
                        map: this.spriteMap
                    })
                    this.sprite = new Sprite(spriteMaterial)
                    this.group.add(this.sprite)
                    // 控制精灵缩放
                    this.sprite.scale.set(0.2, 0.2, 1)
                    //精灵位置随机
                    let x = Math.random() - 0.5;
                    let y = Math.random() - 0.5;
                    let z = Math.random() - 0.5;
                    this.sprite.position.set(-300 * x, -300 * y, -300 * z)

                }
                this.scene.add(this.group)
            },
            // 初始化渲染对象
            initRenderer () {
                this.renderer = new WebGLRenderer({
                    antialias: true
                })
                this.renderer.setClearColor(0xffffff,1.0);

                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.content = this.$refs.content
                this.renderer.shadowMapEnabled = true
                this.content.appendChild(this.renderer.domElement)
            },
            //渲染方法
            render () {
                this.world.step(1 / 60);
                requestAnimationFrame(this.render); //重复执行渲染方法
                //让星空旋转
                this.group.rotation.x += 0.001
                this.group.rotation.y += 0.001
                this.sun.rotation.x += 0.001
                //渲染场景和相机
                this.renderer.render(this.scene, this.camera);
                console.log(this.sphereBody.position)
                this.camera.position.copy(this.sphereBody.position)  //绑定3d和物理世界圆球的位置
                // this.camera.quaternion.copy(this.sphereBody.quaternion); //绑定3d和物理世界圆球的旋转
                //   this.Controls.target = this.earth.position //相机聚焦模型
                // this.camera.lookAt(this.earth.position) //相机聚焦模型
                // this.camera.position.set(this.earth.position.x + 100, this.earth.position.y + 100, this.earth.position.z) //相机位置跟随模型
                //   this.Controls.update(); //更新相机
            },
            //初始化地球模型
            initEarth () {
                let mesh = new SphereGeometry(5, 50, 50)
                let material = new MeshPhongMaterial({
                    map: this.earthMap,
                })
                this.earth = new THREE.Mesh(mesh, material)
                this.scene.add(this.earth)
                this.earth.position.set(10, 50, 50)
            },
            // 初始化物理世界
            initCannon () {
                // 生成物理世界
                this.world = new CANNON.World(); //该方法初始化物理世界，里面包含着物理世界的相关数据（如刚体数据，世界中所受外力等等）
                this.world.gravity.set(0, -100, 0); //设置物理世界的重力为沿y轴向上-100米每二次方秒
                this.world.broadphase = new CANNON.NaiveBroadphase(); //NaiveBroadphase是默认的碰撞检测方式，该碰撞检测速度比较高
                this.world.solver.iterations = 5; //解算器的迭代次数，更高的迭代次数意味着更加精确同时性能将会降低

                //生成物理地面
                let groundShape = new CANNON.Plane();
                let groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 1), -Math.PI / 2);
                this.world.addBody(groundBody);
                //生成物理圆球对象
                let sphereShape = new CANNON.Sphere(5); // 5为对象半径
                this.sphereBody = new CANNON.Body({
                    mass: 1, //重量，单位kg
                    shape: sphereShape,
                    position: new CANNON.Vec3(0, 5, 0), //初始位置
                    angularDamping: 0.5,
                    fixedRotation: false,
                }); // Step 2
                this.world.add(this.sphereBody); // Step 3
            },
            //初始化物理世界边界墙壁
            initCannonWall () {
                let rightWallShape = new CANNON.Box(new CANNON.Vec3(200, 100, 0.1)),
                    leftWallShape = new CANNON.Box(new CANNON.Vec3(200, 100, 0.1)),
                    beforeWallShape = new CANNON.Box(new CANNON.Vec3(0.1, 100, 200)),
                    afterWallShape = new CANNON.Box(new CANNON.Vec3(0.1, 100, 200)),
                    rightWallBody = new CANNON.Body({
                        mass: 0,
                        shape: rightWallShape,
                        position: new CANNON.Vec3(0, 100, -100)
                    }),
                    leftWallBody = new CANNON.Body({
                        mass: 0,
                        shape: leftWallShape,
                        position: new CANNON.Vec3(0, 100, 100)
                    }),
                    beforeWallBody = new CANNON.Body({
                        mass: 0,
                        shape: beforeWallShape,
                        position: new CANNON.Vec3(100, 100, 0)
                    }),
                    afterWallBody = new CANNON.Body({
                        mass: 0,
                        shape: afterWallShape,
                        position: new CANNON.Vec3(-100, 100, 0)
                    })
                let bodyArr = [leftWallBody, rightWallBody, beforeWallBody, afterWallBody]
                //这里使用for循环的原因是  this.world.add(leftWallBody, rightWallBody)⬅左边这种写法只生效第一个 官方文档没看懂
                for (let i = 0; i < bodyArr.length; i++) {
                    this.world.add(bodyArr[i])
                }
            }
        }
    }
</script>

<style>
</style>

