import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GameState } from './src/game/GameState';
import { Ship } from './src/components/Ship';
import { Cannonball } from './src/components/cannonball.js';
import { GameUI } from './src/components/GameUI';
import VMeter from './src/components/vmeter.js';
import HMeter from './src/components/hmeter.js';
import SkyExplosions from './src/components/SkyExplosions';
import Clouds from './src/components/clouds.js';
import Info from './src/components/info.js';
import { Skybox } from './src/components/skybox.js';
import { startIntro } from './src/components/intro.js';
import { createEnvironment } from './src/components/environment.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// scene.fog = new THREE.FogExp2(0x87CEEB, 0.005);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

camera.position.set(0, 70, 0);
controls.target.set(0, 0, 0);
const overviewPosition = new THREE.Vector3(0, 70, 0);

const gameState = new GameState();
const gameUI = new GameUI(gameState);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const vMeterPlayer1 = new VMeter(1);
const vMeterPlayer2 = new VMeter(2);
const hMeter = new HMeter();

gameUI.setMeters(vMeterPlayer1, vMeterPlayer2, hMeter);

scene.add(vMeterPlayer1.mesh);
scene.add(vMeterPlayer2.mesh);
scene.add(hMeter.mesh);
//sky
const skybox = new Skybox();
scene.background = skybox.getTexture();
//water
const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('/cwater.jpg');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(10, 10);
waterTexture.center.set(0.5, 0.5);

const waterGeometry = new THREE.BoxGeometry(500, 1000, 500);
const waterMaterials = [
    new THREE.MeshBasicMaterial({ map: waterTexture }),
    new THREE.MeshBasicMaterial({ map: waterTexture }),
    new THREE.MeshBasicMaterial({ map: waterTexture }),
    new THREE.MeshBasicMaterial({ map: waterTexture }),
    new THREE.MeshBasicMaterial({ map: waterTexture }),
    new THREE.MeshBasicMaterial({ map: waterTexture }),
];
const water = new THREE.Mesh(waterGeometry, waterMaterials);
water.position.y = -500;
water.receiveShadow = true;
scene.add(water);

// lights
/* const pointLight = new THREE.DirectionalLight(0xffffff, 25);
pointLight.position.set(0, 1200, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 10;
pointLight.shadow.camera.far = 2000;
scene.add(pointLight); */
const cornerpos = [
    {x: 220, y: 1200, z: 220},
    {x: -220, y: 1200, z: 220},
    {x: -220, y: 1200, z: -220},
    {x: 220, y: 1200, z: -220}
];
for (let i = 0; i < 4; i++){
    const sunLight = new THREE.DirectionalLight(0xffffff, 10);
    sunLight.position.set(cornerpos[i].x, cornerpos[i].y, cornerpos[i].z);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
}
const ambientLight = new THREE.AmbientLight(0x808080);
scene.add(ambientLight);

// divider
const dividerGeometry = new THREE.BoxGeometry(0.5, 0.5, 100);
const dividerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
divider.position.set(0, 0.05, 0);
divider.visible = false;
scene.add(divider);

// cannonballs in play
const activeCannonballs = [];
const activeVisuals = [];
const activeSmokeParticles = [];

// title
const titleOverlay = document.createElement('div');
titleOverlay.style.position = 'fixed';
titleOverlay.style.top = '0';
titleOverlay.style.left = '0';
titleOverlay.style.width = '100%';
titleOverlay.style.height = '100%';
titleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
titleOverlay.style.color = 'white';
titleOverlay.style.display = 'flex';
titleOverlay.style.flexDirection = 'column';
titleOverlay.style.alignItems = 'center';
titleOverlay.style.justifyContent = 'center';
titleOverlay.style.zIndex = '1000';
titleOverlay.style.fontFamily = 'Arial, sans-serif';

const titleContent = document.createElement('div');
titleContent.style.textAlign = 'center';

const titleText = document.createElement('h1');
titleText.textContent = 'BattleShip 3D';
titleText.style.fontSize = '5em';
titleText.style.color = '#4CAF50';
titleText.style.marginBottom = '40px';
titleText.style.textShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
titleContent.appendChild(titleText);

const startGameButton = document.createElement('button');
startGameButton.textContent = 'Start Game';
startGameButton.style.padding = '20px 60px';
startGameButton.style.fontSize = '24px';
startGameButton.style.backgroundColor = '#4CAF50';
startGameButton.style.color = 'white';
startGameButton.style.border = 'none';
startGameButton.style.borderRadius = '5px';
startGameButton.style.cursor = 'pointer';
startGameButton.style.transition = 'all 0.3s ease';
startGameButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';

startGameButton.onmouseover = () => {
    startGameButton.style.backgroundColor = '#45a049';
    startGameButton.style.transform = 'scale(1.05)';
    startGameButton.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.5)';
};

startGameButton.onmouseout = () => {
    startGameButton.style.backgroundColor = '#4CAF50';
    startGameButton.style.transform = 'scale(1)';
    startGameButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
};

titleContent.appendChild(startGameButton);
titleOverlay.appendChild(titleContent);
document.body.appendChild(titleOverlay);

// instructions
const instructionsOverlay = document.createElement('div');
instructionsOverlay.style.position = 'fixed';
instructionsOverlay.style.top = '0';
instructionsOverlay.style.left = '0';
instructionsOverlay.style.width = '100%';
instructionsOverlay.style.height = '100%';
instructionsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
instructionsOverlay.style.color = 'white';
instructionsOverlay.style.display = 'none';
instructionsOverlay.style.flexDirection = 'column';
instructionsOverlay.style.alignItems = 'center';
instructionsOverlay.style.justifyContent = 'center';
instructionsOverlay.style.zIndex = '1000';
instructionsOverlay.style.fontFamily = 'Arial, sans-serif';

const instructionsContent = document.createElement('div');
instructionsContent.style.maxWidth = '800px';
instructionsContent.style.padding = '20px';
instructionsContent.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
instructionsContent.style.borderRadius = '10px';
instructionsContent.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';

instructionsContent.innerHTML = `
    <h1 style="text-align: center; color: #4CAF50; margin-bottom: 20px;">Battleship 3D - Instructions</h1>
    
    <h2 style="color: #4CAF50; margin-top: 20px;">Ship Placement Phase</h2>
    <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">⬆️ <strong>W:</strong> Move ship forward</li>
        <li style="margin: 10px 0;">⬅️ <strong>A:</strong> Move ship left</li>
        <li style="margin: 10px 0;">⬇️ <strong>S:</strong> Move ship backward</li>
        <li style="margin: 10px 0;">➡️ <strong>D:</strong> Move ship right</li>
        <li style="margin: 10px 0;">🔄 <strong>R:</strong> Rotate ship</li>
        <li style="margin: 10px 0;">⏯️ <strong>Space:</strong> Place ship</li>
    </ul>
    
    <h2 style="color: #4CAF50; margin-top: 20px;">Gameplay Controls</h2>
    <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">🖱️ <strong>Mouse Movement:</strong> Look around the battlefield</li>
        <li style="margin: 10px 0;">🖱️ <strong>Mouse Wheel:</strong> Zoom in/out</li>
        <li style="margin: 10px 0;">🖱️ <strong>Click Ship:</strong> Select a ship to fire from</li>
        <li style="margin: 10px 0;">🎯 <strong>Angle Controls:</strong> Adjust vertical and horizontal angles for firing</li>
        <li style="margin: 10px 0;">🔥 <strong>Fire Button:</strong> Launch cannonball at current angles</li>
    </ul>
    
    <h2 style="color: #4CAF50; margin-top: 20px;">Gameplay</h2>
    <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;">🚢 <strong>Ships:</strong> Each player has 5 ships of different sizes</li>
        <li style="margin: 10px 0;">💥 <strong>Damage:</strong> Larger ships deal more damage</li>
        <li style="margin: 10px 0;">🎯 <strong>Aiming:</strong> Consider gravity and distance when aiming</li>
        <li style="margin: 10px 0;">🏆 <strong>Victory:</strong> Sink all enemy ships to win</li>
    </ul>
`;

const beginGameButton = document.createElement('button');
beginGameButton.textContent = 'Begin Battle';
beginGameButton.style.marginTop = '30px';
beginGameButton.style.padding = '15px 40px';
beginGameButton.style.fontSize = '20px';
beginGameButton.style.backgroundColor = '#4CAF50';
beginGameButton.style.color = 'white';
beginGameButton.style.border = 'none';
beginGameButton.style.borderRadius = '5px';
beginGameButton.style.cursor = 'pointer';
beginGameButton.style.transition = 'all 0.3s ease';
beginGameButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';

beginGameButton.onmouseover = () => {
    beginGameButton.style.backgroundColor = '#45a049';
    beginGameButton.style.transform = 'scale(1.05)';
    beginGameButton.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.5)';
};

beginGameButton.onmouseout = () => {
    beginGameButton.style.backgroundColor = '#4CAF50';
    beginGameButton.style.transform = 'scale(1)';
    beginGameButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
};

instructionsContent.appendChild(beginGameButton);
instructionsOverlay.appendChild(instructionsContent);
document.body.appendChild(instructionsOverlay);

startGameButton.addEventListener('click', () => {
    titleOverlay.style.display = 'none';
    instructionsOverlay.style.display = 'flex';
});
// game starts here
beginGameButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        instructionsOverlay.style.display = 'none';
        isCinematicPlaying = true;
        divider.visible = true;
        clouds.setVisible(true);
        skyExplosions.setVisible(true);
        camera.position.set(0, 200, 150);
        camera.lookAt(0, 0, 0);
        createGrid();
        startIntro(camera, controls, startShipPlacement);
    }
});

// starting state
let gameStarted = false;
let isCinematicPlaying = false;

// player turns
let currentPlayer = 1;
let currentShipIndex = 0;
let isPlacingShip = false;
let currentShip = null;
const shipSizes = [8, 6, 4, 4, 2];
const moveSpeed = 0.5;
const rotationSpeed = Math.PI / 4;

// placement moves
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    r: false,
    space: false
};

window.addEventListener('keydown', (event) => {
    if (!isPlacingShip) return;
    
    switch(event.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
        case 'r': keys.r = true; break;
        case ' ': keys.space = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch(event.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
        case 'r': keys.r = false; break;
        case ' ': keys.space = false; break;
    }
});

// grid
const GRID_SIZE = 5;
const GRID_WIDTH = 20;
const GRID_DEPTH = 20;

function createGrid() {
    const gridGeometry = new THREE.PlaneGeometry(GRID_SIZE * GRID_WIDTH, GRID_SIZE * GRID_DEPTH);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.1;
    scene.add(grid);

    const gridHelper = new THREE.GridHelper(
        GRID_SIZE * GRID_WIDTH, 
        GRID_WIDTH, 
        0x000000,
        0x000000,
        2,
        2
    );
    gridHelper.position.y = 0.2;
    scene.add(gridHelper);
}

function snapToGrid(position) {
    const x = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
    const z = Math.round(position.z / GRID_SIZE) * GRID_SIZE;
    return new THREE.Vector3(x, position.y, z);
}

// clouds
const clouds = new Clouds();
clouds.addToScene(scene);
clouds.setVisible(false);

// explosions
const skyExplosions = new SkyExplosions({
    count: 18,
    minRadius: 2.5,
    maxRadius: 5,
    minDistance: 70,
    maxDistance: 500,
    minHeight: 30,
    maxHeight: 120
});
skyExplosions.addToScene(scene);
skyExplosions.setVisible(false);

// ship health/damage
const info = new Info();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ship selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
    if (gameState.gamePhase !== 'SHIP_SELECTED' && 
        gameState.gamePhase !== 'VERTICAL_AIMING' && 
        gameState.gamePhase !== 'HORIZONTAL_AIMING') return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        const ship = gameState.ships[`player${gameState.currentPlayer}`].find(s => 
            s.mesh.children.includes(selectedObject) || s.mesh === selectedObject
        );
        
        if (ship) {
            if (gameState.selectedShip) {
                gameState.selectedShip.unhighlight();
            }
            gameState.selectedShip = ship;
            ship.highlight();
            moveCameraToShootingPosition(ship);
            // selected goes to vert. aiming after choice
            if (gameState.gamePhase === 'SHIP_SELECTED') {
                gameState.gamePhase = 'VERTICAL_AIMING';
                meterVisibility();
                gameUI.updateStatus();
            }
        }
    }
});

// camera swing
function moveCameraToShootingPosition(ship) {
    const shipPosition = ship.mesh.position.clone();
    const offset = new THREE.Vector3(0, 8, 25);
    const cameraPosition = shipPosition.clone().add(offset);
    const duration = 1500;
    const startPosition = camera.position.clone();
    const startTime = Date.now();
    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        camera.position.lerpVectors(startPosition, cameraPosition, easeProgress);
        controls.target.copy(shipPosition);
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    }
    
    animateCamera();
}

function meterVisibility() {
    switch (gameState.gamePhase) {
        case 'VERTICAL_AIMING':
            if (gameState.currentPlayer === 1) {
                vMeterPlayer1.mesh.visible = true;
                vMeterPlayer2.mesh.visible = false;
            } else {
                vMeterPlayer1.mesh.visible = false;
                vMeterPlayer2.mesh.visible = true;
            }
            hMeter.mesh.visible = false;
            clouds.setVisible(true);
            skyExplosions.setVisible(true);
            break;
        case 'HORIZONTAL_AIMING':
            vMeterPlayer1.mesh.visible = false;
            vMeterPlayer2.mesh.visible = false;
            hMeter.mesh.visible = true;
            clouds.setVisible(true);
            skyExplosions.setVisible(true);
            break;
        case 'FIRING':
            vMeterPlayer1.mesh.visible = false;
            vMeterPlayer2.mesh.visible = false;
            hMeter.mesh.visible = false;
            clouds.setVisible(true);
            skyExplosions.setVisible(true);
            break;
        default:
            vMeterPlayer1.mesh.visible = false;
            vMeterPlayer2.mesh.visible = false;
            hMeter.mesh.visible = false;
            clouds.setVisible(false);
            skyExplosions.setVisible(false);
            break;
    }
}

// firing
document.querySelector('button').addEventListener('click', () => {
    if (gameState.selectedShip && (gameState.gamePhase === 'VERTICAL_AIMING' || gameState.gamePhase === 'HORIZONTAL_AIMING')) {
        // vertical goes to horizontal, not firing
        if (gameState.gamePhase === 'VERTICAL_AIMING') {
            const shipPosition = gameState.selectedShip.mesh.position.clone();
            let offsetX = -25;
            if (gameState.currentPlayer === 2) {
                offsetX = 25;
            }
            const offset = new THREE.Vector3(offsetX, 8, 0);
            const cameraPosition = shipPosition.clone().add(offset);
            const duration = 1500;
            const startPosition = camera.position.clone();
            const startTime = Date.now();
            function animateCameraSwing() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                camera.position.lerpVectors(startPosition, cameraPosition, easeProgress);
                controls.target.copy(shipPosition);
                if (progress < 1) {
                    requestAnimationFrame(animateCameraSwing);
                } else {
                    gameState.transitionAimingPhase();
                    meterVisibility();
                    gameUI.updateStatus();
                }
            }
            animateCameraSwing();
            return;
        }

        // horizontal aim goes to firing
        if (gameState.gamePhase === 'HORIZONTAL_AIMING') {
            // angles 
            const angles = gameUI.getAngles();
            const vMeter = gameState.currentPlayer === 1 ? vMeterPlayer1 : vMeterPlayer2;
/*             console.log('vangle:', vMeter.getAngle());
            console.log('hangle:', hMeter.getAngle()); */
            
            // damage
            let damage;
            const firingShipSize = gameState.selectedShip.size;
            if (firingShipSize >= 6) {
                damage = 3;
            } else if (firingShipSize >= 4) {
                damage = 2;
            } else {
                damage = 1;
            }
            // console.log('Firing ship size:', firingShipSize, 'Damage:', damage);
            const cannonball = new Cannonball(angles.vertical, angles.horizontal, damage);
            const shipPos = gameState.selectedShip.mesh.position.clone();
            // console.log('Ship position:', shipPos);
            cannonball.mesh.position.copy(shipPos);
            cannonball.mesh.position.y += 2;
            // console.log('cball start:', cannonball.mesh.position);
            scene.add(cannonball.mesh);
            activeCannonballs.push(cannonball);
            
            // hits
            const explosionGeometry = new THREE.SphereGeometry(2, 32, 32);
            const explosionMaterial = new THREE.MeshBasicMaterial({
                color: 0xff872b,
                transparent: true,
                opacity: 0.8
            });
            const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
            explosion.position.copy(cannonball.mesh.position);
            scene.add(explosion);
            let explosionTime = 0;
            const explosionDuration = 0.5;
            const explosionUpdate = (deltaTime) => {
                explosionTime += deltaTime;
                if (explosionTime >= explosionDuration) {
                    scene.remove(explosion);
                    return true;
                }
                explosion.scale.setScalar(1 + explosionTime * 2);
                explosion.material.opacity = 0.8 * (1 - explosionTime / explosionDuration);
                return false;
            };

            activeVisuals.push({ mesh: explosion, update: explosionUpdate });
            
            gameState.gamePhase = 'FIRING';
            meterVisibility();
                    gameUI.updateStatus();
        }
    }
});

// slight delay to allow for cannonball travel
let lastMoveTime = 0;
const moveDelay = 200;

function animate() {
    requestAnimationFrame(animate);

    // explosion minimal for performance
    if (isCinematicPlaying || (!isPlacingShip && (
        gameState.gamePhase === 'VERTICAL_AIMING' || 
        gameState.gamePhase === 'HORIZONTAL_AIMING' ||
        gameState.gamePhase === 'FIRING'))) {
        skyExplosions.update();
    }

    // placement section
    if (isPlacingShip && currentShip) {
        const currentTime = Date.now();
        let newPosition = currentShip.mesh.position.clone();
        let moved = false;
        
        if (currentTime - lastMoveTime > moveDelay) {
            // Store original position
            const originalPosition = currentShip.mesh.position.clone();
            if (keys.w) { newPosition.z -= GRID_SIZE; moved = true; }
            if (keys.s) { newPosition.z += GRID_SIZE; moved = true; }
            if (keys.a) { newPosition.x -= GRID_SIZE; moved = true; }
            if (keys.d) { newPosition.x += GRID_SIZE; moved = true; }
            
            if (moved) {
                newPosition = snapToGrid(newPosition);
                currentShip.mesh.position.copy(newPosition);
                if (!isValidShipPosition(currentShip)) {
                    currentShip.mesh.position.copy(originalPosition);
                }
                lastMoveTime = currentTime;
            }
        }
        
        // rotation
        if (keys.r && currentTime - lastMoveTime > moveDelay) {
            const originalRotation = currentShip.mesh.rotation.y;
            currentShip.mesh.rotation.y += Math.PI / 2;

            if (!isValidShipPosition(currentShip)) {
                currentShip.mesh.rotation.y = originalRotation;
            } else {
                lastMoveTime = currentTime;
            }
        }
        
        // final placement
        if (keys.space) {
            if (isValidShipPosition(currentShip)) {
                gameState.addShip(currentPlayer, currentShip);
                currentShipIndex++;
                placeNextShip();
            } else {
                currentShip.mesh.children.forEach(child => {
                    if (child.material) {
                        // Skip the deck using the marker
                        if (!child.userData.isDeck) {
                            child.material.color.setHex(currentPlayer === 1 ? 0x00008B : 0x8B0000);
                        }
                    }
                });
                // flash red to show invalid
                setTimeout(() => {
                    if (currentShip) {
                        currentShip.mesh.children.forEach(child => {
                            if (child.material) {
                                if (!child.userData.isDeck) {
                                    child.material.color.setHex(currentPlayer === 1 ? 0x00008B : 0x8B0000);
                                }
                            }
                        });
                    }
                }, 200);
            }
        }
    }
    
    // update active visual effects
    for (let i = activeVisuals.length - 1; i >= 0; i--) {
        const particle = activeVisuals[i];
        if (particle.update(0.016)) {
            activeVisuals.splice(i, 1);
        }
    }

    for (let i = activeCannonballs.length - 1; i >= 0; i--) {
        const cannonball = activeCannonballs[i];
        // cannonballs and collisions update frequencey
        cannonball.update(0.016);
        const opponentShips = gameState.ships[`player${gameState.currentPlayer === 1 ? 2 : 1}`];
        // console.log('check for hits:', opponentShips.length);
        for (const ship of opponentShips) {
            // mesh object for collision
            const shipBox = new THREE.Box3().setFromObject(ship.mesh);
            const cannonballPos = cannonball.mesh.position;
            // console.log('collision check:', {
            //     shipId: ship.id,
            //     shipHealth: ship.health,
            //     cannonballPos: cannonballPos,
            //     shipBox: {
            //         min: shipBox.min,
            //         max: shipBox.max
            //     }
            // });
            
            if (shipBox.containsPoint(cannonballPos)) {
                // console.log('hit');
                const isSunk = ship.takeDamage(cannonball.damage);
                // console.log(`hit, damage: ${cannonball.damage}, Ship health: ${ship.health}, Ship sunk: ${isSunk}`);
                // hit effects
                const explosionGeometry = new THREE.SphereGeometry(isSunk ? 4 : 2, 32, 32);
                const explosionMaterial = new THREE.MeshBasicMaterial({
                    color: isSunk ? 0xff2b2b : 0xff872b,
                    transparent: true,
                    opacity: 0.8
                });
                const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
                explosion.position.copy(cannonballPos);
                scene.add(explosion);

                // explosion
                let explosionTime = 0;
                const explosionDuration = 0.5;
                const explosionUpdate = (deltaTime) => {
                    explosionTime += deltaTime;
                    if (explosionTime >= explosionDuration) {
                        scene.remove(explosion);
                        return true;
                    }
                    explosion.scale.setScalar(1 + explosionTime * (isSunk ? 3 : 2));
                    explosion.material.opacity = 0.8 * (1 - explosionTime / explosionDuration);
                    return false;
                };

                activeVisuals.push({ mesh: explosion, update: explosionUpdate });

                // delete cannonball
                scene.remove(cannonball.mesh);
                activeCannonballs.splice(i, 1);
                // back to selection
                setTimeout(() => {
                    gameState.gamePhase = 'SHIP_SELECTED';
                    gameState.switchPlayer();
                    if (gameState.selectedShip) {
                        gameState.selectedShip.unhighlight();
                        gameState.selectedShip = null;
                    }
                    
                    // update health at return to selection
                    gameState.ships.player1.forEach(ship => {
                        info.updateHealthBar(ship, ship.health);
                    });
                    gameState.ships.player2.forEach(ship => {
                        info.updateHealthBar(ship, ship.health);
                    });
                    
                    const duration = 1000;
                    const startPosition = camera.position.clone();
                    const startTime = Date.now();
                    
                    function animateCameraBack() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                        
                        camera.position.lerpVectors(startPosition, overviewPosition, easeProgress);
                        controls.target.set(0, 0, 0);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCameraBack);
                        } else {
                            // Camera animation complete - effects handled by game state
                            return;
                        }
                    }
                    
                    animateCameraBack();
                    gameUI.updateStatus();
                }, 2000); // delay after hit
                break;
            }
        }
        
        // remove misses (below water)
        if (cannonball.mesh.position.y < 0) {

            scene.remove(cannonball.mesh);
            activeCannonballs.splice(i, 1);
            setTimeout(() => {
                gameState.gamePhase = 'SHIP_SELECTED';
                gameState.switchPlayer();
                if (gameState.selectedShip) {
                    gameState.selectedShip.unhighlight();
                    gameState.selectedShip = null;
                }
                
                // update healths
                gameState.ships.player1.forEach(ship => {
                    info.updateHealthBar(ship, ship.health);
                });
                gameState.ships.player2.forEach(ship => {
                    info.updateHealthBar(ship, ship.health);
                });
                
                const duration = 1000;
                const startPosition = camera.position.clone();
                const startTime = Date.now();
                
                function animateCameraBack() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                    
                    camera.position.lerpVectors(startPosition, overviewPosition, easeProgress);
                    controls.target.set(0, 0, 0);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateCameraBack);
                    } else {
                        return;
                    }
                }
                animateCameraBack();
                gameUI.updateStatus();
            }, 2000); // delay
        }
    }
    // check for gameover
    if (gameState.gamePhase !== 'PLACEMENT' && gameState.gamePhase !== 'GAME_OVER') {
        const winner = gameState.checkWinCondition();
        if (winner) {
            gameState.gamePhase = 'GAME_OVER';
            gameUI.updateStatus();
            controls.enabled = false;
            skyExplosions.setVisible(false);
            clouds.setVisible(false);
        }
    }
    
    // meter updates
    if (gameState.gamePhase === 'VERTICAL_AIMING' || gameState.gamePhase === 'HORIZONTAL_AIMING') {
        VMeter.positionAllMeters(camera, gameState, vMeterPlayer1, vMeterPlayer2, hMeter);
    }
    
    // ship health
    if (gameState.gamePhase === 'SHIP_SELECTED') {
        gameState.ships.player1.forEach(ship => {
            info.updatePosition(ship, camera);
            info.updateHealthBar(ship, ship.health);
        });
        gameState.ships.player2.forEach(ship => {
            info.updatePosition(ship, camera);
            info.updateHealthBar(ship, ship.health);
        });
        info.showHealthBars();
    } else {
        info.hideHealthBars();
    }
    controls.update();
    renderer.render(scene, camera);
}

function createShip(size, player, position) {
    const ship = new Ship(size, player, position);
    const healthBar = info.createHealthBar(ship);
    healthBar.style.display = 'none';
    return ship;
}

function startShipPlacement() {
    isPlacingShip = true;
    currentShipIndex = 0;
    currentPlayer = 1;
    gameState.ships = { player1: [], player2: [] };
    info.removeAllHealthBars();
    info.hideHealthBars();
    clouds.setVisible(false);
    skyExplosions.setVisible(false);
    placeNextShip();
}

function placeNextShip() {
    if (currentShipIndex >= shipSizes.length) {
        if (currentPlayer === 1) {
            currentPlayer = 2;
            currentShipIndex = 0;
            gameUI.updateStatus("Player 2's turn to place ships");
            placeNextShip();
            return;
        } else {
            isPlacingShip = false;
            gameState.gamePhase = 'SHIP_SELECTED';
            gameUI.updateStatus();
            info.showHealthBars();
            return;
        }
    }

    const size = shipSizes[currentShipIndex];
    const xPos = currentPlayer === 1 ? -GRID_SIZE * (GRID_WIDTH/3) : GRID_SIZE * (GRID_WIDTH/3);
    const position = new THREE.Vector3(xPos, 0, 0);
    currentShip = createShip(size, currentPlayer, position);
    scene.add(currentShip.mesh);
    gameUI.updateStatus(`Player ${currentPlayer}: Place Ship ${currentShipIndex + 1} of ${shipSizes.length} (Size: ${size}) - Use WASD to move, R to rotate, SPACE to place`);
}

function isValidShipPosition(ship) {
    const position = ship.mesh.position;
    const boundingBox = ship.getBoundingBox();
    if (currentPlayer === 1) {
        if (position.x > -GRID_SIZE/2) return false;
    } else {
        if (position.x < GRID_SIZE/2) return false;
    }
    const halfWidth = (GRID_SIZE * GRID_WIDTH) / 2;
    const halfDepth = (GRID_SIZE * GRID_DEPTH) / 2;
    // make a buffer to check for collision at the next "grid position"
    const buffer = GRID_SIZE;

    if (currentPlayer === 1) {
        if (boundingBox.min.x < -halfWidth + buffer || boundingBox.max.x > -buffer) return false;
    } else {
        if (boundingBox.min.x < buffer || boundingBox.max.x > halfWidth - buffer) return false;
    }
    if (boundingBox.min.z < -halfDepth + buffer || boundingBox.max.z > halfDepth - buffer) return false;
    
    const playerShips = gameState.ships[`player${currentPlayer}`];
    for (let i = 0; i < currentShipIndex; i++) {
        const placedShip = playerShips[i];
        if (placedShip) {
            const placedBox = placedShip.getBoundingBox();
            if (ship.getBoundingBox().intersectsBox(placedBox)) {
                return false;
            }
        }
    }
    return true;
}

renderer.domElement.addEventListener('click', (event) => {
    if (gameState.gamePhase === 'VERTICAL_AIMING') {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        const angle = Math.atan2(mouse.y, mouse.x);
        if (gameState.currentPlayer === 1) {
             vMeterPlayer1.updateValue(angle);
        } else {
             vMeterPlayer2.updateValue(angle);
        }

    } else if (gameState.gamePhase === 'HORIZONTAL_AIMING') {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        const angle = Math.atan2(mouse.y, mouse.x);
        const clampedAngle = Math.max(0, Math.min(angle, Math.PI));
        hMeter.updateValue(clampedAngle);
    }
});

createEnvironment(scene);
animate();