import {Transform} from './transform.js';
import {Mat4} from '../math/mat4.js';

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

        this.projectionMatrix = new Mat4();
        this.viewMatrix = new Mat4();

        // Use orthographic if values set, else default to perspective camera
        if (left || right) this.orthographic({left, right, bottom, top});
        else this.perspective();
    }

    perspective({
                    near = this.near,
                    far = this.far,
                    fov = this.fov,
                    aspect = this.aspect,
                } = {}) {
        this.projectionMatrix.fromPerspective({fov: fov * (Math.PI / 180), aspect, near, far});
        this.type = 'perspective';
        console.log("Camera: PERSPECTIVE", this.projectionMatrix);
        return this;
    }

    orthographic({
                     near = this.near,
                     far = this.far,
        left = -1,
        right = 1,
        bottom = 1,
        top = 1,
    } = {}) {
        this.projectionMatrix.fromOrthogonal({left, right, bottom, top, near, far});
        this.type = 'orthographic';
        console.log("Camera: ORTHO", this.projectionMatrix);
        return this;
    }

    updateMatrixWorld() {
        super.updateMatrixWorld();

        this.viewMatrix.inverse(this.worldMatrix);

        console.log("Camera: worldMatrix:", this.worldMatrix);
        console.log("Camera: viewMatrix:", this.viewMatrix);
    }
}