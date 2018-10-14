export class Renderer {
    constructor({
                    canvas = document.createElement('canvas'),
                    width = 300,
                    height = 150,
                    dpr = 1,
                } = {}) {

        this.dpr = dpr;

        // const attributes = {};
        // this.gl = canvas.getContext('webgl2', attributes);

        // assume webgl 2
        this.gl = canvas.getContext('webgl2');

        this.gl.renderer = this;

        this.setSize(width, height);



        // create method aliases
        this.bindVertexArray = this.gl.renderer.getExtension('OES_vertex_array_object', 'bindVertexArray', 'bindVertexArrayOES');
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
           }) {


        const renderList = this.getRenderList({scene, camera});
        console.log("renderList", renderList);

        renderList.forEach(node => {
            node.draw({camera});
        });
    }

}