varying vec2 vUv;
varying float noise;
varying vec3 fNormal;
uniform sampler2D uColorTex;
uniform sampler2D uNormalTex;
uniform float scale;

//aus beispiel
varying float vRandom;
varying float vElevation;
uniform vec3 uFrequency;
uniform float uTime;
//attribute vec3 position;
//attribute vec2 uv;

attribute float aRandom;

void main() {
    vUv = uv;
    fNormal = normal;

    vec4 noiseTex = texture2D( uNormalTex, vUv );

    noise = noiseTex.r;

    //adding the normal scales it outward
    //(normal scale equals sphere diameter)
    vec3 newPosition = position + normal * noise * scale;

    //aus beispiel
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(normal.x * uFrequency.x + uTime);
    elevation += noise * sin(normal.y * uFrequency.y  + uTime);
    elevation += noise * sin(normal.z * uFrequency.z + uTime);
    elevation *= 0.1;

    modelPosition.x += normal.x * elevation;
    modelPosition.y += normal.y * elevation;
    modelPosition.z += normal.z * elevation;

    // modelPosition.z = aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition * noise;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vElevation = elevation;



    //gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}