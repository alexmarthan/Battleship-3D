import * as THREE from 'three';

class Clouds {
    constructor() {
        this.cloudGroup = new THREE.Group();
        this.createClouds();
    }
    
    createClouds() {
        const ceilingClouds = 30;
        const ceilingHeight = 150;
        const ceilingVariation = 20; 

        for (let i = 0; i < ceilingClouds; i++) {
            const ceilingCloud = new THREE.Group();
            const numParts = 4 + Math.floor(Math.random() * 3);
            
            for (let j = 0; j < numParts; j++) {
                const partGeometry = new THREE.SphereGeometry(
                    Math.random() * 8 + 8,
                    16, 16
                );
                
                const darkness = 0.5 + Math.random() * 0.2;
                const cloudColor = new THREE.Color(darkness, darkness, darkness);
                
                const cloudMaterial = new THREE.MeshPhongMaterial({
                    color: cloudColor,
                    transparent: true,
                    opacity: 0.5 + Math.random() * 0.2,
                    shininess: 2
                });
                
                const part = new THREE.Mesh(partGeometry, cloudMaterial);
                
                part.position.set(
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 30
                );
                
                part.scale.set(
                    Math.random() * 1.2 + 0.8,
                    Math.random() * 0.8 + 0.4,
                    Math.random() * 1.2 + 0.8
                );
                
                ceilingCloud.add(part);
            }
            
            const gridSize = Math.ceil(Math.sqrt(ceilingClouds));
            const gridX = i % gridSize;
            const gridZ = Math.floor(i / gridSize);
            
            const spacing = 80;
            const x = (gridX - gridSize/2) * spacing + (Math.random() - 0.5) * 20;
            const z = (gridZ - gridSize/2) * spacing + (Math.random() - 0.5) * 20;
            const y = ceilingHeight + (Math.random() - 0.5) * ceilingVariation;
            
            ceilingCloud.position.set(x, y, z);
            
            const scale = 1.2 + Math.random() * 0.4;
            ceilingCloud.scale.set(scale, scale * 0.6, scale);
            
            this.cloudGroup.add(ceilingCloud);
        }
        
        const atmosphericClouds = 10;
        for (let i = 0; i < atmosphericClouds; i++) {
            const atmoCloud = new THREE.Group();
            const numParts = 3 + Math.floor(Math.random() * 2);
            
            for (let j = 0; j < numParts; j++) {
                const partGeometry = new THREE.SphereGeometry(
                    Math.random() * 6 + 6,
                    16, 16
                );
                
                const darkness = 0.5 + Math.random() * 0.2;
                const cloudColor = new THREE.Color(darkness, darkness, darkness);
                
                const cloudMaterial = new THREE.MeshPhongMaterial({
                    color: cloudColor,
                    transparent: true,
                    opacity: 0.3 + Math.random() * 0.2,
                    shininess: 8
                });
                
                const part = new THREE.Mesh(partGeometry, cloudMaterial);
                
                part.position.set(
                    (Math.random() - 0.5) * 1,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 5
                );
                
                part.scale.set(
                    Math.random() * 1.0 + 0.8,
                    Math.random() * 0.6 + 0.4,
                    Math.random() * 1.0 + 0.8
                );
                
                atmoCloud.add(part);
            }
            
            const angle = (i / atmosphericClouds) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const height = 30 + Math.random() * 30;
            
            atmoCloud.position.set(
                Math.cos(angle) * distance,
                height,
                Math.sin(angle) * distance
            );
            
            const scale = 1.0 + Math.random() * 0.4;
            atmoCloud.scale.set(scale, scale * 0.9, scale);
            
            this.cloudGroup.add(atmoCloud);
        }
    }
    
    addToScene(scene) {
        scene.add(this.cloudGroup);
    }
    
    setVisible(visible) {
        this.cloudGroup.visible = visible;
    }
}

export default Clouds; 