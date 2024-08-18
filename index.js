const canvas = document.querySelector('canvas');
const c= canvas.getContext('2d');

canvas.width=1024;
canvas.height=576;

c.fillRect(0,0, canvas.width,canvas.height);
const gravity=0.7;

const background = new Sprite({
    position:{ x:0,y:0},
    imageSrc: 'background.png'
});

const shop = new Sprite({
    position:{ x:600,y:129},
    imageSrc: 'shop.png',
    scale: 2.75,
    framesMax: 6
});

const player= new Fighter({position: {
      x: 0, y: 0
},
velocity:{x:0, y:10},
offset:{
    x: 0,
    y: 0
},
imageSrc: 'samuraiMack/Idle.png',
framesMax:8,
scale:2.5
,offset:{
    x: 215 ,
    y: 157
},
sprites: {
    idle:{
        imageSrc:'samuraiMack/Idle.png',
        framesMax: 8
    },
    run:{
        imageSrc:'samuraiMack/Run.png',
        framesMax: 8
    },
    jump:{
        imageSrc:'samuraiMack/Jump.png',
        framesMax: 2
    },
    fall:{
        imageSrc:'samuraiMack/Fall.png',
        framesMax: 2
    },
    attack1:{
        imageSrc:'samuraiMack/Attack1.png',
        framesMax: 6
    },
    takeHit:{
        imageSrc:'samuraiMack/Take Hit.png',
        framesMax: 4
    },
    death:{
        imageSrc:'samuraiMack/Death.png',
        framesMax: 6
    }
},
attackBox: {
    offset:{
        x: 100,
        y: 50
    }
    ,width: 148,
    height: 50
}
});


const enemy= new Fighter(
    {position: {
    x: 400, y: 100
},
velocity:{x:0, y:0}, color: 'blue',
offset:{
    x: -50,
    y: 0
},
imageSrc: 'kenji/Idle.png',
framesMax:4,
scale:2.5
,offset:{
    x: 215 ,
    y: 167
},
sprites: {
    idle:{
        imageSrc:'kenji/Idle.png',
        framesMax: 4
    },
    run:{
        imageSrc:'kenji/Run.png',
        framesMax: 8
    },
    jump:{
        imageSrc:'kenji/Jump.png',
        framesMax: 2
    },
    fall:{
        imageSrc:'kenji/Fall.png',
        framesMax: 2
    },
    attack1:{
        imageSrc:'kenji/Attack1.png',
        framesMax: 4
    },
    takeHit:{
        imageSrc:'kenji/Take Hit.png',
        framesMax: 3
    },
    death:{
        imageSrc:'kenji/Death.png',
        framesMax: 7
    }
},
attackBox: {
    offset:{
        x: -178,
        y:50
    }
    ,width: 178,
    height: 50
}
});



const keys={
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}



function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle= 'black';
    c.fillRect(0,0, canvas.width,canvas.height);

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0,0, canvas.width, canvas.height);
    player.update();
   enemy.update();
    player.velocity.x=0;
    enemy.velocity.x=0;
    //player 1 movemetn
    player.switchSprite('idle')
    
    if(keys.a.pressed && player.lastkey==='a'){
        player.velocity.x=-5;
        player.switchSprite('run');
    }
    else if(keys.d.pressed && player.lastkey==='d'){
        player.velocity.x=5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('else');
    }
    
    if(player.velocity.y<0){
        player.switchSprite('jump');
    }
    else if(player.velocity.y>0){
        player.switchSprite('fall');
    }
    //enemy mvoement
    if(keys.ArrowLeft.pressed && enemy.lastkey==='ArrowLeft'){
        enemy.velocity.x=-5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastkey==='ArrowRight'){
        enemy.velocity.x=5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    
    if(enemy.velocity.y<0){
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y>0){
        enemy.switchSprite('fall');
    }

    if(player.attackBox.position.x + player.attackBox.width >=enemy.position.x && 
        player.attackBox.position.x <= enemy.position.x +enemy.width
         && player.attackBox.position.y +player.attackBox.height >= enemy.position.y 
         && player.attackBox.position.y <= enemy.position.y +enemy.height&&
        player.isAttacking && player.frameCurrent === 4){
            enemy.takeHit();
            player.isAttacking =false;
            
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
              })
    }

    //if plaeyr mises
    if(player.isAttacking && player.frameCurrent ===4)
    { player.isAttacking =false}

    if(enemy.attackBox.position.x + enemy.attackBox.width >=player.position.x && 
        enemy.attackBox.position.x <= player.position.x +player.width
         && enemy.attackBox.position.y +enemy.attackBox.height >= player.position.y 
         && enemy.attackBox.position.y <= player.position.y +player.height&&
        enemy.isAttacking && enemy.frameCurrent ===2){
            enemy.isAttacking =false;
            player.takeHit();
           enemy.isAttacking=false
           gsap.to('#playerHealth', {
            width: player.health + '%'
          })
    }
    
    //if enemyr mises
    if(enemy.isAttacking && enemy.frameCurrent ===2)
        { enemy.isAttacking =false}
    //end game 
    if(enemy.health<=0 || player.health <=0){
            determinWinner({player, enemy, timerId});
    }


}




decreaseTimer();

animate();

window.addEventListener('keydown', (event)=> {
   if(!player.dead){

   
    switch (event.key){
        case 'd':
            keys.d.pressed=true;
            player.lastkey='d';
            break;
        case 'a':
            keys.a.pressed=true;
            player.lastkey='a';
            break;
        case 'w':
            player.velocity.y=-20;
            break;
        case ' ':
            player.attack();
            break;
    }}

    if(!enemy.dead){
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            enemy.lastkey='ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            enemy.lastkey='ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y=-20;
            break;
        case 'ArrowDown':
            enemy.attack();
        //    / enemy.isAttacking=true;
            break;
          
    }}
})

window.addEventListener('keyup', (event)=> {
    switch (event.key){
        case 'd':
            keys.d.pressed=false;
            break;
        case 'a':
            keys.a.pressed=false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed=false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
            break;
    }
})


