import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Vector3 } from 'three'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()
const particalGroup = new THREE.Group()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()

const starPartical = textureLoader.load('/particles/4.png')

const bookAxis = new THREE.Vector3(0.2,0,0).normalize()
const circleAxis = new THREE.Vector3(0.2,0,0).normalize()

const particalShape = new THREE.BufferGeometry()
const count = 300
const positions = new Float32Array(count * 3)

for( let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 2.2
    particalShape.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
}

const particalMaterial = new THREE.PointsMaterial()
particalMaterial.size = 0.1
particalMaterial.sizeAttenuation = true
particalMaterial.map = starPartical
particalMaterial.transparent = true
particalMaterial.alphaMap = starPartical
particalMaterial.depthWrite = false
particalMaterial.blending = THREE.AdditiveBlending
particalMaterial.color = new THREE.Color('#C58847')


const particles = new THREE.Points(particalShape,particalMaterial)
particalGroup.add(particles)
scene.add(particalGroup)

const modelLoader = new GLTFLoader()

let mixer2 = null
let mixer = null

// modelLoader.load('/models/viking_book/scene.gltf', (gltf) => {
//     gltf.scene.scale.set(0.005,0.005,0.005)
//     gltf.scene.rotateOnAxis(bookAxis, -0.5)
//     // gltf.scene.translateZ(-2.5)
//     // gltf.scene.translateY(-2)
//     // gltf.scene.translateX(-4.3)

//     scene.add(gltf.scene)

//     // mixer = new THREE.AnimationMixer(gltf.scene)
//     // const action = mixer.clipAction(gltf.animations[0])
//     // action.play()

// }, undefined, (error) => {
//     console.error(error)
// })

// modelLoader.load('/models/magic_ring_-_green/scene.gltf', (gltf) => {
//     gltf.scene.rotateOnAxis(circleAxis, 3)
//     gltf.scene.scale.set(0.6,0.6,0.6)
//     gltf.scene.translateY(-1.5)

//     scene.add(gltf.scene)
//     console.log(gltf.scene)

//     mixer2 = new THREE.AnimationMixer(gltf.scene)
//     const action2 = mixer2.clipAction(gltf.animations[0])
//     action2.play()

// }, undefined, ( error ) => {
    
// })

// yellow book
modelLoader.load('/models/magic_tome/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.002,0.002,0.002)
    gltf.scene.rotateOnAxis(bookAxis, 0.7)
    //gltf.scene.translateZ(0.4)

    scene.add(gltf.scene)

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()

}, undefined, (error) => {
    console.error(error)
})
modelLoader.load('/models/magic-ring/scene.gltf', (gltf) => {
    gltf.scene.rotateOnAxis(circleAxis, 0.2)
    gltf.scene.scale.set(0.6,0.6,0.6)
    gltf.scene.translateY(-1.5)

    scene.add(gltf.scene)
    console.log(gltf.scene)

    mixer2 = new THREE.AnimationMixer(gltf.scene)
    const action2 = mixer2.clipAction(gltf.animations[0])
    action2.play()

}, undefined, ( error ) => {
    
})


// Lights

const worldLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(worldLight)

const topLight = new THREE.SpotLight(0xffffa7)
topLight.intensity = 0.77
topLight.penumbra = 0.1
topLight.angle = 0.2
topLight.position.setY(4)

scene.add(topLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10)
camera.position.z = 2

/**
 * use if you need pixel alignment with images for shader effects
 * 
 */

// const cameraOpts = {
//     position: 600,
//     near: 100,
//     far: 2000,
//     fov: 2 * Math.atan( (sizes.height / 2) / this.position ) * (180 / Math.PI )
// }

// camera.position.z = cameraOpts.position
// camera.near = cameraOpts.near
// camera.far = cameraOpts.far
// camera.fov = cameraOpts.fov
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.physicallyCorrectLights = true

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    if(mixer2)
    {
        mixer2.update(deltaTime)
    }

    // Update objects
    
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    particalGroup.rotation.y +=  0.008

    // animate particles

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()