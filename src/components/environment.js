import * as THREE from 'three';

export function createEnvironment(scene) {
    const mountainGroup = new THREE.Group();
    const mountainCount = 90;
    const radius = 300;
    const mountainGeometry = new THREE.ConeGeometry(50, 75, 4); 
    const textureLoader = new THREE.TextureLoader();
    const mountainTexture = textureLoader.load('/mountain.jpg');
    mountainTexture.wrapS = THREE.RepeatWrapping;
    mountainTexture.wrapT = THREE.RepeatWrapping;
    mountainTexture.repeat.set(2, 2);
    
    const mountainMaterial = new THREE.MeshPhongMaterial({
        map: mountainTexture,
        color: 0x4a4a4a,
        shininess: 100
    });
    // beach
    const beachGeometry = new THREE.TorusGeometry(radius-30, 40, 2.5, 100);
    const beachTexture = textureLoader.load('/mountain.jpg');
    const beachMaterial = new THREE.MeshPhongMaterial({
        map: beachTexture,
        color: 0x4a4a4a,
        flatShading: true,
        shininess: 100
    });
    
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.rotation.x = Math.PI / 2;
    beach.position.y = 1;
    beach.castShadow = true;
    beach.receiveShadow = true;
    mountainGroup.add(beach);

    for (let i = 0; i < mountainCount; i++) {
        const angle = (i / mountainCount) * Math.PI * 2;
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        
        const radiusVariation = radius + (Math.random() * 40 - 20);
        mountain.position.x = Math.cos(angle) * radiusVariation;
        mountain.position.z = Math.sin(angle) * radiusVariation;
        mountain.position.y = 0;
        
        const baseScale = 0.6 + Math.random() * 0.8;
        mountain.scale.set(
            baseScale * (0.8 + Math.random() * 0.4),
            baseScale * (0.8 + Math.random() * 0.2),
            baseScale * (0.8 + Math.random() * 0.4)
        );
        mountain.rotation.y = Math.random() * Math.PI * 2;
        
        mountain.castShadow = true;
        mountain.receiveShadow = true;
        mountainGroup.add(mountain);
    }
    
    scene.add(mountainGroup);
}