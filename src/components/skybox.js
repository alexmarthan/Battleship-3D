import * as THREE from 'three';

export class Skybox {
    constructor() {
        this.loader = new THREE.CubeTextureLoader();
        this.texture = this.loader.load([
            '/clouds1_east.png',
            '/clouds1_west.png',
            '/clouds1_up.png',
            '/clouds1_down.png',
            '/clouds1_south.png',
            '/clouds1_north.png'
        ]);
    }

    getTexture() {
        return this.texture;
    }
}