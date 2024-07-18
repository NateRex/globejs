import { AmbientLight, Color, PerspectiveCamera, Renderer, Scene, WebGLRenderer } from "three";
import { SECONDS_TO_MILLISECONDS } from "./utils/Constants";
import { Event } from "./utils/Event";

/**
 * The visualizer initializes the scene, camera, renderer, and globe imagery layers and exposes them for use.
 * @author Nathaniel Rex
 */
export class Visualizer {

    /**
     * Event emitter triggered prior to the rendering of each frame. It broadcasts the time (in decimal seconds) since
     * the previous frame was rendered.
     */
    public readonly preRender = new Event<number>();

    /**
     * The parent container
     */
    private _container: HTMLElement;

    /**
     * Renderer
     */
    private _renderer: Renderer;

    /**
     * Camera
     */
    private _camera: PerspectiveCamera;

    /**
     * Scene
     */
    private _scene: Scene;

    /**
     * Boolean flag that, when true, pauses all animation.
     */
    private _paused = false;

    /**
     * Time (in decimal seconds) at which the previous frame was rendered, relative to the time the page was first loaded
     */
    private _previousTime = 0;

    /**
     * Constructor
     * @param container An HTML element to contain the visualizer. The visualizer canvas will be created and appended
     * to this element.
     */
    public constructor(container: HTMLElement) {
        this._container = container;

        this.initScene();
        this.initCamera();
        this.initRenderer();
        
        requestAnimationFrame(this.render);
    }

    /**
     * @return The scene
     */
    public get scene() {
        return this._scene;
    }

    /**
     * @return The camera
     */
    public get camera() {
        return this._camera;
    }

    /**
     * @return The renderer
     */
    public get renderer() {
        return this._renderer;
    }

    /**
     * Resumes animation of the scene. Has no effect if the visualizer is already in a running state.
     */
    public resume() {
        this._paused = false;
    }

    /**
     * Pauses animation of the scene. Has no effect if the visualizer is already in a paused state.
     */
    public pause() {
        this._paused = true;
    }

    /**
     * Initializes the scene
     */
    private initScene() {
        this._scene = new Scene();
        this._scene.background = new Color(0x000000);
        this._scene.add(new AmbientLight());
    }

    /**
     * Initializes the camera
     */
    private initCamera() {
        const aspect = this._container.offsetWidth / this._container.offsetHeight;
        this._camera = new PerspectiveCamera(30, aspect, 0.1, 100);
        this._camera.position.z = 4.5;
        this._scene.add(this._camera);
    }

    /**
     * Initializes the renderer
     */
    private initRenderer() {
        this._renderer = new WebGLRenderer({ antialias: true });
        this._renderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
        this._container.appendChild(this._renderer.domElement);
    }

    /**
     * Determines if the parent container's width or height has changed, and if so, updates the renderer and camera
     * accordingly.
     */
    private fitToContainer() {
        const width = this._container.offsetWidth;
        const height = this._container.offsetHeight;

        const canvas = this._renderer.domElement;
        if (canvas.width !== width || canvas.height !== height) {
            this._renderer.setSize(width, height);
            this._camera.aspect = width / height;
            this._camera.updateProjectionMatrix();
        }
    }

    /**
     * Renders a single frame
     */
    private renderFrame() {
        this._renderer.render(this._scene, this._camera);
    }

    /**
     * Callback function representing the main render loop
     * @param timeMs Time since the page was first loaded, in milliseconds
     */
    private render = (timeMs: number) => {
        requestAnimationFrame(this.render);

        // Get seconds since last frame
        const timeSeconds = timeMs / SECONDS_TO_MILLISECONDS;
        const deltaTime = timeSeconds - this._previousTime;
        this._previousTime = timeSeconds;

        // Potentially resize
        this.fitToContainer();

        if (this._paused) {
            return;
        }

        this.preRender.raise(deltaTime);
        this.renderFrame();
    }
}