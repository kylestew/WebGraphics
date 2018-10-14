import {Vec3} from '../math/vec3.js';

let ID = 0;

export class Geometry {
    constructor(gl, attributes = {}) {
        this.gl = gl;
        this.attributes = attributes;
        this.id = ID++;

        this.drawRange = {start: 0, count: 0};

        // unbind current VAO so that new buffers don't get added to active mesh
        this.gl.renderer.bindVertexArray(null);
        this.gl.renderer.currentGeometry = null;

        // create the buffers
        for (let key in attributes) {
            this.addAttribute(key, attributes[key]);
        }

        console.log(this.drawRange);
    }

    addAttribute(key, attr) {
        this.attributes[key] = attr;

        // set options
        attr.size = attr.size || 1;
        attr.type = attr.type || key === 'index' ? this.gl.UNSIGNED_SHORT : this.gl.FLOAT;
        attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
        attr.normalize = attr.normalize || false;
        attr.buffer = this.gl.createBuffer();
        attr.count = attr.data.length / attr.size;
        // attr.divisor = !attr.instanced ? 0 :

        console.log(key, attr);

        // push data to buffer
        this.updateAttribute(attr);

        // update geometry counts
        if (key === 'index') {
            this.drawRange.count = attr.count;
        }
    }

    updateAttribute(attr) {
        this.gl.bindBuffer(attr.target, attr.buffer);
        this.gl.bufferData(attr.target, attr.data, this.gl.STATIC_DRAW);
        this.gl.bindBuffer(attr.target, null);
    }

    draw({
        program,
        mode = this.gl.TRIANGLES,
        geometryBound = false,
         }) {
        if (!geometryBound) {

        }

        if (this.attributes.index) {
            console.log("drawElements", mode, this.drawRange, this.attributes.index);
            this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.drawRange.start);
        }
    }

}