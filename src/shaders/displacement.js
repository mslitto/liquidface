export const DisplacementShader = {
  uniforms: {
    texture1: { type: 't', value: null },
    scale: { type: 'f', value: 1.0 },
  },

  vertexShader: `
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

    float elevation = cos(normal.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(normal.y * uFrequency.y + uTime) * 0.4;

    modelPosition.x += normal.x * elevation;
    modelPosition.y += normal.y * elevation;
    modelPosition.z += normal.z *  elevation;

    //modelPosition.z = aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vElevation = elevation;



    //gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`,

  fragmentShader: `
varying vec2 vUv;
varying float noise;
varying vec3 fNormal;
uniform sampler2D uColorTex;
uniform sampler2D uNormalTex;
varying float vElevation;
varying float vRandom;



void main( void ) {
    // compose the colour using the normals then 
    // whatever is heightened by the noise is lighter
    //gl_FragColor = texture2D(uColorTex, vUv);

    vec4 textureColor = texture2D(uColorTex, vUv);
    textureColor.rgb *= vElevation * 4.0 + 0.5;
    gl_FragColor = textureColor * vec4(0.7 * fNormal.x, 0.10 * fNormal.y, vRandom, 1.0);
    //gl_FragColor = textureColor *= vRandom;
}
`,
}
