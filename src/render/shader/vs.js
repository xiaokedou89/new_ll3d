const vertex=`varying vec3 vWorldPosition;
varying vec2 vuv;
vec3 ThreeToUe(vec3 Invector)
{
    vec3 temp;
    temp.x = -Invector.z;
    temp.y =  Invector.x;
    temp.z = -Invector.y;
    return temp;
}
void main() {
    vuv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
export default vertex;
