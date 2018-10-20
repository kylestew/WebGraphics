import {Vec3} from '../math/vec3';
import {Euler} from '../math/euler.js';

export class Transform {
    constructor() {
        this.parent = null;
        this.children = [];
        this.visible = true;

        this.position = new Vec3();
        this.rotation = new Euler();
    }

    setParent(parent, notifyParent = true) {
        if (notifyParent && this.parent && parent !== this.parent) this.parent.removeChild(this, false);
        this.parent = parent;
        if (notifyParent && parent) parent.addChild(this, false);
    }

    addChild(child, notifyChild = true) {
        if (!~this.children.indexOf(child)) this.children.push(child);
        if (notifyChild) child.setParent(this, false);
    }

    traverse(callback) {
        // return true in callback to stop traversing children
        if (callback(this)) return;

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].traverse(callback);
        }
    }
}