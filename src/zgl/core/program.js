
let ID = 0;

export class Program {
    constructor(gl, {
        vertex,
        fragment,
        uniforms = {},

        transparent = false,

    } = {}) {
        this.gl = gl;
        this.uniforms = uniforms;
        this.id = ID++;

        if (!vertex) console.warn('vertex shader not supplied');
        if (!fragment) console.warn('fragment shader not supplied');

    }
}