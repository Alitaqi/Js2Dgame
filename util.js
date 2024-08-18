function determinWinner({player, enemy, timerId}){
    clearTimeout(timerId);
    document.querySelector('#displaytie').style.display ='flex';
    if(player.health === enemy.health){
        document.querySelector('#displaytie').innerHTML ="Tie";
        }
        else if(player.health > enemy.health){
            document.querySelector('#displaytie').innerHTML ="Player 1 Wins";
        }
        else if(enemy.health> player.health){
            document.querySelector('#displaytie').innerHTML ="Player 2 Wins";

        }
}
let timer=60;
let timerId;
function decreaseTimer(){
   
    if(timer>0){
        timerId= setTimeout(decreaseTimer,1000)
        timer--;
        document.querySelector('#timer').innerHTML =timer
    }
    if(timer=== 0){
       
        determinWinner({player, enemy, timerId});
        
}
    
}