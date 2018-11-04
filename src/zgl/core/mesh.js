import {Transform} from './transform.js';
import {Mat3} from '../math/mat3.js';
import {Mat4} from '../math/mat4.js';

let ID = 0;

export class Mesh extends Transform {
    constructor(gl, {
        geometry,
        program,
        mode = gl.TRIANGLES,
        frustrumCulled = true,
        renderOrder = 0,
    } = {}) {
        super(gl);
        this.gl = gl;
        this.id = ID++;

        this.geometry = geometry;
        this.program = program;
        this.mode = mode;

        this.modelViewMatrix = new Mat4();
        // this.normalMatrix = new Mat3();

        // add empty matrix uniforms to program if unset
        if (!this.program.uniforms.modelMatrix) {
            Object.assign(this.program.uniforms, {
                modelMatrix: { value: null },
                modelViewMatrix: { value: null },
                projectionMatrix: { value: null },
            });
        }
    }

    draw({
             camera,
         } = {}) {

        // set the matrix uniforms
        if (camera) {
            this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
            console.log("projectionMatrix", camera.projectionMatrix);

            this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);

            this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
            console.log("modelViewMatrix", this.modelViewMatrix);
        }

        // // determine if faces need to be flipped - when mesh scaled negatively
        // let flipFaces = false;
        //
        // // check here if any bindings can be skipped
        // // geometry also needs to be rebound if different program
        const programActive = this.gl.renderer.currentProgram === this.program.id;
        const geometryBound = programActive && this.gl.renderer.currentGeometry === this.geometry.id;

        this.program.use({programActive});
        // this.program.use({programActive, flipFaces});
        this.geometry.draw({mode: this.mode, program: this.program, geometryBound});
    }
}