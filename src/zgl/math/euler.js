import {Mat4} from './mat4.js';

export class Euler extends Float32Array {
    constructor(array = [0, 0, 0], order = 'XYZ') {
        super(3);
    }
}