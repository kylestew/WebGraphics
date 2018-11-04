import {Renderer, Program, Camera, Transform, Mesh} from 'zgl';
import {Cube, Plane} from 'zgl/extras';


export default function main() {
    const renderer = new Renderer({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);

    console.log("/// COMPILING SHADERS ///");
    const program = new Program(gl, {
        vertex: `
        attribute vec3 position;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
        fragment: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
    `
    });

    const scene = new Transform();

    console.log("/// CREATING GEOMETRY ///");
// const geometry = new Cube(gl);
    const geometry = new Plane(gl);

    console.log("/// CREATING MESH ///");
    const mesh = new Mesh(gl, {geometry, program});
    mesh.setParent(scene);

    console.log("/// CREATING CAMERA ///");
    const camera = new Camera(gl, {
        fov: 35,
        aspect: gl.canvas.width / gl.canvas.height
    });
    camera.position.z = 5;

    console.log("/// RENDERING ///");
    gl.clearColor(0, 0, 0, 1);
    requestAnimationFrame(update);
    function update(t) {
        // requestAnimationFrame(update);

        // mesh.rotation.y -= 0.04;
        // mesh.rotation.x += 0.03;
        renderer.render({scene, camera});
    }
}