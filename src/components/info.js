import * as THREE from 'three';

export default class Info {
    constructor() {
        this.healthBars = new Map();
    }

    createHealthBar(ship) {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        container.style.padding = '3px 6px';
        container.style.borderRadius = '3px';
        container.style.zIndex = '1000';
        container.style.fontSize = '11px';
        container.style.color = 'white';
        container.style.display = 'flex';
        container.style.gap = '8px';
        container.style.alignItems = 'center';

        const healthStat = document.createElement('div');
        healthStat.textContent = `❤️: ${ship.health}`;

        const damageStat = document.createElement('div');
        damageStat.textContent = `⚔️: ${ship.damage}`;

        container.appendChild(healthStat);
        container.appendChild(damageStat);

        container.healthStat = healthStat;
        container.currentHealth = ship.health;

        document.body.appendChild(container);
        this.healthBars.set(ship.id, container);
        return container;
    }

    updatePosition(ship, camera) {
        const container = this.healthBars.get(ship.id);
        if (container) {
            const vector = ship.mesh.position.clone();
            vector.project(camera);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

            container.style.left = `${x}px`;
            container.style.top = `${y - 20}px`;
        }
    }

    updateHealthBar(ship, health) {
        const container = this.healthBars.get(ship.id);
        if (container) {
            container.healthStat.textContent = `❤️: ${health}`;
            container.currentHealth = health;
        }
    }

    showHealthBars() {
        this.healthBars.forEach(bar => {
            bar.style.display = 'flex';
        });
    }

    hideHealthBars() {
        this.healthBars.forEach(bar => {
            bar.style.display = 'none';
        });
    }

    removeHealthBar(shipId) {
        const container = this.healthBars.get(shipId);
        if (container) {
            document.body.removeChild(container);
            this.healthBars.delete(shipId);
        }
    }

    removeAllHealthBars() {
        this.healthBars.forEach((bar, shipId) => {
            this.removeHealthBar(shipId);
        });
    }
} 