import 'globejs';
import { Visualizer } from 'globejs';
import { BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial } from 'three';

// Set up visualizer
const container = document.getElementById('visualizer');
if (container === undefined || container === null) {
    throw new Error('Could not find container');
}

const viz = new Visualizer(container);


// Add cubes
function createCube(geometry, color, x) {
    const material = new MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    viz.scene.add(cube);
   
    cube.position.x = x;
    
    return cube;
}
const geometry = new BoxGeometry( 1, 1, 1 );
const cubes = [
    createCube(geometry, 0x44aa88,  0),
    createCube(geometry, 0x8844aa, -2),
    createCube(geometry, 0xaa8844,  2),
];


// Add directional lighting
const directionalLight = new DirectionalLight(0xffffff, 3);
directionalLight.position.set(-1, 2, 4);
viz.scene.add(directionalLight);


// Perform updates pre-render of each frame
viz.preRender.addListener(deltaTime => {
    cubes.forEach((cube, idx) => {
        const speed = 1 + idx * .1;
        const rot = deltaTime * speed;
        cube.rotation.x += rot;
        cube.rotation.y += rot;
    });
});
