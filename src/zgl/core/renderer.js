export class Renderer {
    constructor({
                    canvas = document.createElement('canvas'),
                    width = 300,
                    height = 150,
                    dpr = 1,
                    alpha = false,
                    depth = true,

                    autoClear = true,
                } = {}) {

        this.dpr = dpr;
        this.alpha = alpha;
        this.color = true;

        this.autoClear = autoClear;

        // const attributes = {};
        // this.gl = canvas.getContext('webgl2', attributes);

        // assume webgl 2
        this.gl = canvas.getContext('webgl2');

        // attach renderer to gl so that all classes have access to internal state functions
        this.gl.renderer = this;

        // init size values
        this.setSize(width, height);

        // store device params
        //...

        // gl state stores to avoid redundant calls on methods internally
        this.state = {};

        this.state.framebuffer = null;
        this.state.viewport = {width: null, height: null};



        // create method aliases
        this.bindVertexArray = this.gl.renderer.getExtension('OES_vertex_array_object', 'bindVertexArray', 'bindVertexArrayOES');
        this.createVertexArray = this.gl.renderer.getExtension('OES_vertex_array_object', 'createVertexArray', 'createVertexArrayOES');
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.gl.canvas.width = width * this.dpr;
        this.gl.canvas.height = height * this.dpr;

        Object.assign(this.gl.canvas.style, {
            width: width + 'px',
            height: height + 'px',
        });
    }

    setViewport(width, height) {
        if (this.state.viewport.width === width && this.state.viewport.height === height) return;
        this.state.viewport.width = width;
        this.state.viewport.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    getExtension(extension, webgl2Func, extFunc) {
        // if webgl2 function supported, return func bound to gl context
        if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl);

        // fetch extension once only
        if (!this.extensions[extension]) {
            this.extensions[extension] = this.gl.getExtension(extension);
        }

        // return extension if no function requested
        if (!webgl2Func) return this.extensions[extension];

        // return extension function, bound to extension
        return this.extensions[extension][extFunc].bind(this.extensions[extension]);
    }

    bindFramebuffer({target = this.gl.FRAMEBUFFER, buffer = null} = {}) {
        if (this.state.framebuffer === buffer) return;
        this.state.framebuffer = buffer;
        this.gl.bindFramebuffer(target, buffer);
    }

    getRenderList({scene, camera}) {
        let renderList = [];

        scene.traverse(node => {
            if (!node.visible) return true;
            if (!node.draw) return;

            renderList.push(node);
        });

        return renderList;
    }

    render({
               scene,
               camera,
               target = null,
           }) {

        this.bindFramebuffer();
        this.setViewport(this.width * this.dpr, this.height * this.dpr);

        if (this.autoClear) {
            this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
        }


        // get render list - entails culling and sorting
        const renderList = this.getRenderList({scene, camera});
        console.log("renderList", renderList);

        renderList.forEach(node => {
            console.log("drawing", node);
            node.draw({camera});
        });
    }

}