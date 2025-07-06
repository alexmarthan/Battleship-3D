import * as THREE from 'three';

class SkyExplosions {
    constructor(options = {}) {
        this.options = {
            count: options.count || 18,
            minRadius: options.minRadius || 10,
            maxRadius: options.maxRadius || 20,
            centerPosition: options.centerPosition || { x: 0, y: 0, z: 0 },
            minDistance: options.minDistance || 70,
            maxDistance: options.maxDistance || 500,
            explosionDuration: options.explosionDuration || 1.8,
            timeBetweenExplosions: options.timeBetweenExplosions || 2.5,
            minHeight: options.minHeight || 75,
            maxHeight: options.maxHeight || 450,
            ...options
        };
        
        this.explosions = [];
        this.group = new THREE.Group();
        this.clock = new THREE.Clock();
        this.visible = false;
        this.init();
    }
    
    init() {
        this.createExplosionSystems();
    }
    
    createExplosionSystems() {
        const centerPos = this.options.centerPosition;
        
        for (let i = 0; i < this.options.count; i++) {
            const radius = this.options.minRadius + Math.random() * (this.options.maxRadius - this.options.minRadius);
            
            // multiple cloud layers
            let x, y, z;
            const layerType = Math.floor(Math.random() * 3);
            
            if (layerType === 0) {
                const angle = (i / this.options.count) * Math.PI * 2 + Math.random() * 0.5;
                const distance = this.options.minDistance + Math.random() * 100;
                x = centerPos.x + Math.cos(angle) * distance;
                z = centerPos.z + Math.sin(angle) * distance;
                y = this.options.minHeight + Math.random() * 75;
                
            } else if (layerType === 1) {
                const angle = (i / this.options.count) * Math.PI * 2 + Math.random() * 0.8;
                const distance = this.options.minDistance + Math.random() * 200;
                x = centerPos.x + Math.cos(angle) * distance;
                z = centerPos.z + Math.sin(angle) * distance;
                y = 350 + Math.random() * 100;
                
            } else {
                const angle = Math.random() * Math.PI * 2;
                const distance = this.options.minDistance + Math.random() * 350;
                x = centerPos.x + Math.cos(angle) * distance;
                z = centerPos.z + Math.sin(angle) * distance;
                y = 150 + Math.random() * 100;
            }
            
            // set of explosions
            const explosionGroup = new THREE.Group();
            explosionGroup.position.set(x, y, z);
            
            const outerGeometry = new THREE.SphereGeometry(radius * 1.4, 32, 32);
            const outerMaterial = new THREE.MeshPhongMaterial({
                color: 0x8B0000,
                transparent: true,
                opacity: 0,
                emissive: 0x8B0000,
                emissiveIntensity: 0,
                side: THREE.DoubleSide
            });
            const outerShell = new THREE.Mesh(outerGeometry, outerMaterial);
            
            const middleGeometry = new THREE.SphereGeometry(radius * 1.0, 32, 32);
            const middleMaterial = new THREE.MeshPhongMaterial({
                color: 0xFF6600,
                transparent: true,
                opacity: 0,
                emissive: 0xFF6600,
                emissiveIntensity: 0,
                side: THREE.DoubleSide
            });
            const middleLayer = new THREE.Mesh(middleGeometry, middleMaterial);
            
            const innerGeometry = new THREE.SphereGeometry(radius * 0.5, 32, 32);
            const innerMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFFFCC,
                transparent: true,
                opacity: 0,
                emissive: 0xFFFFCC,
                emissiveIntensity: 0,
                side: THREE.DoubleSide
            });
            const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
            
            explosionGroup.add(outerShell);
            explosionGroup.add(middleLayer);
            explosionGroup.add(innerCore);
            
            const light = new THREE.PointLight(0xFFAA44, 0, radius * 12);
            light.position.set(0, 0, 0);
            explosionGroup.add(light);
            
            const explosionData = {
                group: explosionGroup,
                outerShell: outerShell,
                middleLayer: middleLayer,
                innerCore: innerCore,
                light: light,
                timer: Math.random() * 6,
                interval: 3 + Math.random() * 5,
                isExploding: false,
                progress: 0,
                originalRadius: radius,
                maxScale: 2.0 + Math.random() * 1.5,
                layerType: layerType
            };
            
            this.explosions.push(explosionData);
            this.group.add(explosionGroup);
        }
    }
    
    addToScene(scene) {
        scene.add(this.group);
    }
    
    setVisible(visible) {
        this.visible = visible;
        this.group.visible = visible;
    }
    
    update(time) {
        if (!this.visible) return;
        
        const deltaTime = this.clock.getDelta();
        
        this.explosions.forEach((explosion, index) => {
            explosion.timer += deltaTime;
            
            if (!explosion.isExploding && explosion.timer >= explosion.interval) {
                explosion.isExploding = true;
                explosion.progress = 0;
                explosion.timer = 0;
                explosion.interval = 2.5 + Math.random() * 6;
                
                const offset = 12;
                explosion.group.position.x += (Math.random() - 0.5) * offset;
                explosion.group.position.y += (Math.random() - 0.5) * offset * 0.3;
                explosion.group.position.z += (Math.random() - 0.5) * offset;
            }
            
            if (explosion.isExploding) {
                explosion.progress += deltaTime / this.options.explosionDuration;
                
                if (explosion.progress >= 1.0) {
                    explosion.isExploding = false;
                    explosion.progress = 0;
                    
                    explosion.outerShell.material.opacity = 0;
                    explosion.outerShell.material.emissiveIntensity = 0;
                    explosion.middleLayer.material.opacity = 0;
                    explosion.middleLayer.material.emissiveIntensity = 0;
                    explosion.innerCore.material.opacity = 0;
                    explosion.innerCore.material.emissiveIntensity = 0;
                    explosion.light.intensity = 0;
                    
                    explosion.group.scale.set(1, 1, 1);
                    
                } else {
                    const progress = explosion.progress;
                    let intensity, scale;
                    
                    if (progress < 0.2) {
                        const phaseProgress = progress / 0.2;
                        intensity = Math.pow(phaseProgress, 0.4);
                        scale = 1 + phaseProgress * explosion.maxScale * 0.6;
                        
                    } else if (progress < 0.5) {
                        intensity = 1.0;
                        const phaseProgress = (progress - 0.2) / 0.3;
                        scale = 1 + (0.6 + phaseProgress * 0.4) * explosion.maxScale;
                        
                    } else {
                        const phaseProgress = (progress - 0.5) / 0.5;
                        intensity = Math.pow(1.0 - phaseProgress, 1.2);
                        scale = 1 + explosion.maxScale * (1.0 - phaseProgress * 0.2);
                    }
                    
                    explosion.group.scale.set(scale, scale, scale);
                    
                    const outerIntensity = Math.min(intensity * 1.4, 1.0);
                    explosion.outerShell.material.opacity = outerIntensity * 0.8;
                    explosion.outerShell.material.emissiveIntensity = outerIntensity * 1.2;
                    
                    const middleDelay = Math.max(0, (progress - 0.05) / 0.95);
                    const middleIntensity = Math.min(middleDelay * intensity * 1.6, 1.0);
                    explosion.middleLayer.material.opacity = middleIntensity * 0.9;
                    explosion.middleLayer.material.emissiveIntensity = middleIntensity * 1.5;
                    
                    const innerDelay = Math.max(0, (progress - 0.1) / 0.9);
                    const innerIntensity = Math.min(innerDelay * intensity * 2.2, 1.0);
                    explosion.innerCore.material.opacity = innerIntensity * 1.0;
                    explosion.innerCore.material.emissiveIntensity = innerIntensity * 2.5;
                    
                    explosion.light.intensity = intensity * 15;
                    
                    if (Math.random() < 0.1) {
                        const flicker = 0.8 + Math.random() * 0.4;
                        explosion.light.intensity *= flicker;
                        explosion.innerCore.material.emissiveIntensity *= flicker;
                    }
                }
            }
        });
    }
    
    triggerExplosion(index) {
        if (index >= 0 && index < this.explosions.length) {
            const explosion = this.explosions[index];
            explosion.isExploding = true;
            explosion.progress = 0;
            explosion.timer = 0;
        }
    }
    
    triggerAllExplosions() {
        this.explosions.forEach(explosion => {
            explosion.isExploding = true;
            explosion.progress = 0;
            explosion.timer = 0;
        });
    }
    
    triggerLayerExplosions(layerType) {
        this.explosions.forEach(explosion => {
            if (explosion.layerType === layerType) {
                explosion.isExploding = true;
                explosion.progress = 0;
                explosion.timer = 0;
            }
        });
    }
    
    setCenterPosition(x, y, z) {
        this.options.centerPosition = { x, y, z };
    }
}

export default SkyExplosions; 