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

    getRenderList({scene, camera}) {
        let renderList = [];

        scene.traverse(node => {
            renderList.push(node);
        });

        return renderList;
    }

    render({
               scene,
               camera,
           }) {


        const renderList = this.getRenderList({scene, camera});

        renderList.forEach(node => {
            node.draw({camera});
        });
    }

}