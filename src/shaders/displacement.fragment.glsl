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
    textureColor.rgb *= vElevation * 5.0 + 0.5;
    gl_FragColor = textureColor * vec4(textureColor.r, textureColor.g, textureColor.b, 1.0);
    //gl_FragColor = textureColor *= vRandom;
}
