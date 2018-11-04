import {Vec3} from '../math/vec3';
import {Euler} from '../math/euler.js';
import {Mat4} from '../math/mat4.js';

export class Transform {
    constructor() {
        this.parent = null;
        this.children = [];
        this.visible = true;

        this.matrix = new Mat4();
        this.worldMatrix = new Mat4();
        this.matrixAutoUpdate = true;

        this.position = new Vec3();
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

    updateMatrixWorld(force) {
        if (this.matrixAutoUpdate) this.updateMatrix();

        if (this.worldMatrixNeedsUpdate || force) {
            if (this.parent === null)
                this.worldMatrix.copy(this.matrix);
            else
                this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
            this.worldMatrixNeedsUpdate = false;
            force = true;
        }

        let children = this.children;
        for (let i = 0, l = children.length; i < l; i++) {
            children[i].updateMatrixWorld(force);
        }
    }

    updateMatrix() {
        this.matrix = this.position;
        this.worldMatrixNeedsUpdate = true;
    }

    traverse(callback) {
        // return true in callback to stop traversing children
        if (callback(this)) return;

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].traverse(callback);
        }
    }
}