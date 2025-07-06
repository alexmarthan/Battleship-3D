import * as THREE from 'three';

export function startIntro(camera, controls, startShipPlacement) {
    const duration = 10000;
    const startTime = Date.now();
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const endPosition = new THREE.Vector3(0, 70, 0);
    const endRotation = new THREE.Euler(-Math.PI/2, 0, 0);
    
    function animateIntro() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease in ease out for smooth move
        const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        camera.position.lerpVectors(startPosition, endPosition, easeProgress);

        camera.rotation.x = startRotation.x + (endRotation.x - startRotation.x) * easeProgress;
        camera.rotation.y = startRotation.y + (endRotation.y - startRotation.y) * easeProgress;
        camera.rotation.z = startRotation.z + (endRotation.z - startRotation.z) * easeProgress;
        
        controls.target.set(0, 0, 0);
        
        if (progress < 1) {
            requestAnimationFrame(animateIntro);
        } else {
            window.isCinematicPlaying = false;
            startShipPlacement();
        }
    }
    
    window.isCinematicPlaying = true;
    animateIntro();
} 