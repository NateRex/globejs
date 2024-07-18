import 'globejs';
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

// Get container
const container = document.getElementById('visualizer');
if (container === undefined || container === null) {
    throw new Error('Could not find "visualizer" container');
}

// Init renderer, camera, and scene
const renderer = new WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);
const camera = new PerspectiveCamera(30, container.offsetWidth / container.offsetHeight, 0.1, 100);
camera.position.z = 5;
const scene = new Scene();

// Add cubes
function createCube(geometry, color, x) {
    const material = new MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
   
    cube.position.x = x;
    
    return cube;
  }

const geometry = new BoxGeometry( 1, 1, 1 );
const cubes = [
    createCube(geometry, 0x44aa88,  0),
    createCube(geometry, 0x8844aa, -2),
    createCube(geometry, 0xaa8844,  2),
];

// Add ambient light
const ambientLight = new AmbientLight(0xffffff);
scene.add(ambientLight);

// Add directional light
const directionalLight = new DirectionalLight(0xffffff, 3);
directionalLight.position.set(-1, 2, 4);
scene.add(directionalLight);

// Renders single frame
function renderFrame() {
    renderer.render(scene, camera);
}

// Render loop
function render(time) {
    time *= 0.001;  // convert time to seconds

    cubes.forEach((cube, idx) => {
        const speed = 1 + idx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderFrame();
    requestAnimationFrame(render);
}

// Start render loop
requestAnimationFrame(render);