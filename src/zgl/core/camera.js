import {Transform} from './transform.js';

export class Camera extends Transform {
    constructor(gl, {
        near = 0.1,
        far = 100,
        fov = 45,
        aspect = 1,
        left,
        right,
        bottom,
        top,
    } = {}) {
        super(gl);

        this.near = near;
        this.far = far;
        this.fov = fov;
        this.aspect = aspect;

        // this.projectionMatrix = new Mat4();
    }
}