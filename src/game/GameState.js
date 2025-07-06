import * as THREE from 'three';

export class GameState {
    constructor() {
        this.currentPlayer = 1;
        this.gamePhase = 'PLACEMENT';
        this.selectedShip = null;
        this.ships = {
            player1: [],
            player2: []
        };
        this.hits = {
            player1: new Set(),
            player2: new Set()
        };
        this.sunkShips = {
            player1: new Set(),
            player2: new Set()
        };
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        // back to selection
        this.gamePhase = 'SHIP_SELECTED';
    }

    addShip(player, ship) {
        this.ships[`player${player}`].push(ship);
    }

    recordHit(player, position) {
        this.hits[`player${player}`].add(position);
    }

    recordSunkShip(player, shipId) {
        this.sunkShips[`player${player}`].add(shipId);
    }

    checkWinCondition() {
        /* console.log('Checking win condition:', {
            player1Ships: this.ships.player1.length,
            player2Ships: this.ships.player2.length,
            player1Sunk: this.sunkShips.player1.length,
            player2Sunk: this.sunkShips.player2.length
        }); */
        const player1Ships = this.ships.player1.length;
        const player2Ships = this.ships.player2.length;
        const player1Sunk = this.sunkShips.player1.size;
        const player2Sunk = this.sunkShips.player2.size;

        console.log('Checking win condition:', {
            player1Ships,
            player2Ships,
            player1Sunk,
            player2Sunk,
            player1ShipsList: this.ships.player1,
            player2ShipsList: this.ships.player2,
            player1SunkShips: this.sunkShips.player1,
            player2SunkShips: this.sunkShips.player2
        });

        if (player1Sunk === player1Ships) return 2;
        if (player2Sunk === player2Ships) return 1;
        return null;
    }

    transitionAimingPhase() {
        if (this.gamePhase === 'VERTICAL_AIMING') {
            this.gamePhase = 'HORIZONTAL_AIMING';
        } else if (this.gamePhase === 'HORIZONTAL_AIMING') {
            this.gamePhase = 'FIRING';
        }
    }
} 