import {Ammo} from "@/render/ammo/AmmoHelper"
import * as THREE from "three"
const STATE = { DISABLE_DEACTIVATION : 4 }
export function createBody(colShape, mesh, params){
	let mass = params.mass || 0;
	let restitution = params.restitution || 0.4;
	let friction = params.friction || 0.8;
	
	let body;

	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
	transform.setRotation(new Ammo.btQuaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w));

	let motionState = new Ammo.btDefaultMotionState(transform);

	let localInertia = new Ammo.btVector3(0, 0, 0); // 惯性

	if (mass !== 0) {
		colShape.calculateLocalInertia(mass, localInertia);
	}

	let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
	body = new Ammo.btRigidBody(rbInfo);
	body.setRestitution(restitution);
	body.setFriction(friction);
	//  ammo.js中允许沿 Y 轴旋转，请使用：
	// body.setAngularFactor( 0, 1, 0 );
	// 动态刚体运动时要加
	body.setActivationState( STATE.DISABLE_DEACTIVATION );
	return body;
}
   /**
     * Creates a physics body using the plugin
     * @param {Mesh} mesh
     * @param {Object} params the info to create the physics body on
     */
	export function  generatePhysicsBody(mesh, params, type) {
        
		let collisionShape = new THREE.Group();
		
		mesh.traverse((child) => {
			if (child.hasOwnProperty('userData')) {
				
				if (child.userData.hasOwnProperty('data')) {
					if (child.userData.data == 'collision' || child.userData.data == 'physics') {

						collisionShape.add(child.clone());
						
					}
				}
			}
		});
		
		if (collisionShape.children.length !== 0) {
			mesh = collisionShape;
		}
		
		let colShape = createShape(mesh, false, type);
		return createBody(colShape, mesh, params);
}
/** 
 * Create Collision Shape 
 * @param {Object3D} object
 * @param {Boolean} ignoreChildren whether to ignore the children
*/
export function createShape (object, ignoreChildren, type) {

let returnShape;

if (ignoreChildren === void 0) { ignoreChildren = false; }

if (!ignoreChildren) {
	let meshChildren = object.children;

	returnShape = new Ammo.btCompoundShape();

	let childrenAdded = 0;

	meshChildren.forEach((childMesh) => {
		// console.log(childMesh);

		let shape = createShape(childMesh);

		let scale = childMesh.parent.scale;

		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(childMesh.position.x * scale.x, childMesh.position.y * scale.y, childMesh.position.z * scale.z));
		transform.setRotation(new Ammo.btQuaternion(childMesh.quaternion.x, childMesh.quaternion.y, childMesh.quaternion.z, childMesh.quaternion.w));

		returnShape.addChildShape(transform, shape);

		childrenAdded++;
	});

	if (childrenAdded > 0) {
		// Add parents shape as a child if present
		if (object.type == 'Mesh') {
			var shape = createShape(object, true);
			if (shape) {
				let transform = new Ammo.btTransform();
				transform.setIdentity();
				transform.setOrigin(new Ammo.btVector3(0, 0, 0));
				transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
				returnValue.addChildShape(transform, shape);
			}
		}
		return returnShape;
	}
	else {
		// If no children with impostors create the actual shape below instead
		Ammo.destroy(returnShape);
		returnShape = null;
	}
}

if (object.geometry.parameters !== void 0) {
	switch (object.geometry.type) {
		case 'BoxGeometry':
		case 'BoxBufferGeometry':
			returnShape = new Ammo.btBoxShape(new Ammo.btVector3(object.geometry.parameters.width * 0.5, object.geometry.parameters.height * 0.5, object.geometry.parameters.depth * 0.5));
			break;
		case 'CircleGeometry':
		case 'CircleBufferGeometry':
			console.warn('CircleGeometry is not currently supported');
			break;
		case 'ConeGeometry':
		case 'ConeBufferGeometry':
			console.warn('ConeGeometry is not currently supported');
			break;
		case 'CylinderGeometry':
		case 'CylinderBufferGeometry':
			if (object.geometry.parameters.radiusTop == object.geometry.parameters.radiusBottom)
				returnShape = new Ammo.btCylinderShape(new Ammo.btVector3(object.geometry.parameters.radiusTop, object.geometry.parameters.height * 0.5, object.geometry.parameters.radiusTop));
			else
				console.warn('The radius is not equal');
			break;
		case 'PlaneGeometry':
		case 'PlaneBufferGeometry':
			returnShape = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 0, 1), 0.0);
			break;
		case 'SphereGeometry':
		case 'SphereBufferGeometry':
			returnShape = new Ammo.btSphereShape(object.geometry.parameters.radius);
			break;
	}
} else {

	switch (type) {
		case 'convex':
			// ConvexHull

			let convexShape = new Ammo.btConvexHullShape();
			let triangleCount = addHullVerts(convexShape, object, object);
			if (triangleCount == 0) {
				// Cleanup Unused Convex Hull Shape
				returnShape = new Ammo.btCompoundShape();
			}
			else {
				returnShape = convexShape;
			}
			break;

		case 'trimesh':

			// Trimesh

			returnShape = getTrimeshFromMesh(object);
			break;
	}

	// returnShape.setMargin(0.01);
}
return returnShape;
}
 // adds all verticies (including child verticies) to the convex hull shape
 function addHullVerts (btConvexHullShape, topLevelMesh, mesh) {
	let geometry = new THREE.Geometry().fromBufferGeometry(mesh.geometry);

	let scale = mesh.scale;

	let triangleCount = geometry.vertices.length;

	let vertex = new Ammo.btVector3(0, 0, 0);

	for (let i = 0; i < geometry.vertices.length; i++) {
		let a = scale.x * geometry.vertices[i].x;
		let b = scale.y * geometry.vertices[i].y;
		let c = scale.z * geometry.vertices[i].z;

		vertex.setValue(a, b, c);

		btConvexHullShape.addPoint(vertex, true);
	}

	mesh.children.forEach(function (childMesh) {
		triangleCount += addHullVerts(btConvexHullShape, topLevelMesh, childMesh);
	});

	return triangleCount;
}
// =======================================================================


function getTrimeshFromMesh(ob) {

	let shape = null; /* rbCollisionShape */
	let faces, vertices;
	let totvert = 0;
	if (ob.type == 'Mesh') {

		let mesh = getRigidbodyMesh(ob);

		faces = mesh.faces;
		vertices = mesh.vertices;

		totvert = vertices.length;

	}
	else {
		console.error("cannot make Convex Hull collision shape for non-Mesh object");
	}

	if (totvert == 0) {
		console.error("no vertices to define Convex Hull collision shape with");
	}

	/* vertices, faces */
	shape = new Ammo.btCompoundShape();

	let ammoMesh = new Ammo.btTriangleMesh(true, true);
	let ammo1 = new Ammo.btVector3(),
			ammo2 = new Ammo.btVector3(),
			ammo3 = new Ammo.btVector3();
	for (let i = 0, l = faces.length; i < l; i++) {
		let a = faces[i].a;
		let b = faces[i].b;
		let c = faces[i].c;
		ammo1.setX(vertices[a].x)
		ammo1.setY(vertices[a].y)
		ammo1.setZ(vertices[a].z)
		ammo2.setX(vertices[b].x)
		ammo2.setY(vertices[b].y)
		ammo2.setZ(vertices[b].z)
		ammo3.setX(vertices[c].x)
		ammo3.setY(vertices[c].y)
		ammo3.setZ(vertices[c].z)
		ammoMesh.addTriangle(ammo1,ammo2,ammo3,false);
	}

	let triMeshShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, true, true);

	let transform = new Ammo.btTransform();
	transform.setIdentity();
	let origin = transform.getOrigin();
	origin.setValue(0, 0, 0);
	let ammoQuat = new Ammo.btQuaternion();
	ammoQuat.setValue(0, 0, 0, 1);
	transform.setRotation(ammoQuat);

	/* triangle-mesh we create is a BVH wrapper for triangle mesh data (for faster lookups) */
	// RB_TODO perhaps we need to allow saving out this for performance when rebuilding?
	// bvh = Bounding Volume Hierarchy
	shape.addChildShape(transform, triMeshShape);

	return shape;

}
   /* get the appropriate evaluated mesh based on rigid body mesh source */
 function getRigidbodyMesh(ob) {

    const index = ob.geometry.index !== null ? ob.geometry.index : undefined;
    const attributes = ob.geometry.attributes;
    const scale = ob.scale;

    if (attributes.position === undefined) {

        console.error('THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion.');
        return;

    }

    const position = attributes.position;

    let vertices = [];
    let faces = [];

    for (let i = 0; i < position.count; i++) {

        vertices.push({
            x: scale.x * position.getX(i),
            y: scale.y * position.getY(i),
            z: scale.z * position.getZ(i)
        });

    }

    if (index !== undefined) {

        for (let i = 0; i < index.count; i += 3) {

            faces.push({
                a: index.getX(i),
                b: index.getX(i + 1),
                c: index.getX(i + 2)
            });

        }

    } else {

        for (let i = 0; i < position.count; i += 3) {

            faces.push({
                a: i,
                b: i + 1,
                c: i + 2
            });

        }
    }

    return {
        vertices,
        faces
    }
}

export function newTrimesh(object, params){
	let shape = getTrimeshFromMesh(object);
	return createBody(shape, object, params);
}