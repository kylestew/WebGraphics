
export class Vec3 extends Float32Array {
    constructor(array = [0, 0, 0]) {
        if (!array.length) array = [array, array, array];
        super(array);
        return this;
    }

    // copy(v) {
    //     Vec3Func.copy(this, v);
    //     return this;
    // }
}

