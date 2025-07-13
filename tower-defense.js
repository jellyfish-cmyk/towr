class TowerDefense {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.money = 100; // Starting money
        this.lives = 20;
        this.wave = 1;
        this.score = 0;
        this.gameRunning = false;
        this.paused = false;
        this.selectedTower = null;
        this.placementMode = false;
        this.towerHealth = 100; // Health for each tower
        
        // Game objects
        this.towers = [];
        this.towerInventory = []; // Store towers not on current path
        this.enemies = [];
        this.projectiles = [];
        this.effects = [];
        
        // Different path layouts for variety
        this.pathLayouts = {
            layout1: [ // Classic tower defense path
                {x: 0, y: 100},
                {x: 200, y: 100},
                {x: 200, y: 200},
                {x: 400, y: 200},
                {x: 400, y: 100},
                {x: 600, y: 100},
                {x: 600, y: 300},
                {x: 800, y: 300},
                {x: 800, y: 400}
            ],
            layout2: [ // Spiral path
                {x: 0, y: 200},
                {x: 150, y: 200},
                {x: 150, y: 50},
                {x: 350, y: 50},
                {x: 350, y: 150},
                {x: 250, y: 150},
                {x: 250, y: 250},
                {x: 450, y: 250},
                {x: 450, y: 350},
                {x: 650, y: 350},
                {x: 650, y: 250},
                {x: 550, y: 250},
                {x: 550, y: 150},
                {x: 750, y: 150},
                {x: 750, y: 50},
                {x: 800, y: 50},
                {x: 800, y: 100},
                {x: 800, y: 150},
                {x: 800, y: 200},
                {x: 800, y: 250},
                {x: 800, y: 300},
                {x: 800, y: 350},
                {x: 800, y: 400}
            ],
            layout3: [ // Zigzag path
                {x: 0, y: 100},
                {x: 100, y: 100},
                {x: 100, y: 50},
                {x: 200, y: 50},
                {x: 200, y: 150},
                {x: 300, y: 150},
                {x: 300, y: 100},
                {x: 400, y: 100},
                {x: 400, y: 200},
                {x: 500, y: 200},
                {x: 500, y: 150},
                {x: 600, y: 150},
                {x: 600, y: 250},
                {x: 700, y: 250},
                {x: 700, y: 200},
                {x: 800, y: 200},
                {x: 800, y: 250},
                {x: 800, y: 300},
                {x: 800, y: 350},
                {x: 800, y: 400}
            ],
            layout4: [ // Figure-8 path
                {x: 0, y: 200},
                {x: 150, y: 200},
                {x: 150, y: 100},
                {x: 250, y: 100},
                {x: 250, y: 150},
                {x: 200, y: 150},
                {x: 200, y: 200},
                {x: 150, y: 200},
                {x: 150, y: 300},
                {x: 250, y: 300},
                {x: 250, y: 250},
                {x: 200, y: 250},
                {x: 200, y: 200},
                {x: 350, y: 200},
                {x: 350, y: 100},
                {x: 450, y: 100},
                {x: 450, y: 150},
                {x: 400, y: 150},
                {x: 400, y: 200},
                {x: 350, y: 200},
                {x: 350, y: 300},
                {x: 450, y: 300},
                {x: 450, y: 250},
                {x: 400, y: 250},
                {x: 400, y: 200},
                {x: 550, y: 200},
                {x: 550, y: 100},
                {x: 650, y: 100},
                {x: 650, y: 150},
                {x: 600, y: 150},
                {x: 600, y: 200},
                {x: 550, y: 200},
                {x: 550, y: 300},
                {x: 650, y: 300},
                {x: 650, y: 250},
                {x: 600, y: 250},
                {x: 600, y: 200},
                {x: 750, y: 200},
                {x: 750, y: 100},
                {x: 800, y: 100},
                {x: 800, y: 150},
                {x: 800, y: 200},
                {x: 800, y: 250},
                {x: 800, y: 300},
                {x: 800, y: 350},
                {x: 800, y: 400}
            ],
            layout5: [ // Cross path
                {x: 0, y: 200},
                {x: 200, y: 200},
                {x: 200, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 400, y: 200},
                {x: 400, y: 300},
                {x: 500, y: 300},
                {x: 500, y: 200},
                {x: 600, y: 200},
                {x: 600, y: 100},
                {x: 700, y: 100},
                {x: 700, y: 200},
                {x: 800, y: 200},
                {x: 800, y: 250},
                {x: 800, y: 300},
                {x: 800, y: 350},
                {x: 800, y: 400}
            ]
        };
        
        // Current path (starts with layout1)
        this.path = [...this.pathLayouts.layout1];
        
        // All tower types (including unlocked ones)
        this.allTowerTypes = {
            basic: {
                name: 'Basic Tower',
                cost: 50,
                damage: 25,
                range: 80,
                fireRate: 1000,
                color: '#ff6b6b',
                symbol: '●',
                kills: 0,
                unlocked: true
            },
            sniper: {
                name: 'Sniper Tower',
                cost: 100,
                damage: 75,
                range: 150,
                fireRate: 1800,
                color: '#4ecdc4',
                symbol: '◉',
                kills: 0,
                unlocked: true
            },
            splash: {
                name: 'Splash Tower',
                cost: 150,
                damage: 30,
                range: 100,
                fireRate: 1200,
                color: '#feca57',
                symbol: '◈',
                splashRadius: 70,
                kills: 0,
                unlocked: true
            },
            freeze: {
                name: 'Freeze Tower',
                cost: 200,
                damage: 20,
                range: 90,
                fireRate: 1000,
                color: '#00d4ff',
                symbol: '❄',
                slowEffect: 0.4,
                kills: 0,
                unlocked: true
            },
            laser: {
                name: 'Laser Tower',
                cost: 300,
                damage: 50,
                range: 120,
                fireRate: 800,
                color: '#ff00ff',
                symbol: '⚡',
                kills: 0,
                unlocked: false
            },
            cannon: {
                name: 'Cannon Tower',
                cost: 400,
                damage: 100,
                range: 110,
                fireRate: 2000,
                color: '#8B4513',
                symbol: '💣',
                splashRadius: 90,
                kills: 0,
                unlocked: false
            },
            tesla: {
                name: 'Tesla Tower',
                cost: 500,
                damage: 40,
                range: 130,
                fireRate: 600,
                color: '#00ffff',
                symbol: '⚡',
                chainLightning: true,
                kills: 0,
                unlocked: false
            },
            plasma: {
                name: 'Plasma Tower',
                cost: 600,
                damage: 80,
                range: 140,
                fireRate: 1500,
                color: '#ff1493',
                symbol: '☢',
                burnEffect: true,
                kills: 0,
                unlocked: false
            }
        };
        
        // Currently available tower types (filtered by unlocked status)
        this.towerTypes = {};
        this.updateAvailableTowers();
        
        // Enemy types
        this.enemyTypes = {
            basic: { health: 60, speed: 1, reward: 10, color: '#ff6b6b', damage: 5 },
            fast: { health: 40, speed: 2.2, reward: 18, color: '#4ecdc4', damage: 8 },
            tank: { health: 128, speed: 0.6, reward: 30, color: '#feca57', damage: 13 }, // 15% weaker
            boss: { health: 255, speed: 0.9, reward: 55, color: '#ff4757', damage: 21 } // 15% weaker
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    updateAvailableTowers() {
        this.towerTypes = {};
        for (let type in this.allTowerTypes) {
            if (this.allTowerTypes[type].unlocked) {
                this.towerTypes[type] = this.allTowerTypes[type];
            }
        }
        this.updateTowerUI();
    }
    
    unlockTower(towerType) {
        if (this.allTowerTypes[towerType]) {
            this.allTowerTypes[towerType].unlocked = true;
            this.updateAvailableTowers();
            this.showMessage(`New tower unlocked: ${this.allTowerTypes[towerType].name}!`, 'success');
        }
    }
    
    checkTowerUnlocks() {
        // Unlock new towers every 5 levels after level 5
        if (this.wave >= 5 && this.wave % 5 === 0) {
            const unlockLevel = Math.floor(this.wave / 5) - 1; // 0-based index
            const towerTypes = ['laser', 'cannon', 'tesla', 'plasma'];
            
            if (unlockLevel < towerTypes.length) {
                const towerType = towerTypes[unlockLevel];
                if (!this.allTowerTypes[towerType].unlocked) {
                    this.unlockTower(towerType);
                }
            }
        }
    }
    
    changeLayout() {
        // Change layout every 3 waves
        if (this.wave % 3 === 0) {
            const layoutKeys = Object.keys(this.pathLayouts);
            const layoutIndex = Math.floor((this.wave / 3) - 1) % layoutKeys.length;
            const newLayout = layoutKeys[layoutIndex];
            
            // Put ALL current towers in inventory
            this.towerInventory = [...this.towers];
            
            this.path = [...this.pathLayouts[newLayout]];
            
            // Clear enemies and effects
            this.enemies = [];
            this.projectiles = [];
            this.effects = [];
            
            // Clear all towers from the map - they're all in inventory now
            this.towers = [];
            
            this.showMessage(`New layout: ${newLayout}! All ${this.towerInventory.length} towers moved to inventory!`, 'success');
        }
    }
    
    updateTowerUI() {
        const towerOptions = document.querySelector('.tower-options');
        const inventoryTowers = document.getElementById('inventory-towers');
        
        // Clear tower options
        towerOptions.innerHTML = '';
        
        // Update inventory section
        if (this.towerInventory.length > 0) {
            inventoryTowers.innerHTML = this.towerInventory.map((tower, index) => `
                <div class="inventory-tower" data-index="${index}">
                    <div class="tower-icon ${tower.type}-tower"></div>
                    <div class="tower-info">
                        <div class="tower-name">${this.allTowerTypes[tower.type].name}</div>
                        <div class="tower-cost">Click to place on path</div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners for inventory towers
            document.querySelectorAll('.inventory-tower').forEach(option => {
                option.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    this.selectInventoryTower(index);
                });
            });
        } else {
            inventoryTowers.innerHTML = '<div class="inventory-empty">No towers in inventory</div>';
        }
        
        // Add available tower types
        for (let type in this.towerTypes) {
            const towerType = this.towerTypes[type];
            const towerDiv = document.createElement('div');
            towerDiv.className = 'tower-option';
            towerDiv.dataset.tower = type;
            
            towerDiv.innerHTML = `
                <div class="tower-icon ${type}-tower"></div>
                <div class="tower-info">
                    <div class="tower-name">${towerType.name}</div>
                    <div class="tower-cost">$${towerType.cost}</div>
                </div>
            `;
            
            towerOptions.appendChild(towerDiv);
        }
        
        // Re-add event listeners
        document.querySelectorAll('.tower-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTower(e.currentTarget.dataset.tower);
            });
        });
    }
    
    selectInventoryTower(index) {
        if (index >= 0 && index < this.towerInventory.length) {
            this.selectedInventoryTower = index;
            this.placementMode = true;
            
            // Update UI
            document.querySelectorAll('.inventory-tower').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`.inventory-tower[data-index="${index}"]`).classList.add('selected');
            
            this.canvas.style.cursor = 'crosshair';
            this.showMessage('Click on the path to place your tower from inventory!', 'info');
        }
    }
    
    initializeGame() {
        this.updateUI();
        this.drawMap();
    }
    
    setupEventListeners() {
        // Tower selection
        document.querySelectorAll('.tower-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTower(e.currentTarget.dataset.tower);
            });
        });
        
        // Canvas click for tower placement
        this.canvas.addEventListener('click', (e) => {
            if (this.placementMode) {
                this.placeTower(e);
            }
        });
        
        // Canvas hover for placement preview
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.placementMode) {
                this.showPlacementPreview(e);
            }
        });
        
        // Game controls
        document.getElementById('startWave').addEventListener('click', () => {
            this.startWave();
        });
        
        document.getElementById('pauseGame').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Escape key to cancel placement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cancelPlacement();
            }
        });
    }
    
    selectTower(towerType) {
        if (this.money >= this.towerTypes[towerType].cost) {
            this.selectedTower = towerType;
            this.placementMode = true;
            
            // Update UI
            document.querySelectorAll('.tower-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-tower="${towerType}"]`).classList.add('selected');
            
            this.canvas.style.cursor = 'crosshair';
        } else {
            this.showMessage('Not enough money!', 'error');
        }
    }
    
    placeTower(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Check if placing from inventory
        if (this.selectedInventoryTower !== undefined) {
            if (this.isValidPlacement(x, y)) {
                const inventoryTower = this.towerInventory[this.selectedInventoryTower];
                inventoryTower.x = x;
                inventoryTower.y = y;
                
                this.towers.push(inventoryTower);
                this.towerInventory.splice(this.selectedInventoryTower, 1);
                this.updateUI();
                
                this.cancelPlacement();
                this.showMessage('Tower placed from inventory!', 'success');
            } else {
                if (!this.isOnPath(x, y)) {
                    this.showMessage('Place tower on the path!', 'error');
                } else {
                    this.showMessage('Too close to another tower!', 'error');
                }
            }
        } else {
            // Check if position is valid (on path and not too close to other towers)
            if (this.isValidPlacement(x, y)) {
                const tower = {
                    x: x,
                    y: y,
                    type: this.selectedTower,
                    lastShot: 0,
                    target: null,
                    kills: 0,
                    totalDamage: 0,
                    health: this.towerHealth,
                    maxHealth: this.towerHealth,
                    lastDamaged: 0
                };
                
                this.towers.push(tower);
                this.money -= this.towerTypes[this.selectedTower].cost;
                this.updateUI();
                
                this.cancelPlacement();
                this.showMessage('Tower placed successfully!', 'success');
            } else {
                // Only show error if not on path, not if too close to other towers
                if (!this.isOnPath(x, y)) {
                    this.showMessage('Place tower on the path!', 'error');
                } else {
                    this.showMessage('Too close to another tower!', 'error');
                }
            }
        }
    }
    
    isValidPlacement(x, y) {
        // Only allow placement on the actual enemy walking path (within 20 pixels)
        let onPath = false;
        for (let i = 0; i < this.path.length - 1; i++) {
            const dist = this.distanceToLine(x, y, this.path[i], this.path[i + 1]);
            if (dist <= 20) { // Tighter restriction - only on the actual enemy path
                onPath = true;
                break;
            }
        }
        
        // Must be on path to place tower
        if (!onPath) return false;
        
        // Check if too close to other towers
        for (let tower of this.towers) {
            const dist = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            if (dist < 40) return false;
        }
        
        return true;
    }
    
    isOnPath(x, y) {
        // Only consider on path if it's on the actual enemy walking path
        for (let i = 0; i < this.path.length - 1; i++) {
            const dist = this.distanceToLine(x, y, this.path[i], this.path[i + 1]);
            if (dist <= 20) { // Tighter restriction - only on the actual enemy path
                return true;
            }
        }
        return false;
    }
    
    distanceToLine(px, py, lineStart, lineEnd) {
        // Simplified distance calculation that's more reliable
        const A = px - lineStart.x;
        const B = py - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        // Handle zero-length lines
        if (lenSq === 0) {
            return Math.sqrt(A * A + B * B);
        }
        
        let param = dot / lenSq;
        
        // Clamp parameter to line segment
        param = Math.max(0, Math.min(1, param));
        
        // Calculate closest point on line
        const xx = lineStart.x + param * C;
        const yy = lineStart.y + param * D;
        
        // Return distance to closest point
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    showPlacementPreview(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        this.drawMap();
        
        // Check if placement is valid
        const isValid = this.isValidPlacement(x, y);
        const onPath = this.isOnPath(x, y);
        
        // Draw placement preview
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        
        // Color based on validity
        if (isValid) {
            this.ctx.fillStyle = '#00ff00'; // Green for valid
        } else if (onPath) {
            this.ctx.fillStyle = '#ffaa00'; // Orange for on path but too close to tower
        } else {
            this.ctx.fillStyle = '#ff0000'; // Red for not on path
        }
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw path indicator with better visibility
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
        
        // Draw path width indicator
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        this.ctx.restore();
    }
    
    cancelPlacement() {
        this.selectedTower = null;
        this.selectedInventoryTower = undefined;
        this.placementMode = false;
        document.querySelectorAll('.tower-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelectorAll('.inventory-tower').forEach(option => {
            option.classList.remove('selected');
        });
        this.canvas.style.cursor = 'default';
        this.drawMap();
    }
    
    startWave() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.spawnEnemies();
        }
    }
    
    spawnEnemies() {
        // Progressive difficulty: more enemies and stronger enemies per wave
        const baseEnemyCount = 5;
        const enemyCount = baseEnemyCount + this.wave * 2 + Math.floor(this.wave / 3) * 3;
        const enemyTypes = Object.keys(this.enemyTypes);
        
        // Calculate spacing between enemies - increases with wave number to reduce overlap
        const baseSpacing = 800; // Base spacing in milliseconds
        const spacingIncrease = this.wave * 100; // More spacing each wave
        const maxSpacing = 2000; // Maximum spacing cap
        const enemySpacing = Math.min(baseSpacing + spacingIncrease, maxSpacing);
        
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                // Progressive enemy types: introduce stronger enemies as waves progress
                let typeIndex = Math.min(Math.floor(this.wave / 3), enemyTypes.length - 1);
                
                // Add some randomness to enemy types
                if (Math.random() < 0.3 && this.wave > 5) {
                    typeIndex = Math.min(typeIndex + 1, enemyTypes.length - 1);
                }
                
                const type = enemyTypes[typeIndex];
                const enemyType = this.enemyTypes[type];
                
                // Progressive enemy scaling: enemies get stronger each wave
                const healthMultiplier = 1 + (this.wave - 1) * 0.1;
                const speedMultiplier = 1 + (this.wave - 1) * 0.05;
                
                this.enemies.push({
                    x: this.path[0].x,
                    y: this.path[0].y,
                    pathIndex: 0,
                    health: Math.floor(enemyType.health * healthMultiplier),
                    maxHealth: Math.floor(enemyType.health * healthMultiplier),
                    speed: enemyType.speed * speedMultiplier,
                    reward: enemyType.reward + Math.floor(this.wave / 2),
                    type: type,
                    slowEffect: 1
                });
            }, i * enemySpacing); // Use calculated spacing instead of decreasing intervals
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pauseGame').textContent = this.paused ? 'Resume' : 'Pause';
    }
    
    restartGame() {
        this.money = 100; // Starting money
        this.lives = 20;
        this.wave = 1;
        this.score = 0;
        this.gameRunning = false;
        this.paused = false;
        this.towerHealth = 100;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.effects = [];
        this.cancelPlacement();
        this.updateUI();
        this.drawMap();
    }
    
    update() {
        if (this.paused) return;
        
        this.updateEnemies();
        this.updateTowers();
        this.updateProjectiles();
        this.updateEffects();
        
        // Check if wave is complete
        if (this.gameRunning && this.enemies.length === 0) {
            this.waveComplete();
        }
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move along path
            const targetPoint = this.path[enemy.pathIndex];
            const dx = targetPoint.x - enemy.x;
            const dy = targetPoint.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                enemy.pathIndex++;
                if (enemy.pathIndex >= this.path.length) {
                    // Enemy reached the end
                    this.lives--;
                    this.enemies.splice(i, 1);
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                    continue;
                }
            } else {
                const speed = enemy.speed * enemy.slowEffect;
                enemy.x += (dx / distance) * speed;
                enemy.y += (dy / distance) * speed;
            }
            
            // Check if enemy is near any tower and attack it
            this.checkEnemyTowerCollision(enemy);
            
            // Process burn effects
            if (enemy.burnEffect) {
                const now = Date.now();
                if (now - enemy.burnEffect.startTime < enemy.burnEffect.duration) {
                    // Apply burn damage every 500ms
                    if (now % 500 < 16) { // 16ms is roughly one frame at 60fps
                        this.damageEnemy(enemy, enemy.burnEffect.damage);
                    }
                } else {
                    // Remove burn effect when duration expires
                    delete enemy.burnEffect;
                }
            }
        }
    }
    
    updateTowers() {
        const now = Date.now();
        
        for (let tower of this.towers) {
            // Only find targets and attack if there are enemies
            if (this.enemies.length > 0) {
                // Find target
                if (!tower.target || !this.isEnemyInRange(tower, tower.target)) {
                    tower.target = this.findTarget(tower);
                }
                
                // Attack only if we have a valid target
                if (tower.target && now - tower.lastShot > this.towerTypes[tower.type].fireRate) {
                    this.towerAttack(tower);
                    tower.lastShot = now;
                }
            } else {
                // Clear target when no enemies are present
                tower.target = null;
            }
        }
    }
    
    findTarget(tower) {
        let closest = null;
        let closestDistance = Infinity;
        
        // Only search for targets if there are enemies
        if (this.enemies.length === 0) {
            return null;
        }
        
        for (let enemy of this.enemies) {
            const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
            if (distance <= this.towerTypes[tower.type].range && distance < closestDistance) {
                closest = enemy;
                closestDistance = distance;
            }
        }
        
        return closest;
    }
    
    isEnemyInRange(tower, enemy) {
        // Check if enemy still exists in the enemies array
        if (!this.enemies.includes(enemy)) {
            return false;
        }
        
        const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
        return distance <= this.towerTypes[tower.type].range;
    }
    
    towerAttack(tower) {
        const towerType = this.towerTypes[tower.type];
        
        if (tower.type === 'splash') {
            // Splash damage to all enemies in range
            let splashKills = 0;
            for (let enemy of this.enemies) {
                const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
                if (distance <= towerType.splashRadius) {
                    const wasAlive = enemy.health > 0;
                    this.damageEnemy(enemy, towerType.damage, tower);
                    if (wasAlive && enemy.health <= 0) {
                        splashKills++;
                    }
                }
            }
            tower.kills += splashKills;
            tower.totalDamage += towerType.damage * this.enemies.filter(e => 
                Math.sqrt((tower.x - e.x) ** 2 + (tower.y - e.y) ** 2) <= towerType.splashRadius
            ).length;
        } else if (tower.type === 'freeze') {
            // Freeze effect
            const wasAlive = tower.target.health > 0;
            this.damageEnemy(tower.target, towerType.damage, tower);
            if (wasAlive && tower.target.health <= 0) {
                tower.kills++;
            }
            tower.totalDamage += towerType.damage;
            tower.target.slowEffect = towerType.slowEffect;
            setTimeout(() => {
                if (tower.target) tower.target.slowEffect = 1;
            }, 3000);
        } else if (tower.type === 'laser') {
            // Laser tower - high damage, fast fire rate
            const wasAlive = tower.target.health > 0;
            this.damageEnemy(tower.target, towerType.damage, tower);
            if (wasAlive && tower.target.health <= 0) {
                tower.kills++;
            }
            tower.totalDamage += towerType.damage;
        } else if (tower.type === 'cannon') {
            // Cannon tower - high damage splash
            let splashKills = 0;
            for (let enemy of this.enemies) {
                const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
                if (distance <= towerType.splashRadius) {
                    const wasAlive = enemy.health > 0;
                    this.damageEnemy(enemy, towerType.damage, tower);
                    if (wasAlive && enemy.health <= 0) {
                        splashKills++;
                    }
                }
            }
            tower.kills += splashKills;
            tower.totalDamage += towerType.damage * this.enemies.filter(e => 
                Math.sqrt((tower.x - e.x) ** 2 + (tower.y - e.y) ** 2) <= towerType.splashRadius
            ).length;
        } else if (tower.type === 'tesla') {
            // Tesla tower - chain lightning
            let chainKills = 0;
            let targets = [tower.target];
            let hitEnemies = new Set();
            
            for (let i = 0; i < 3 && targets.length > 0; i++) {
                const currentTarget = targets.shift();
                if (currentTarget && !hitEnemies.has(currentTarget)) {
                    hitEnemies.add(currentTarget);
                    const wasAlive = currentTarget.health > 0;
                    this.damageEnemy(currentTarget, towerType.damage, tower);
                    if (wasAlive && currentTarget.health <= 0) {
                        chainKills++;
                    }
                    
                    // Find next target for chain
                    for (let enemy of this.enemies) {
                        if (!hitEnemies.has(enemy)) {
                            const distance = Math.sqrt((currentTarget.x - enemy.x) ** 2 + (currentTarget.y - enemy.y) ** 2);
                            if (distance <= 60) {
                                targets.push(enemy);
                                break;
                            }
                        }
                    }
                }
            }
            tower.kills += chainKills;
            tower.totalDamage += towerType.damage * hitEnemies.size;
        } else if (tower.type === 'plasma') {
            // Plasma tower - damage over time
            const wasAlive = tower.target.health > 0;
            this.damageEnemy(tower.target, towerType.damage, tower);
            if (wasAlive && tower.target.health <= 0) {
                tower.kills++;
            }
            tower.totalDamage += towerType.damage;
            
            // Add burn effect
            if (!tower.target.burnEffect) {
                tower.target.burnEffect = {
                    damage: towerType.damage * 0.3,
                    duration: 3000,
                    startTime: Date.now()
                };
            }
        } else {
            // Regular attack
            const wasAlive = tower.target.health > 0;
            this.damageEnemy(tower.target, towerType.damage, tower);
            if (wasAlive && tower.target.health <= 0) {
                tower.kills++;
            }
            tower.totalDamage += towerType.damage;
        }
        
        // Create projectile effect with aiming (only if target exists)
        if (tower.target) {
            this.projectiles.push({
                x: tower.x,
                y: tower.y,
                targetX: tower.target.x,
                targetY: tower.target.y,
                type: tower.type,
                life: 20,
                startX: tower.x,
                startY: tower.y
            });
        }
    }
    
    damageEnemy(enemy, damage, tower = null) {
        enemy.health -= damage;
        
        if (enemy.health <= 0) {
            this.money += enemy.reward;
            this.score += enemy.reward;
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
            this.updateUI();
            
            // Create death effect
            this.effects.push({
                x: enemy.x,
                y: enemy.y,
                type: 'death',
                life: 30,
                towerType: tower ? tower.type : null
            });
        }
    }
    
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.life--;
            
            if (projectile.life <= 0) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    updateEffects() {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.life--;
            
            if (effect.life <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    checkEnemyTowerCollision(enemy) {
        const now = Date.now();
        const attackCooldown = 1000; // 1 second between attacks
        
        for (let i = this.towers.length - 1; i >= 0; i--) {
            const tower = this.towers[i];
            const distance = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2);
            
            // If enemy is close to tower and enough time has passed since last attack
            if (distance < 30 && now - tower.lastDamaged > attackCooldown) {
                this.damageTower(tower, enemy);
                tower.lastDamaged = now;
                
                // Create attack effect
                this.effects.push({
                    x: tower.x,
                    y: tower.y,
                    type: 'tower_damage',
                    life: 20,
                    enemyType: enemy.type
                });
            }
        }
    }
    
    damageTower(tower, enemy) {
        const enemyType = this.enemyTypes[enemy.type];
        tower.health -= enemyType.damage;
        
        // Create damage text effect
        this.effects.push({
            x: tower.x,
            y: tower.y - 20,
            type: 'damage_text',
            life: 60,
            text: `-${enemyType.damage}`,
            color: '#ff4757'
        });
        
        if (tower.health <= 0) {
            // Tower destroyed
            this.towers.splice(this.towers.indexOf(tower), 1);
            
            // Create destruction effect
            this.effects.push({
                x: tower.x,
                y: tower.y,
                type: 'tower_destruction',
                life: 40,
                towerType: tower.type
            });
            
            this.showMessage(`Tower destroyed by ${enemy.type} enemy!`, 'error');
        }
    }
    
    waveComplete() {
        this.gameRunning = false;
        this.wave++;
        
        // Progressive difficulty: more money and enemies per wave
        const waveBonus = 35 + (this.wave - 1) * 10; // Reduced bonus
        this.money += waveBonus;
        
        // Check for tower unlocks
        this.checkTowerUnlocks();
        
        // Change layout every 3 waves
        this.changeLayout();
        
        this.updateUI();
        this.showMessage(`Wave ${this.wave - 1} complete! +$${waveBonus}`, 'success');
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showMessage('Game Over!', 'error');
        setTimeout(() => {
            if (confirm('Game Over! Your score: ' + this.score + '\nPlay again?')) {
                this.restartGame();
            }
        }, 1000);
    }
    
    drawMap() {
        // Clear canvas with medieval grass background
        const grassGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        grassGradient.addColorStop(0, '#2d5016');
        grassGradient.addColorStop(0.3, '#4a7c59');
        grassGradient.addColorStop(0.7, '#6b8e23');
        grassGradient.addColorStop(1, '#556b2f');
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grass texture pattern
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.strokeStyle = '#1a3d0a';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x + 10, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y + 10);
            this.ctx.stroke();
        }
        this.ctx.restore();
        
        // Draw medieval dirt path with brown colors
        const pathGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        pathGradient.addColorStop(0, '#8B4513');
        pathGradient.addColorStop(0.3, '#A0522D');
        pathGradient.addColorStop(0.7, '#CD853F');
        pathGradient.addColorStop(1, '#8B4513');
        
        this.ctx.strokeStyle = pathGradient;
        this.ctx.lineWidth = 40;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
        
        // Draw path border with medieval stone effect
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw path texture (dirt/stone pattern)
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
            const steps = Math.floor(length / 15);
            
            for (let j = 0; j < steps; j++) {
                const t = j / steps;
                const x = start.x + (end.x - start.x) * t;
                const y = start.y + (end.y - start.y) * t;
                
                if (Math.random() > 0.7) {
                    this.ctx.beginPath();
                    this.ctx.arc(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        this.ctx.restore();
        
        // Draw path center line for tower placement guidance
        if (this.placementMode) {
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([8, 8]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                this.ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Draw towers
        for (let tower of this.towers) {
            this.drawTower(tower);
        }
        
        // Draw enemies
        for (let enemy of this.enemies) {
            this.drawEnemy(enemy);
        }
        
        // Draw projectiles
        for (let projectile of this.projectiles) {
            this.drawProjectile(projectile);
        }
        
        // Draw effects
        for (let effect of this.effects) {
            this.drawEffect(effect);
        }
    }
    
    drawTower(tower) {
        const towerType = this.towerTypes[tower.type];
        
        // Draw range indicator if tower has target
        if (tower.target) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillStyle = towerType.color;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, towerType.range, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Draw aiming line
            this.ctx.save();
            this.ctx.strokeStyle = towerType.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(tower.x, tower.y);
            this.ctx.lineTo(tower.target.x, tower.target.y);
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        // Draw tower with health-based color
        const healthPercent = tower.health / tower.maxHealth;
        let stoneColor = '#696969'; // Default stone color
        
        // Change color based on health
        if (healthPercent < 0.3) {
            stoneColor = '#8B0000'; // Dark red when low health
        } else if (healthPercent < 0.6) {
            stoneColor = '#B8860B'; // Dark goldenrod when medium health
        }
        
        // Draw tower shadow
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(tower.x + 3, tower.y + 3, 28, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw medieval stone tower base (larger circle with stone texture)
        const baseGradient = this.ctx.createRadialGradient(tower.x - 10, tower.y - 10, 0, tower.x, tower.y, 25);
        baseGradient.addColorStop(0, '#A9A9A9');
        baseGradient.addColorStop(0.5, stoneColor);
        baseGradient.addColorStop(1, '#2F4F4F');
        
        this.ctx.fillStyle = baseGradient;
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw stone blocks pattern on base
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = '#2F4F4F';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x1 = tower.x + Math.cos(angle) * 15;
            const y1 = tower.y + Math.sin(angle) * 15;
            const x2 = tower.x + Math.cos(angle) * 25;
            const y2 = tower.y + Math.sin(angle) * 25;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        this.ctx.restore();
        
        // Draw tower base border (stone edge)
        this.ctx.strokeStyle = '#2F4F4F';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw medieval tower top (smaller circle with battlements)
        const topGradient = this.ctx.createRadialGradient(tower.x - 5, tower.y - 13, 0, tower.x, tower.y - 8, 15);
        topGradient.addColorStop(0, '#C0C0C0');
        topGradient.addColorStop(0.5, stoneColor);
        topGradient.addColorStop(1, '#2F4F4F');
        
        this.ctx.fillStyle = topGradient;
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y - 8, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw battlements (medieval tower crenellations)
        this.ctx.save();
        this.ctx.fillStyle = '#2F4F4F';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = tower.x + Math.cos(angle) * 15;
            const y = tower.y - 8 + Math.sin(angle) * 15;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
        
        // Draw tower top border
        this.ctx.strokeStyle = '#2F4F4F';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw tower symbol (medieval style)
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(towerType.symbol, tower.x, tower.y - 8);
        
        // Draw health bar (medieval style)
        const barWidth = 50;
        const barHeight = 6;
        
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(tower.x - barWidth/2, tower.y - 45, barWidth, barHeight);
        this.ctx.fillStyle = healthPercent > 0.6 ? '#32CD32' : healthPercent > 0.3 ? '#FF8C00' : '#DC143C';
        this.ctx.fillRect(tower.x - barWidth/2, tower.y - 45, barWidth * healthPercent, barHeight);
        
        // Draw health bar border
        this.ctx.strokeStyle = '#2F4F4F';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(tower.x - barWidth/2, tower.y - 45, barWidth, barHeight);
        
        // Draw kill count for expensive towers (medieval banner style)
        if (tower.kills > 0) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText(tower.kills.toString(), tower.x, tower.y + 45);
            
            // Draw banner background
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = '#8B0000';
            this.ctx.fillRect(tower.x - 15, tower.y + 35, 30, 15);
            this.ctx.restore();
        }
    }
    
    drawEnemy(enemy) {
        const enemyType = this.enemyTypes[enemy.type];
        
        // Draw enemy shadow
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + 2, enemy.y + 2, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw enemy body
        this.ctx.fillStyle = enemyType.color;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, 18, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw enemy border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw enemy details based on type
        if (enemy.type === 'basic') {
            // Basic enemy - simple design
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x - 5, enemy.y - 5, 3, 0, Math.PI * 2);
            this.ctx.arc(enemy.x + 5, enemy.y - 5, 3, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (enemy.type === 'fast') {
            // Fast enemy - streamlined design
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = enemyType.color;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (enemy.type === 'tank') {
            // Tank enemy - armored design
            this.ctx.fillStyle = '#333';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 22, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = enemyType.color;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 18, 0, Math.PI * 2);
            this.ctx.fill();
            // Draw armor plates
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
            this.ctx.stroke();
        } else if (enemy.type === 'boss') {
            // Boss enemy - intimidating design
            this.ctx.fillStyle = '#333';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 25, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = enemyType.color;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            // Draw boss details
            this.ctx.fillStyle = '#ff0000';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x - 8, enemy.y - 8, 4, 0, Math.PI * 2);
            this.ctx.arc(enemy.x + 8, enemy.y - 8, 4, 0, Math.PI * 2);
            this.ctx.fill();
            // Draw spikes
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.x, enemy.y - 20);
            this.ctx.lineTo(enemy.x, enemy.y - 30);
            this.ctx.moveTo(enemy.x - 15, enemy.y - 15);
            this.ctx.lineTo(enemy.x - 20, enemy.y - 25);
            this.ctx.moveTo(enemy.x + 15, enemy.y - 15);
            this.ctx.lineTo(enemy.x + 20, enemy.y - 25);
            this.ctx.stroke();
        }
        
        // Draw health bar
        const barWidth = 40;
        const barHeight = 5;
        const healthPercent = enemy.health / enemy.maxHealth;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - 35, barWidth, barHeight);
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - 35, barWidth * healthPercent, barHeight);
        
        // Draw health bar border
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(enemy.x - barWidth/2, enemy.y - 35, barWidth, barHeight);
    }
    
    drawProjectile(projectile) {
        const progress = 1 - (projectile.life / 20);
        const x = projectile.x + (projectile.targetX - projectile.x) * progress;
        const y = projectile.y + (projectile.targetY - projectile.y) * progress;
        
        const towerType = this.towerTypes[projectile.type];
        
        // Draw projectile glow
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = towerType.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw projectile core
        this.ctx.fillStyle = towerType.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw projectile border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw projectile trail
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        this.ctx.strokeStyle = towerType.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(projectile.x, projectile.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Draw sparkle effect
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(x + Math.random() * 6 - 3, y + Math.random() * 6 - 3, 1, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawEffect(effect) {
        if (effect.type === 'death') {
            this.ctx.save();
            this.ctx.globalAlpha = effect.life / 30;
            
            // Different colors based on tower type
            let color = '#ff0000';
            if (effect.towerType) {
                color = this.towerTypes[effect.towerType].color;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw explosion effect
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = (effect.life / 30) * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, 30, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        } else if (effect.type === 'tower_damage') {
            // Tower damage effect
            this.ctx.save();
            this.ctx.globalAlpha = effect.life / 20;
            this.ctx.fillStyle = '#ff4757';
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, 25, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        } else if (effect.type === 'tower_destruction') {
            // Tower destruction effect
            this.ctx.save();
            this.ctx.globalAlpha = effect.life / 40;
            
            const color = this.towerTypes[effect.towerType].color;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, 30, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw multiple explosion rings
            for (let i = 1; i <= 3; i++) {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.globalAlpha = (effect.life / 40) * (0.5 / i);
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, 30 + i * 10, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        } else if (effect.type === 'damage_text') {
            // Damage text effect
            this.ctx.save();
            this.ctx.globalAlpha = effect.life / 60;
            this.ctx.fillStyle = effect.color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(effect.text, effect.x, effect.y - (60 - effect.life) * 0.5);
            this.ctx.restore();
        }
    }
    
    updateUI() {
        document.getElementById('money').textContent = this.money;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('score').textContent = this.score;
        document.getElementById('enemies-remaining').textContent = `Enemies: ${this.enemies.length}`;
        this.updateTowerUI();
        this.updateTowerStats();
    }
    
    updateTowerStats() {
        const statsDisplay = document.getElementById('tower-stats-display');
        
        if (this.towers.length === 0) {
            statsDisplay.innerHTML = '<div class="stat-item">No towers placed yet</div>';
            return;
        }
        
        // Group towers by type
        const towerStats = {};
        for (let tower of this.towers) {
            if (!towerStats[tower.type]) {
                towerStats[tower.type] = {
                    count: 0,
                    totalKills: 0,
                    totalDamage: 0
                };
            }
            towerStats[tower.type].count++;
            towerStats[tower.type].totalKills += tower.kills;
            towerStats[tower.type].totalDamage += tower.totalDamage;
        }
        
        let statsHTML = '';
        for (let type in towerStats) {
            const stats = towerStats[type];
            const avgKills = stats.count > 0 ? (stats.totalKills / stats.count).toFixed(1) : 0;
            const avgDamage = stats.count > 0 ? (stats.totalDamage / stats.count).toFixed(0) : 0;
            
            statsHTML += `
                <div class="stat-item">
                    <strong>${this.towerTypes[type].name}</strong><br>
                    Count: ${stats.count} | Kills: ${stats.totalKills} | Avg: ${avgKills}<br>
                    Total Damage: ${stats.totalDamage} | Avg: ${avgDamage}
                </div>
            `;
        }
        
        statsDisplay.innerHTML = statsHTML;
    }
    
    showMessage(message, type) {
        // Create temporary message display
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'error' ? '#ff4757' : '#00d4ff'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }
    
    gameLoop() {
        this.update();
        this.drawMap();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TowerDefense();
}); c