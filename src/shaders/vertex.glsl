uniform mat4 projectionMatrix; 
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime; 

attribute vec3 position;
attribute vec2 uv;

attribute float aRandom;

varying vec2 vUv;
varying float vRandom;
varying float vElevation;

void main() 
{
    //splited but like first line
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = cos(modelPosition.x * uFrequency.x - uTime) * 0.2;
    elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.2;

    modelPosition.z += elevation * aRandom;
    modelPosition.x += elevation * aRandom;
    modelPosition.y += elevation * aRandom;

    //modelPosition.z = aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;

    // first line 
    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); 
    //SCREEN SPACE    VIEW SPACE       WORLD SPACE  LOCAL SPACE   VIEWPORT TRANSFORM
}
