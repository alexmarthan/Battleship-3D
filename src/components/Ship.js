import * as THREE from 'three';

export class Ship {
    constructor(size, player, position = new THREE.Vector3()) {
        this.size = size;
        this.player = player;
        this.health = Math.floor(size / 2);
        this.maxHealth = this.health;
        this.isSunk = false;
        this.damage = size >= 6 ? 3 : (size >= 4 ? 2 : 1);
        this.position = position;
        this.rotation = new THREE.Euler();
        this.mesh = null;
        this.id = Math.random().toString(36).substr(2, 9);
        this.createMesh();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        for (let i = 0; i < this.size; i++) {
            const segmentGeometry = new THREE.BoxGeometry(1, 1, 2);
            const segmentMaterial = new THREE.MeshPhongMaterial({
                color: this.player === 1 ? 0x00008B : 0x8B0000,
                shininess: 0
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.x = i - (this.size - 1) / 2; 
            this.mesh.add(segment);
        }

        // deck
        const deckGeometry = new THREE.BoxGeometry(this.size - 0.5, 0.2, 1.5);
        const deckMaterial = new THREE.MeshPhongMaterial({
            color: this.player === 1 ? 0x4169E1 : 0xCD5C5C,
            shininess: 0,
            flatShading: false,
            emissive: new THREE.Color(this.player === 1 ? 0x4169E1 : 0xCD5C5C),
            emissiveIntensity: 0.3
        });
        const deck = new THREE.Mesh(deckGeometry, deckMaterial);
        deck.position.y = 0.6;
        deck.userData.isDeck = true;
        this.mesh.add(deck);

        const bowGeometry = new THREE.ConeGeometry(1, 2, 4);
        const bowMaterial = new THREE.MeshPhongMaterial({
            color: this.player === 1 ? 0x00008B : 0x8B0000,
            shininess: 0
        });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.rotation.z = Math.PI / 2;
        bow.position.x = this.size / 2;
        this.mesh.add(bow);

        const sternGeometry = new THREE.BoxGeometry(1, 1, 2);
        const sternMaterial = new THREE.MeshPhongMaterial({
            color: this.player === 1 ? 0x00008B : 0x8B0000,
            shininess: 0
        });
        const stern = new THREE.Mesh(sternGeometry, sternMaterial);
        stern.position.x = -this.size / 2;
        this.mesh.add(stern);

        const cannonGroup = new THREE.Group();
        
        const barrelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
        const barrelMaterial = new THREE.MeshPhongMaterial({
            color: 0x808080,
            shininess: 100
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        cannonGroup.add(barrel);

        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x404040,
            shininess: 50
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1.15;
        cannonGroup.add(base);

        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
        const wheelMaterial = new THREE.MeshPhongMaterial({
            color: 0x202020,
            shininess: 30
        });
        
        const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        leftWheel.rotation.z = Math.PI / 2;
        leftWheel.position.set(-0.5, -1.15, 0.3);
        cannonGroup.add(leftWheel);
        
        const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rightWheel.rotation.z = Math.PI / 2;
        rightWheel.position.set(-0.5, -1.15, -0.3);
        cannonGroup.add(rightWheel);

        cannonGroup.position.y = 1.2;
        this.mesh.add(cannonGroup);

        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
        
        if (this.player === 2) {
            this.mesh.rotation.y = Math.PI;
        }

        /* console.log('ship mesh:', {
            mainMesh: this.mesh,
            children: this.mesh.children,
            childCount: this.mesh.children.length
        }); */
    }

    takeDamage(amount) {
        /* console.log('damage:', {
            shipId: this.id,
            currentHealth: this.health,
            damageAmount: amount,
            newHealth: Math.max(0, this.health - amount),
            maxHealth: Math.floor(this.size / 2)
        }); */
        this.health = Math.max(0, this.health - amount);
        
        if (this.mesh) {
            const damageRatio = this.health / Math.floor(this.size / 2);
            
            this.mesh.children.forEach(child => {
                if (child.material && !child.userData.isDeck) {
                    const baseColor = this.player === 1 ? 0x00008B : 0x8B0000;
                    const r = (baseColor >> 16) & 0xff;
                    const g = (baseColor >> 8) & 0xff;
                    const b = baseColor & 0xff;
                    
                    child.material.color.setRGB(
                        r * damageRatio / 255,
                        g * damageRatio / 255,
                        b * damageRatio / 255
                    );
                }
            });
        }
        
        if (window.info) {
            /* console.log('health bar updates:', this.id); */
            window.info.updateHealthBar(this, this.health);
        }
        
        // check for sink
        if (this.health <= 0) {
            /* console.log('sunk:', this.id); */
            this.mesh.rotation.x = Math.PI / 2;
            this.mesh.position.y = -2;
            
            if (window.gameState) {
                window.gameState.recordSunkShip(this.player === 1 ? 2 : 1, this.id);
                
                // check gameover
                const winner = window.gameState.checkWinCondition();
                if (winner) {
                    window.gameState.gamePhase = 'GAME_OVER';
                    if (window.gameUI) {
                        window.gameUI.updateStatus();
                    }
                }
            }

            if (window.info) {
                window.info.removeHealthBar(this.id);
            }
        }
        
        return this.health <= 0;
    }

    setPosition(position) {
        this.position.copy(position);
        if (this.mesh) {
            this.mesh.position.copy(position);
        }
    }

    setRotation(rotation) {
        this.rotation.copy(rotation);
        if (this.mesh) {
            this.mesh.rotation.copy(rotation);
        }
    }

    getBoundingBox() {
        return new THREE.Box3().setFromObject(this.mesh);
    }

    highlight() {
        if (this.mesh) {
            this.mesh.children.forEach(child => {
                if (child.material) {
                    child.material.emissive = new THREE.Color(0xffff00);
                    child.material.emissiveIntensity = 0.5;
                }
            });
        }
    }

    unhighlight() {
        if (this.mesh) {
            this.mesh.children.forEach(child => {
                if (child.material) {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            });
        }
    }
} 