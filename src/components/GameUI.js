export class GameUI {
    constructor(gameState) {
        this.gameState = gameState;
        this.vMeterPlayer1 = null;
        this.vMeterPlayer2 = null;
        this.hMeter = null;
        this.createUI();
    }

    setMeters(vMeterPlayer1, vMeterPlayer2, hMeter) {
        this.vMeterPlayer1 = vMeterPlayer1;
        this.vMeterPlayer2 = vMeterPlayer2;
        this.hMeter = hMeter;
    }

    createUI() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '10px';
        this.container.style.left = '10px';
        this.container.style.color = 'white';
        this.container.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.container);
        this.statusDisplay = document.createElement('div');
        this.statusDisplay.style.marginBottom = '10px';
        this.container.appendChild(this.statusDisplay);


        this.controlsContainer = document.createElement('div');
        this.controlsContainer.style.display = 'none';
        this.container.appendChild(this.controlsContainer);
        
        this.createFireButton();

        this.gameOverOverlay = document.createElement('div');
        this.gameOverOverlay.style.position = 'fixed';
        this.gameOverOverlay.style.top = '0';
        this.gameOverOverlay.style.left = '0';
        this.gameOverOverlay.style.width = '100%';
        this.gameOverOverlay.style.height = '100%';
        this.gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        this.gameOverOverlay.style.color = 'white';
        this.gameOverOverlay.style.display = 'none';
        this.gameOverOverlay.style.flexDirection = 'column';
        this.gameOverOverlay.style.alignItems = 'center';
        this.gameOverOverlay.style.justifyContent = 'center';
        this.gameOverOverlay.style.zIndex = '1000';
        this.gameOverOverlay.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.gameOverOverlay);

        this.gameOverContent = document.createElement('div');
        this.gameOverContent.style.textAlign = 'center';
        this.gameOverOverlay.appendChild(this.gameOverContent);

        this.gameOverTitle = document.createElement('h1');
        this.gameOverTitle.style.fontSize = '5em';
        this.gameOverTitle.style.marginBottom = '20px';
        this.gameOverTitle.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        this.gameOverContent.appendChild(this.gameOverTitle);

        this.winnerAnnouncement = document.createElement('h2');
        this.winnerAnnouncement.style.fontSize = '3em';
        this.winnerAnnouncement.style.marginBottom = '40px';
        this.winnerAnnouncement.style.color = '#4CAF50';
        this.gameOverContent.appendChild(this.winnerAnnouncement);

        this.statsContainer = document.createElement('div');
        this.statsContainer.style.fontSize = '1.5em';
        this.statsContainer.style.marginBottom = '40px';
        this.gameOverContent.appendChild(this.statsContainer);

        this.restartButton = document.createElement('button');
        this.restartButton.textContent = 'Play Again';
        this.restartButton.style.padding = '20px 60px';
        this.restartButton.style.fontSize = '24px';
        this.restartButton.style.backgroundColor = '#4CAF50';
        this.restartButton.style.color = 'white';
        this.restartButton.style.border = 'none';
        this.restartButton.style.borderRadius = '5px';
        this.restartButton.style.cursor = 'pointer';
        this.restartButton.style.transition = 'all 0.3s ease';
        this.restartButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
        this.gameOverContent.appendChild(this.restartButton);

        this.restartButton.onmouseover = () => {
            this.restartButton.style.backgroundColor = '#45a049';
            this.restartButton.style.transform = 'scale(1.05)';
            this.restartButton.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.5)';
        };

        this.restartButton.onmouseout = () => {
            this.restartButton.style.backgroundColor = '#4CAF50';
            this.restartButton.style.transform = 'scale(1)';
            this.restartButton.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
        };

        this.restartButton.onclick = () => {
            location.reload();
        };
    }

    createFireButton() {
        const fireButton = document.createElement('button');
        fireButton.textContent = 'Fire!';
        fireButton.style.marginTop = '10px';
        fireButton.style.padding = '5px 10px';
        this.controlsContainer.appendChild(fireButton);
    }

    updateStatus() {
        const phase = this.gameState.gamePhase;
        const player = this.gameState.currentPlayer;
        
        let statusText = '';
        switch (phase) {
            case 'PLACEMENT':
                statusText = `Place Your Ships`;
                this.controlsContainer.style.display = 'none';
                this.gameOverOverlay.style.display = 'none';
                break;
            case 'SHIP_SELECTED':
                statusText = `Player ${player}, select a ship to fire from`;
                this.controlsContainer.style.display = 'none';
                this.gameOverOverlay.style.display = 'none';
                break;
            case 'VERTICAL_AIMING':
                statusText = `Player ${player}'s turn to aim vertically`;
                this.controlsContainer.style.display = 'block';
                this.gameOverOverlay.style.display = 'none';
                break;
            case 'HORIZONTAL_AIMING':
                statusText = `Player ${player}'s turn to aim horizontally`;
                this.controlsContainer.style.display = 'block';
                this.gameOverOverlay.style.display = 'none';
                break;
            case 'FIRING':
                statusText = 'Firing!';
                this.controlsContainer.style.display = 'none';
                this.gameOverOverlay.style.display = 'none';
                break;
            case 'GAME_OVER':
                const winner = this.gameState.checkWinCondition();
                statusText = `Game Over! Player ${winner} wins!`;
                this.controlsContainer.style.display = 'none';
                
                this.gameOverTitle.textContent = 'Game Over!';
                this.winnerAnnouncement.textContent = `Player ${winner} Wins!`;
                
                const player1Ships = this.gameState.ships.player1.length;
                const player2Ships = this.gameState.ships.player2.length;
                const player1Sunk = this.gameState.sunkShips.player1.size;
                const player2Sunk = this.gameState.sunkShips.player2.size;
                
                this.statsContainer.innerHTML = `
                    <div>Player 1: ${player1Sunk}/${player1Ships} ships sunk</div>
                    <div>Player 2: ${player2Sunk}/${player2Ships} ships sunk</div>
                `;
                
                this.gameOverOverlay.style.display = 'flex';
                break;
        }
        
        this.statusDisplay.textContent = statusText;
    }

    getAngles() {
        // get angles from meters
        const verticalAngle = this.gameState.currentPlayer === 1 
            ? (this.vMeterPlayer1 ? this.vMeterPlayer1.getAngle() : 0)
            : (this.vMeterPlayer2 ? this.vMeterPlayer2.getAngle() : 0);
            
        const horizontalAngle = this.hMeter ? this.hMeter.getAngle() : 0;

        /* console.log('meter values:', {
            vMeterPlayer1: this.vMeterPlayer1 ? this.vMeterPlayer1.getAngle() : 'null',
            vMeterPlayer2: this.vMeterPlayer2 ? this.vMeterPlayer2.getAngle() : 'null',
            hMeter: this.hMeter ? this.hMeter.getAngle() : 'null',
            currentPlayer: this.gameState.currentPlayer,
            selectedAngles: { vertical: verticalAngle, horizontal: horizontalAngle }
        }); */

        return {
            vertical: verticalAngle,
            horizontal: horizontalAngle
        };
    }

    showControls(show) {
        this.controlsContainer.style.display = show ? 'block' : 'none';
    }
} 