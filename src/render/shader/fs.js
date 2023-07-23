const fragment=`varying vec3 vWorldPosition;
varying vec2 vuv;

uniform vec3 pos1;
uniform vec3 pos2;
uniform float alpha;
uniform sampler2D texture1;
uniform sampler2D texture2;

vec3 ThreeToUe(vec3 Invector)
{
    vec3 temp;
    // temp.x = -Invector.z;
    // temp.y =  Invector.x;
    // temp.z = -Invector.y;
    temp.x = Invector.x;
    temp.y =  Invector.z;
    temp.z = -Invector.y;
    
    return temp;
}
vec2 LongLatToUV(vec3 InVector)
{
    vec3 temp  =  ThreeToUe(InVector);
    // float a = ( 1. + atan(InVector.x,-InVector.y)/3.14159265)/2. ;
    // float b = acos(InVector.z)/3.14159265;
    //return vec2((1. + atan(InVector.x, -InVector.y)/3.14159265)/2., acos(InVector.z)/3.14159265);

      return vec2((1. + atan(temp.x, -temp.y)/3.14159265)/2., acos(temp.z)/3.14159265);
}

void main() {

    vec3 dir1 = normalize(vWorldPosition- pos1);
    vec3 dir2 = normalize(vWorldPosition- pos2);
    vec2 uv1 = LongLatToUV(dir1);
    vec2 uv2 = LongLatToUV(dir2);

    vec4 color1 = texture2D(texture1, uv1);
    vec4 color2 = texture2D(texture2, uv2);
    gl_FragColor= mix(color1,color2, alpha);
}`
export default fragment;
