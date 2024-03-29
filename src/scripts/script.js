var ctx = document.getElementById("ctx").getContext("2d"); 
ctx.font = '30px Arial';

var HEIGHT = 500;
var WIDTH = 500;
var timeWhenGameStarted = Date.now();	//return time in ms

var frameCount = 0;

var score = 0;

var Img = {};
Img.player = new Image();
Img.player.src = "img/player.png";
Img.enemy = new Image();
Img.enemy.src = 'img/enemy.png';
Img.bullet = new Image();
Img.bullet.src = 'img/bullet.png';
Img.upgrade1 = new Image();
Img.upgrade1.src = 'img/upgrade1.png';
Img.upgrade2 = new Image();
Img.upgrade2.src = 'img/upgrade2.png';
Img.map = new Image();
Img.map.src = 'img/map.png';


testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

document.onclick = function(mouse){
	player.performAttack();
}

document.oncontextmenu = function(mouse){
	player.performSpecialAttack();
	mouse.preventDefault();
}

document.onmousemove = function(mouse){
	var mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
	var mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
	
	mouseX -= player.x;
	mouseY -= player.y;
	
	player.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}

document.onkeydown = function(event){
	if(event.keyCode === 68)	//d
		player.pressingRight = true;
	else if(event.keyCode === 83)	//s
		player.pressingDown = true;
	else if(event.keyCode === 65) //a
		player.pressingLeft = true;
	else if(event.keyCode === 87) // w
		player.pressingUp = true;
}

document.onkeyup = function(event){
	if(event.keyCode === 68)	//d
		player.pressingRight = false;
	else if(event.keyCode === 83)	//s
		player.pressingDown = false;
	else if(event.keyCode === 65) //a
		player.pressingLeft = false;
	else if(event.keyCode === 87) // w
		player.pressingUp = false;
}

update = function(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	drawMap();
	frameCount++;
	score++;
	
	if(frameCount % 100 === 0)	//every 4 sec
		randomlyGenerateEnemy();

	if(frameCount % 75 === 0)	//every 3 sec
		randomlyGenerateUpgrade();
	
	
	
	for(var key in bulletList){
		bulletList[key].update();
		
		var toRemove = false;
		bulletList[key].timer++;
		if(bulletList[key].timer > 75){
			toRemove = true;
		}
		
		for(var key2 in enemyList){
			/*
			var isColliding = bulletList[key].testCollision(enemyList[key2]);
			if(isColliding){
				toRemove = true;
				delete enemyList[key2];
				break;
			}	
			*/
		}
		if(toRemove){
			delete bulletList[key];
		}
	}
	
	for(var key in upgradeList){
		upgradeList[key].update();
		var isColliding = player.testCollision(upgradeList[key]);
		if(isColliding){
			if(upgradeList[key].category === 'score')
				score += 1000;
			if(upgradeList[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete upgradeList[key];
		}
	}
	
	for(var key in enemyList){
		enemyList[key].update();
		enemyList[key].performAttack();
		
		var isColliding = player.testCollision(enemyList[key]);
		if(isColliding){
			player.hp = player.hp - 1;
		}
	}
	if(player.hp <= 0){
		var timeSurvived = Date.now() - timeWhenGameStarted;		
		console.log("You lost! You survived for " + timeSurvived + " ms.");		
		startNewGame();
	}
	player.update();
	
	ctx.fillText(player.hp + " Hp",0,30);
	ctx.fillText('Score: ' + score,200,30);
}

startNewGame = function(){
	player.hp = 10;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	enemyList = {};
	upgradeList = {};
	bulletList = {};
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	
}

player = Player();
startNewGame();

setInterval(update,40);


drawMap = function(){
	var x = WIDTH/2 - player.x;
	var y = HEIGHT/2 - player.y;
	ctx.drawImage(Img.map,0,0,Img.map.width,Img.map.height,x,y,Img.map.width*2,Img.map.height*2);
}
