import * as THREE from 'three';

export default class HMeter {
    constructor() {
        this.currentAngle = 0;
        this.createMeter();
        this.updateValue(0);
    }

    createMeter() {
        const innerRadius = 0.85;
        const outerRadius = 1;
        const thetaSegments = 32;
        const geometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            thetaSegments,
            1,
            0,
            Math.PI
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0x05ff9e
        });

        this.mesh = new THREE.Mesh(geometry, material);
        const tickRadius = 0.04;
        const tickHeight = 0.2;
        const tickRadialSegments = 8;

        const outlineGeometry = new THREE.CylinderGeometry(tickRadius, tickRadius, tickHeight, tickRadialSegments);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const outlineTick = new THREE.Mesh(outlineGeometry, outlineMaterial);
        
        const tickGeometry = new THREE.CylinderGeometry(tickRadius * 0.6, tickRadius * 0.6, tickHeight, tickRadialSegments);
        const tickMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        const tick = new THREE.Mesh(tickGeometry, tickMaterial);
        outlineTick.rotation.x = Math.PI / 2;
        tick.rotation.x = Math.PI / 2;
        
        this.tickGroup = new THREE.Group();
        this.tickGroup.add(outlineTick);
        this.tickGroup.add(tick);

        this.mesh.add(this.tickGroup);
    }

    updateValue(angle) {
        this.currentAngle = Math.max(0, Math.min(angle, Math.PI));
        const outerRadius = 1;
        const x = Math.cos(this.currentAngle) * outerRadius;
        const y = Math.sin(this.currentAngle) * outerRadius;
        this.tickGroup.position.set(x, y, 0);
        this.tickGroup.rotation.z = this.currentAngle + Math.PI / 2;
    }

    getAngle() {
        const angle = Math.atan2(this.tickGroup.position.y, this.tickGroup.position.x);
        const degrees = THREE.MathUtils.radToDeg(angle);
        return Math.max(0, Math.min(degrees, 180));
    }
}
