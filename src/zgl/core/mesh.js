import {Transform} from './transform.js';
// import {Mat3} from '../math/Mat3.js';
// import {Mat4} from '../math/Mat4.js';

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

        console.warn("TODO: MAT Uniforms for mesh - modelViewMatrix + normalMatrix");

        this.geometry = geometry;
        this.program = program;
        this.mode = mode;
    }

    draw({
        camera,
         } = {}) {

        // set the matrix uniforms
        //...

        // determine if faces need to be flipped - when mesh scaled negatively
        let flipFaces = false;

        // check here if any bindings can be skipped
        // geometry also needs to be rebound if different program
        const programActive = this.gl.renderer.currentProgram === this.program.id;
        const geometryBound = programActive && this.gl.renderer.currentGeometry === this.geometry.id;

        this.program.use({programActive, flipFaces});
        this.geometry.draw({mode: this.mode, program: this.program, geometryBound});

    }

}