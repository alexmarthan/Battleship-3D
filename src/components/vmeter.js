import * as THREE from 'three';

class VMeter {
    constructor(player) {
        this.player = player;
        this.mesh = null;
        this.tick = null;
        this.tickGroup = null;
        this.currentAngle = 0;
        this.createMeter();
        this.updateValue(0);
    }

    createMeter() {
        const innerRadius = 0.85;
        const outerRadius = 1;
        const thetaSegments = 32;

        let thetaStart = 0;
        let thetaLength = Math.PI / 2;

        if (this.player === 2) {
            thetaStart = Math.PI / 2;
        }

        const geometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            thetaSegments,
            1,
            thetaStart,
            thetaLength
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0x05ff9e,
            side: THREE.DoubleSide
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
        this.tick = new THREE.Mesh(tickGeometry, tickMaterial);

        outlineTick.rotation.x = Math.PI / 2;
        this.tick.rotation.x = Math.PI / 2;
        
        this.tickGroup = new THREE.Group();
        this.tickGroup.add(outlineTick);
        this.tickGroup.add(this.tick);

        this.mesh.add(this.tickGroup);
    }

    updateValue(angle) {
        let clampedAngle;
        if (this.player === 1) {
             clampedAngle = THREE.MathUtils.clamp(angle, 0, Math.PI / 2);
        } else {
             clampedAngle = THREE.MathUtils.clamp(angle, Math.PI / 2, Math.PI);
        }
         this.currentAngle = clampedAngle;

        const outerRadius = 1;
        const x = outerRadius * Math.cos(this.currentAngle);
        const y = outerRadius * Math.sin(this.currentAngle);
        
        this.tickGroup.position.set(x, y, 0);
        this.tickGroup.rotation.z = this.currentAngle + Math.PI / 2;
    }

    getAngle() {
        const position = this.tickGroup.position;
        let angleRad = Math.atan2(position.y, position.x);
        
        let angleDeg = THREE.MathUtils.radToDeg(angleRad);

        if (this.player === 1) {
            angleDeg = THREE.MathUtils.clamp(angleDeg, 0, 90);
        } else {
             angleDeg = THREE.MathUtils.clamp(angleDeg, 90, 180);
        }

        return angleDeg;
    }

    positionForAiming(camera) {
        const cameraPosition = camera.position.clone();
        const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        
        const meterPosition = cameraPosition.clone().add(cameraDirection.multiplyScalar(5));
        
        this.mesh.position.copy(meterPosition);
        this.mesh.position.x += .07;
        this.mesh.position.y += .15;
        this.mesh.lookAt(camera.position);
    }
    // different meter positions for player 1 and 2
    static positionAllMeters(camera, gameState, vMeterPlayer1, vMeterPlayer2, hMeter) {
        if (gameState.currentPlayer === 1) {
            vMeterPlayer1.positionForAiming(camera);
            hMeter.mesh.position.copy(vMeterPlayer1.mesh.position);
        } else {
            vMeterPlayer2.positionForAiming(camera);
            hMeter.mesh.position.copy(vMeterPlayer2.mesh.position);
        }
        
        hMeter.mesh.position.y += .05;
        hMeter.mesh.lookAt(camera.position);
    }
}

export default VMeter; 