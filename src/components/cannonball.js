import * as THREE from 'three';

export class Cannonball {
    constructor(verticalAngle, horizontalAngle, damage = 1) {
        const geometry = new THREE.SphereGeometry(0.75, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0x828282 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.damage = damage;
        
        this.verticalAngle = THREE.MathUtils.degToRad(verticalAngle);
        this.horizontalAngle = THREE.MathUtils.degToRad(horizontalAngle);
        
        /*         console.log('cannonball created:', { 
            vertical: verticalAngle, 
            horizontal: horizontalAngle,
            verticalRad: this.verticalAngle,
            horizontalRad: this.horizontalAngle
        }); */
        
        this.aim = this.calculateAimVector();
        /* console.log('Aim vector:', this.aim); */
        this.gravity = 9.8;
        this.initialSpeed = 30;
        this.velocity = this.aim.clone().multiplyScalar(this.initialSpeed);
    }

    calculateAimVector() {
        const x = Math.sin(this.horizontalAngle) * Math.cos(this.verticalAngle);
        const y = Math.sin(this.verticalAngle);
        const z = Math.cos(this.horizontalAngle) * Math.cos(this.verticalAngle);    
        return new THREE.Vector3(x, y, z).normalize();
    }

    // position is updated at the same rate as collision
    update(deltaTime) {
        this.velocity.y -= this.gravity * deltaTime;
        
        this.mesh.position.x += this.velocity.x * deltaTime;
        this.mesh.position.y += this.velocity.y * deltaTime;
        this.mesh.position.z += this.velocity.z * deltaTime;
    }
} 