
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
        console.log("uniforms", this.uniformLocations);

        // Get active attribute locations
        this.attributeLocations = new Map();
        let numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
            let attribute = gl.getActiveAttrib(this.program, aIndex);
            this.attributeLocations.set(attribute.name, gl.getAttribLocation(this.program, attribute.name));
        }
        console.log("attributes", this.attributeLocations);

        // this.checkTextureUnits();
    }

    applyState() {
        // if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);
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
        //...


        // this.applyState();

    }
}

function addLineNumbers(string) {
    let lines = string.split('\n');
    for (let i = 0; i < lines.length; i ++) {
        lines[i] = (i + 1) + ': ' + lines[i];
    }
    return lines.join('\n');
}
