var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0, 0%, 0%, 0.5)";
ctxHUD.font = "bold 20px Arial"
console.log("Working");
var jet1 = new Jet();
var btnPlay = new Button(185, 568, 155, 300);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame || 
									window.webkitRequestAnimationFrame ||
									window.mozRequestAnimationFrame ||
									window.msRequestAnimationFrame ||
									window.oRequestAnimationFrame	||
									function (callback) {
									window.setTimeout(callback, 1000 / 60);
									};
var enemies = [];
var spawnAmount = 7;

var imgSprite = new Image();
imgSprite.src = 'Images/reSprite.png';
imgSprite.addEventListener('load',init,false);

var bgDrawX = 0;
var bgDrawX2 = 800;

function moveBg() {
	bgDrawX -= 6;
	bgDrawX2 -= 6;
	if (bgDrawX <= -800) { //change to 1600?
		bgDrawX = 800;
	} else if (bgDrawX2 <= -800) { //change to 1600?
		bgDrawX2 = 800;
	}
	drawBg();
}

var bg2DrawX = 0;
var bg2DrawX2 = 800;

function moveBg2() {
	bg2DrawX -= 2;
	bg2DrawX2 -= 2;
	if (bg2DrawX <= -800) { //change to 1600?
		bg2DrawX = 800;
	} else if (bg2DrawX2 <= -800) { //change to 1600?
		bg2DrawX2 = 800;
	}
	drawBg2();
}
//new



//main functions

function init() {
	spawnEnemy(spawnAmount);
	drawMenu();
	document.addEventListener('click', mouseClicked,false);
}

function playGame() {
	drawBg2();
	drawBg();
	startLoop();
	updateHUD();
	document.addEventListener('keydown', checkKeyDown,false);
	document.addEventListener('keyup', checkKeyUp,false);
}

function spawnEnemy(number) {
	for (var i = 0; i < number; i++) {
		enemies[enemies.length] = new Enemy();
	}
}

function drawAllEnemies() {
	clearCtxEnemy();
	for (var i = 0; i < enemies.length; i ++) {
		enemies[i].draw();
	}
}

function loop() {
	if (isPlaying) {
		jet1.draw();
		drawAllEnemies();
		requestAnimFrame(loop);
		moveBg2();
		moveBg();
	}
}

function startLoop() {
	isPlaying = true;
	loop();
	
}

function stopLoop() {
	isPlaying = false;
	
}

function drawMenu() {
	ctxBg.drawImage(imgSprite,0,616,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}

function drawBg() {
	//ctxBg.clearRect(0,0,gameWidth,gameHeight); is removed  so it will overlap the next background
	ctxBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,bgDrawX,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,bgDrawX2,0,gameWidth,gameHeight);
}

function drawBg2() {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,800,0,gameWidth,gameHeight,bg2DrawX,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,800,0,gameWidth,gameHeight,bg2DrawX2,0,gameWidth,gameHeight);
}

function updateHUD() {
		ctxHUD.clearRect(0,0,gameWidth,gameHeight);
		ctxHUD.fillText("Score: " + jet1.score, 700, 30);

}
//end of main functions

//Jet functions

function Jet()  {
	//this refers to the sprite file selecting an image of width and height (100,39) from point (0,500) 
	this.srcX = 0;
	this.srcY = 500;
	this.width = 100;
	this.height = 30;
	// control speed of jet when moving it with the keyboard
	this.speed = 3;
	//point to place the jet when game starts
	this.drawX = 200;
	this.drawY = 200;
	//point where bullets will spawn
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
	for (var i = 0; i < 20; i++){
		this.bullets[this.bullets.length] = new Bullet(this);
	}
	this.score = 0;
}

Jet.prototype.draw = function () {
	clearCtxJet();
	this.updateCoors();
	this.checkDirections();
	//places the bullets at the nose of the jet
	this.checkShooting();
	this.drawAllBullets();
	ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Jet.prototype.updateCoors = function () {
	this.noseX = this.drawX + 100;
	this.noseY =  this.drawY + 20;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
};
	
Jet.prototype.checkDirections = function () {
	if (this.isUpKey && this.topY > 0) {
		this.drawY -= this.speed;
	}
	if (this.isRightKey && this.rightX < gameWidth){
		this.drawX += this.speed;
	}
	if (this.isDownKey && this.bottomY < gameHeight){
		this.drawY += this.speed;
	}
	if (this.isLeftKey && this.leftX > 0){
		this.drawX -= this.speed;
	}	
};

Jet.prototype.drawAllBullets = function() {
	for (var i = 0; i < this.bullets.length; i ++) {
		if(this.bullets[i].drawX >= 0) this.bullets[i].draw();
		if(this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
	}
}

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

function clearCtxJet(){
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
}

//end of jet functions

// bullet functions

function Bullet(j) {
	this.jet = j;
	this.srcX = 100;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 5;
	this.height = 5;
	this.explosion = new Explosion();
}

Bullet.prototype.draw = function () {
	this.drawX += 3;
	ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitEnemy();
	if (this.drawX > gameWidth) this.recycle();
};

Bullet.prototype.fire = function (startX, startY) {
	this.drawX = startX;
	this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function () {
	for (var i = 0; i < enemies.length; i++) {
		if	(this.drawX >= enemies[i].drawX &&
			 this.drawX <= enemies[i].drawX + enemies[i].width &&
			 this.drawY >= enemies[i].drawY &&
			 this.drawY <= enemies[i].drawY + enemies[i].height) {
				this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
				this.explosion.drawY = enemies[i].drawY;
				this.explosion.hasHit = true;
				this.recycle();
				enemies[i].recycleEnemy();
				this.jet.updateScore(enemies[i].rewardPoints);
		}
	}
};

Bullet.prototype.recycle = function () {
	this.drawX = -20;
};

// end of bullet function


//explosion functions

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

Explosion.prototype.draw = function () {
	if (this.currentFrame <= this.totalFrames) {
		ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.currentFrame++;
	} else {
		this.hasHit = false;
		this.currentFrame = 0;
	}
};

//end of explosion functions

// enemy functions

function Enemy()  {
	this.srcX = 0;
	this.srcY = 539;
	this.width = 100;
	this.height = 30;
	this.speed = 2;
	this.drawX = Math.floor(Math.random()*1000) + 900;
	this.drawY =  Math.floor(Math.random()*360);
	this.rewardPoints = 5;
}

Enemy.prototype.draw = function () {
	this.drawX -= this.speed;
	ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
};

Enemy.prototype.checkEscaped = function () {
	if(this.drawX + this.width <= 0)
		//delete enemy
		this.recycleEnemy();
}

Enemy.prototype.recycleEnemy = function () {
	// splice parameter 1 is the number in the list, parameter 2 is how moany to delete
	//enemies.splice(enemies.indexOf(this),1);
	//totalEnemies--;
	this.drawX = Math.floor(Math.random()*1000) + 900;
	this.drawY =  Math.floor(Math.random()*360);
}

function clearCtxEnemy(){
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

// end enemy functions

//button object

function Button (xL, xR, yT, yB) {
	this.xLeft = xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
}

Button.prototype.checkClicked = function () {
	if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};

// end of button object

// event functions


function mouseClicked (e) {
	mouseX = e.pageX - canvasBg.offsetLeft;
	mouseY = e.pageY - canvasBg.offsetTop;
	if(!isPlaying) {
		if (btnPlay.checkClicked()) playGame();
	}
}

function checkKeyDown(e) {
	var keyID =  e.keyCode || e.which;
	if (keyID === 38 || keyID === 87)  { //38 means up arrow key and 87 means w key
		jet1.isUpKey = true;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68)  { //38 means right arrow key and 87 means d key
		jet1.isRightKey = true;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83)  { //38 means down arrow key and 87 means s key
		jet1.isDownKey = true;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65)  { //38 means left arrow key and 87 means a key
		jet1.isLeftKey = true;
		e.preventDefault();
	}
	if (keyID === 32)  { //38 means left arrow key and 87 means a key
		jet1.isSpacebar = true;
		e.preventDefault();
	}
}

function checkKeyUp(e) {
	var keyID =  e.keyCode || e.which;
	if (keyID === 38 || keyID === 87)  { //38 means up arrow key and 87 means w key
		jet1.isUpKey = false;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68)  { //39 means right arrow key and 87 means d key
		jet1.isRightKey = false;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83)  { //38 means down arrow key and 87 means s key
		jet1.isDownKey = false;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65)  { //38 means left arrow key and 87 means a key
		jet1.isLeftKey = false;
		e.preventDefault();
	}
	if (keyID === 32)  { //38 means left arrow key and 87 means a key
		jet1.isSpacebar = false;
		e.preventDefault();
	}
}

//end of event functions
