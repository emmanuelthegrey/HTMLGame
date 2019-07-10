var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';
 
var HEIGHT = 500;
var WIDTH = 500;
var timeWhenGameStarted = Date.now();   //return time in ms
 
var player = {
        x:50,
        spdX:30,
        y:40,
        spdY:5,
        name:'P',
        hp:10, 
};
 
var enemyList = {};
 
 
getDistanceBetweenEntity = function (entity1,entity2){  //return distance (number)
        var vx = entity1.x - entity2.x;
        var vy = entity1.y - entity2.y;
        return Math.sqrt(vx*vx+vy*vy);
}
 
testCollisionEntity = function (entity1,entity2){       //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(entity1,entity2);
        return distance < 30;
}
 
Enemy = function (id,x,y,spdX,spdY){
        var genericEnemy = {
                x:x,
                spdX:spdX,
                y:y,
                spdY:spdY,
                name:'E',
                id:id,
        };
        enemyList[id] = genericEnemy;
       
}
 
document.onmousemove = function(mouse){
        var mouseX = mouse.clientX;
        var mouseY = mouse.clientY;
       
        player.x = mouseX;
        player.y = mouseY;
}
 
updateEntity = function (gameEntity){
        updateEntityPosition(gameEntity);
        drawEntity(gameEntity);
}
updateEntityPosition = function(gameEntity){
        gameEntity.x += gameEntity.spdX;
        gameEntity.y += gameEntity.spdY;
                       
        if(gameEntity.x < 0 || gameEntity.x > WIDTH){
                gameEntity.spdX = -gameEntity.spdX;
        }
        if(gameEntity.y < 0 || gameEntity.y > HEIGHT){
                gameEntity.spdY = -gameEntity.spdY;
        }
}
 
 
drawEntity = function(gameEntity){
        ctx.fillText(gameEntity.name,gameEntity.x,gameEntity.y);
}
 
 
 
update = function(){
        ctx.clearRect(0,0,WIDTH,HEIGHT);
       
        for(var key in enemyList){
                updateEntity(enemyList[key]);
               
                var isColliding = testCollisionEntity(player,enemyList[key]);
                if(isColliding){
                        player.hp = player.hp - 1;
                        if(player.hp <= 0){
                                var timeSurvived = Date.now() - timeWhenGameStarted;
                               
                                console.log("You lost! You survived for " + timeSurvived + " ms.");
                                timeWhenGameStarted = Date.now();
                                player.hp = 10;
                        }
                }
               
        }
       
        drawEntity(player);
        ctx.fillText(player.hp + " Hp",0,30);
}
 
Enemy('E1',150,350,10,15);
Enemy('E2',250,350,10,-15);
Enemy('E3',250,150,10,-8);
 
 
setInterval(update,40);
 