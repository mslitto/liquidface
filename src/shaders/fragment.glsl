precision mediump float;
uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv); 
    textureColor.rgb *= vElevation * 4.0 + 10.0;
    gl_FragColor = textureColor * vec4(0.7 * uColor.x, 0.10 * uColor.y, vRandom, 1.0);
    //gl_FragColor = textureColor *= vRandom;
}