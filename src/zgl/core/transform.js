import {Vec3} from '../math/vec3';

export class Transform {
    constructor() {
        this.parent = null;
        this.children = [];
        this.visible = true;

        this.position = new Vec3();
    }

    setParent(parent, notifyParent = true) {
        this.parent = parent;
    }

    traverse(callback) {
        if (callback(this)) return;
        // if (let i = 0; l = this.children.length; i < l; i++) {
        //     this.children[i].traverse(callback);
        // }
    }
}