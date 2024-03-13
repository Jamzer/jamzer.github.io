var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');

var isPlaying = false;
var jet1;
var btnPlay = new Button(185, 568, 155, 300);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var gameTime = 0;
var scoreThreshold = 100;
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
var enemies = [];
var spawnAmount = 7;

var imgSprite = new Image();
imgSprite.src = 'https://jamzer.github.io/Sprite.png';
imgSprite.addEventListener('load', init, false);

var bgDrawX = 0;
var bgDrawX2 = 800;

function moveBg() {
    bgDrawX -= 6;
    bgDrawX2 -= 6;
    if (bgDrawX <= -800) {
        bgDrawX = 800;
    } else if (bgDrawX2 <= -800) {
        bgDrawX2 = 800;
    }
    drawBg();
}

var bg2DrawX = 0;
var bg2DrawX2 = 800;

function moveBg2() {
    bg2DrawX -= 2;
    bg2DrawX2 -= 2;
    if (bg2DrawX <= -800) {
        bg2DrawX = 800;
    } else if (bg2DrawX2 <= -800) {
        bg2DrawX2 = 800;
    }
    drawBg2();
}

function init() {
    jet1 = new Jet();
    spawnEnemy(spawnAmount);
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}

function playGame() {
    drawBg2();
    drawBg();
    startLoop();
    updateHUD();
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}

function spawnEnemy(number) {
    for (var i = 0; i < number; i++) {
        var newEnemy = new Enemy();
        enemies.push(newEnemy);
    }
}

function drawAllEnemies() {
    clearCtxEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}

function loop() {
    if (isPlaying) {
        jet1.draw();
        drawAllEnemies();
        moveBg2();
        moveBg();
        if (jet1.score >= scoreThreshold) {
            endGame();
            return;
        }
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function stopLoop() {
    isPlaying = false;
}

function endGame() {
    stopLoop();
    // Perform end game actions here
    console.log("Game Over! Score: " + jet1.score);
    // Additional actions like displaying game over message can be added here
}

function drawMenu() {
    ctxBg.drawImage(imgSprite, 0, 616, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

function drawBg() {
    ctxBg.drawImage(imgSprite, 0, 0, gameWidth, gameHeight, bgDrawX, 0, gameWidth, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, gameWidth, gameHeight, bgDrawX2, 0, gameWidth, gameHeight);
}

function drawBg2() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
    ctxBg.drawImage(imgSprite, 800, 0, gameWidth, gameHeight, bg2DrawX, 0, gameWidth, gameHeight);
    ctxBg.drawImage(imgSprite, 800, 0, gameWidth, gameHeight, bg2DrawX2, 0, gameWidth, gameHeight);
}

function updateHUD() {
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("Score: " + jet1.score, 700, 30);
    // Add health display if needed
}

// Jet functions

function Jet() {
    this.srcX = 0;
    this.srcY = 500;
    this.width = 100;
    this.height = 30;
    this.speed = 3;
    this.drawX = 200;
    this.drawY = 200;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 20; i++) {
        this.bullets.push(new Bullet(this));
    }
    this.score = 0;
    this.health = 100;
}

Jet.prototype.draw = function () {
    clearCtxJet();
    this.updateCoors();
    this.checkDirections();
    //places the bullets at the nose of the jet
    this.checkShooting();
    this.drawAllBullets();
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    
    // Display health percentage text
    ctxJet.fillStyle = "white";
    ctxJet.font = "bold 12px Arial";
    ctxJet.fillText("Health: " + this.health + "%", this.drawX + 10, this.drawY - 10);
};

Jet.prototype.updateCoors = function() {
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 20;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
};

Jet.prototype.checkDirections = function() {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
    }
};

Jet.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
    }
};

Jet.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
};

Jet.prototype.updateScore = function(points) {
    this.score += points;
    updateHUD();
};

function clearCtxJet() {
    ctxJet.clearRect(0, 0, gameWidth, gameHeight);
}

// Bullet functions

function Bullet(jet) {
    this.jet = jet;
    this.srcX = 100;
    this.srcY = 500;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 5;
    this.height = 5;
    this.explosion = new Explosion();
}

Bullet.prototype.draw = function() {
    this.drawX += 3;
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};

Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (
            this.drawX + this.width >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY + this.height >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height
        ) {
            this.explosion.drawX = enemies[i].drawX - this.explosion.width / 2;
            this.explosion.drawY = enemies[i].drawY;
            this.explosion.hasHit = true;
            this.recycle();
            enemies[i].health -= 20; // Reduce enemy's health
            if (enemies[i].health <= 0) {
                enemies[i].recycleEnemy();
                jet1.updateScore(enemies[i].rewardPoints);
            }
            return; // Exit the loop once a collision is detected
        }
    }

    // Check for collision with player's jet
    if (
        this.drawX + this.width >= jet1.drawX &&
        this.drawX <= jet1.drawX + jet1.width &&
        this.drawY + this.height >= jet1.drawY &&
        this.drawY <= jet1.drawY + jet1.height
    ) {
        this.recycle();
        jet1.health -= 20; // Reduce player's health
        if (jet1.health <= 0) {
            endGame(); // Trigger game over if player's health reaches zero
        }
    }
};

Bullet.prototype.recycle = function() {
    this.drawX = -20;
};

// Explosion functions

function Explosion() {
    this.srcX = 0;
    this.srcY = 570;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 100;
    this.height = 40;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 10;
}

Explosion.prototype.draw = function() {
    if (this.currentFrame <= this.totalFrames) {
        ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    } else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};

// Enemy functions

function Enemy() {
    this.srcX = 0;
    this.srcY = 539;
    this.width = 100;
    this.height = 30;
    this.speed = 2;
    this.drawX = Math.floor(Math.random() * 1000) + 900;
    this.drawY = Math.floor(Math.random() * 360);
    this.rewardPoints = 5;
    this.health = 100;
}

Enemy.prototype.draw = function () {
    this.drawX -= this.speed;
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped();
    
    // Display health percentage text
    ctxEnemy.fillStyle = "white";
    ctxEnemy.font = "bold 12px Arial";
    ctxEnemy.fillText("Health: " + this.health + "%", this.drawX + 10, this.drawY - 10);
};

Enemy.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0)
        this.recycleEnemy();
};

Enemy.prototype.recycleEnemy = function() {
    this.drawX = Math.floor(Math.random() * 1000) + 900;
    this.drawY = Math.floor(Math.random() * 360);
};

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}

// Button object

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function() {
    return this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom;
};

// Event functions

function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying) {
        if (btnPlay.checkClicked()) playGame();
    }
}

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) {
        jet1.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) {
        jet1.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) {
        jet1.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) {
        jet1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) {
        jet1.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) {
        jet1.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) {
        jet1.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) {
        jet1.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) {
        jet1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) {
        jet1.isSpacebar = false;
        e.preventDefault();
    }
}
