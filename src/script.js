import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
// import testVertexS from './shaders/vertex.glsl'
// import testFragmentS from './shaders/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DisplacementShader } from './shaders/displacement.js'
import displacementFrag from './shaders/displacement.fragment.glsl'
import displacementVert from './shaders/displacement.vertex.glsl'
import { ShaderMaterial, Vector3 } from 'three'

const promisifiedLoader = (loader, file) => {
  return new Promise((resolve, reject) => {
    loader.load(file, resolve, () => {}, reject)
  })
}

const main = async () => {
  /* load all assets first */
  const textureLoader = new THREE.TextureLoader()
  const gltfLoader = new GLTFLoader()

  //Skybox
  const [
    skyboxTexture,
    colorTexture,
    gltf,
    // to load more files, add their names here
    // anotherGltf,
  ] = await Promise.all([
    promisifiedLoader(textureLoader, 'textures/skybox.jpg'),
    promisifiedLoader(textureLoader, 'textures/color.jpg'),
    promisifiedLoader(gltfLoader, 'models/face_07.glb'),
    // to load more files, just add their loader here
    // promisifiedLoader(gltfLoader, 'models/another_gltf.glb),
  ])

  /**
   * Base
   */
  // Debug
  // const gui = new dat.GUI()

  // Canvas
  const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const rt = new THREE.WebGLCubeRenderTarget(skyboxTexture.image.height)
  rt.fromEquirectangularTexture(renderer, skyboxTexture)
  scene.background = rt.texture

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xf0ffc0, 0.4)
  //scene.add(directionalLight)
  directionalLight.position.set(1, 3, 0)

  const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ffff, 1)
  scene.add(hemisphereLight)

  const pointLight = new THREE.PointLight(0xff9000, 0.5, 3)
  pointLight.position.set(1, 0.5, 0)
  // pointLight.position.y = 3
  // pointLight.position.z = 4
  scene.add(pointLight)

  const rectAreaLight = new THREE.RectAreaLight(0x4eff00, 2, 1, 1)
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt(new THREE.Vector3())
  scene.add(rectAreaLight)

  const spotLight = new THREE.SpotLight(0x4e00ff, 3, 10, Math.PI * 0.1, 0.25, 0.5)
  spotLight.position.set(0, 2, 3)
  scene.add(spotLight)

  spotLight.target.position.x = 1.7
  scene.add(spotLight.target)

  // gui.add(ambientLight, 'intensity').name('ambient').min(0).max(1).step(0.01)
  // gui.add(directionalLight, 'intensity').name('direct').min(0).max(1).step(0.01)
  // gui.add(hemisphereLight, 'intensity').name('hemi').min(0).max(1).step(0.01)
  // gui.add(rectAreaLight.position, 'z').name('rectPosZ').min(-5).max(5).step(0.1)
  // gui.add(rectAreaLight.position, 'x').name('rectPos').min(-5).max(5).step(0.1)
  // gui.add(rectAreaLight.rotation, 'y').name('rectRotY').min(-5).max(5).step(0.1)

  /**
   * Textures
   */
  // const roughnessTexture = await promisifiedLoader(textureLoader, '/textures/roughness.jpg')
  // const normalTexture = await promisifiedLoader(textureLoader, '/textures/normal.jpg')

  // const texture = textureLoader.load(
  //     'textures/flag-glitch.jpg',
  //     () => {
  //       const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
  //       rt.fromEquirectangularTexture(renderer, texture)
  //       //scene.background = rt.texture;
  //     })

  /**
   * Test mesh
   */
  // Geometry
  //const geometry = new THREE.PlaneGeometry(2, 1, 32, 32)

  //model

  gltf.scene.scale.set(1, 1, 1)
  gltf.scene.position.y = 0
  //scene.add(gltf.scene)
  const geometry = gltf.scene.getObjectByName('head').geometry

  // random
  const count = geometry.attributes.position.count
  const randoms = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
  }
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  // Material
  // const material = new THREE.RawShaderMaterial({
  //     vertexShader: testVertexS,
  //     fragmentShader: testFragmentS,
  //     uniforms:
  //     {
  //         uFrequency: { value: new THREE.Vector2(10, 5) },
  //         uTime: { value: 0 },
  //         uColor: { value: new THREE.Color('#b2d9d6') },
  //         uTexture: { value: colorTexture }
  //     },
  //     //wireframe: true
  //     transparent: true,
  //     side: THREE.DoubleSide

  // })

  const material = new ShaderMaterial({
    fragmentShader: displacementFrag,
    vertexShader: displacementVert,
    uniforms: {
      // ...THREE.ShaderLib.light,
      // lights: true,
      uNormalTex: { type: 't', value: colorTexture },
      uFrequency: { value: new THREE.Vector3(0, 0, 0) },
      uTime: { value: 0, type: 'f' },
      uColorTex: { type: 't', value: colorTexture },
      scale: { type: 'f', value: 1.0 },
    },
  })

  //UI
  // gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
  // gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

  // Mesh
  const mesh = new THREE.Mesh(geometry, material)
  //mesh.scale.y = 2
  scene.add(mesh)

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(-2, 1.2, 4)

  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.target = new Vector3(0, 1.5, 0)

  /**
   * Animate
   */
  const clock = new THREE.Clock()

  let currentIteration = 0
  let frequency = 0
  let freqDir = 1
  let timeAdd = 0
  const frequencyVec = new Vector3(1, 1, 1)

  const framesBeforeAnimationStarts = 100

  const maxFrequency = 12
  const minFrequency = -2
  const frequencySpeed = 0.03

  const maxTime = 10000
  const minTime = -10000

  const tick = () => {
    //Animation Shader - Frequency sin cos and normals

    if (currentIteration < framesBeforeAnimationStarts) {
      // wait frameBeforeAnimationStarts frames
      currentIteration += 1
    } else {
      // wait is over, start animating

      // lerp frequency between maxFrequency and minFrequency
      if (frequency >= maxFrequency && freqDir > 0) {
        freqDir = -1
      } else if (frequency <= minFrequency && freqDir < 0) {
        freqDir = 1
      }
      frequency += frequencySpeed * freqDir
      material.uniforms.uFrequency.value = frequencyVec.addScalar(frequencySpeed * freqDir)

      // lerp uTime between maxTime and minTime
      if (material.uniforms.uTime.value >= maxTime && timeAdd > 0) {
        timeAdd = -1
      } else if (material.uniforms.uTime.value <= minTime && timeAdd < 0) {
        timeAdd = 1
      }

      material.uniforms.uTime.value += clock.getDelta() * (timeAdd * Math.random() * 0.5 + 0.5)
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}

main()
