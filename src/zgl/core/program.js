
let ID = 0;

export class Program {
    constructor(gl, {
        vertex,
        fragment,
        uniforms = {},

        transparent = false,
        cullFace = gl.BACK,
        frontFace = gl.CCW,
        depthTest = true,
        depthWrite = true,
        depthFunc = gl.LESS,
    } = {}) {
        this.gl = gl;
        this.uniforms = uniforms;
        this.id = ID++;

        if (!vertex) console.warn('vertex shader not supplied');
        if (!fragment) console.warn('fragment shader not supplied');

        // Store program state
        this.transparent = transparent;
        // this.cullFace = cullFace;
        // this.frontFace = frontFace;
        // this.depthTest = depthTest;
        // this.depthWrite = depthWrite;
        // this.depthFunc = depthFunc;
        this.blendFunc = {};
        // this.blendEquation = {};

        // set default blendFunc if transparent flagged
        if (this.transparent && !this.blendFunc.src) {
            if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }

        // compile vertex shader and log errors
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (gl.getShaderInfoLog(vertexShader) !== '') {
            console.warn(`${gl.getShaderInfoLog(vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
        }

        // compile fragment shader and log errors
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (gl.getShaderInfoLog(fragmentShader) !== '') {
            console.warn(`${gl.getShaderInfoLog(fragmentShader)}\nVertex Shader\n${addLineNumbers(fragment)}`);
        }

        // compile program and log errors
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            return console.warn(gl.getProgramInfoLog(this.program));
        }

        // remove shader once linked
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // get active uniform locations
        this.uniformLocations = new Map();
        let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
            let uniform = gl.getActiveUniform(this.program, uIndex);
            this.uniformLocations.set(uniform, gl.getUniformLocation(this.program, uniform.name));

            // trim uniforms' names to omit array declarations
            uniform.uniformName = uniform.name.split('[')[0];
        }
        console.log("uniformLocations", this.uniformLocations);

        // Get active attribute locations
        this.attributeLocations = new Map();
        let numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
            let attribute = gl.getActiveAttrib(this.program, aIndex);
            this.attributeLocations.set(attribute.name, gl.getAttribLocation(this.program, attribute.name));
        }
        console.log("attributeLocations", this.attributeLocations);
    }

    // setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    //     this.blendFunc.src = src;
    //     this.blendFunc.dst = dst;
    //     this.blendFunc.srcAlpha = srcAlpha;
    //     this.blendFunc.dstAlpha = dstAlpha;
    //     if (src) this.transparent = true;
    // }

    applyState() {
    //     if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);
    //     else this.gl.renderer.disable(this.gl.BLEND);
    }

    use({
        programActive = false,
        flipFaces = false,
        } = {}) {

        // avoid gl call if program already in use
        if (!programActive) {
            console.log("activating program", this.program);
            this.gl.useProgram(this.program);
            this.gl.renderer.currentProgram = this.id;
        }

        // set only the active uniforms found in the shader
        this.uniformLocations.forEach((location, activeUniform) => {
            const name = activeUniform.uniformName;

            // get supplied uniform
            const uniform = this.uniforms[name];
            if (!uniform) {
                return console.warn(`Active uniform ${name} has not been supplied`);
            }
            if (uniform && uniform.value === undefined) {
                return console.warn(`${name} uniform is missing a value parameter`);
            }

            // TODO: uniform support for textures

            console.log("Binding uniform", activeUniform.name, activeUniform.type, location, uniform.value);
            setUniform(this.gl, activeUniform.type, location, uniform.value);
        });

        this.applyState();
    }
}

function setUniform(gl, type, location, value) {
    switch (type) {
        case 35676: return gl.uniformMatrix4fv(location, false, value[0].length ? flatten(value) : value); // FLOAT_MAT4
        default: console.error("Uniform type not yet supported", type);
    }
}

function flatten(array) {
    const arrayLen = array.length;
    const valueLen = array[0].length;
    const length = arrayLen * valueLen;
    let value = arrayCacheF32[length];
    if (!value) arrayCacheF32[length] = value = new Float32Array(length);
    for (let i = 0; i < arrayLen; i++) value.set(array[i], i * valueLen);
    return value;
}

function addLineNumbers(string) {
    let lines = string.split('\n');
    for (let i = 0; i < lines.length; i ++) {
        lines[i] = (i + 1) + ': ' + lines[i];
    }
    return lines.join('\n');
}

