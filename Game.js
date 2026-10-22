let asteroids = []; // [] ger ein tóman lista
let lasers = [];
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let player ={ // hetta er spælarin hjá okkara sum vit kunnu brúka til at fáa virðini fyri skipið
    x: 375,
    y: 540,
    width: 50,
    height: 40,
    speed: 3
}
let moveLeft = false; // boolean variabel til at fylgja um skipið skal flytast til vinstru
let moveRight = false; // boolean variabel til at fylgja um skipið skal flytast til høgru
ctx.fillStyle = "white";
ctx.fillRect(player.x, player.y, player.width, player.height);
let isGameOver = false;
let GameScore = 0;
let Score = document.querySelector("#score");
let lives = 3;
let nextLifeScore = 20;
const asteroidSound = new Audio("asteroid.mp3");
const laserSound = new Audio ("Laser1.mp3");
const allSounds = [asteroidSound, laserSound];
const volumeSlider = document.getElementById("volume-slider");
let lastShotTime = 0; 
const SHOOT_COOLDOWN = 300; // 300 millisekund tvs 3 skót per sekund

allSounds.forEach(sound => {
    sound.volume = 0.02; 
});


// hetta er fyri at kunna stýra ljóðstyrkinum við einum slider
volumeSlider.addEventListener("input", (event) => {
   
    const rawVolume = event.target.value; 
    
    
    const adjustedVolume = rawVolume * rawVolume; 
    
   
    allSounds.forEach(sound => {
        sound.volume = adjustedVolume;
    });
});
//  her definera vit alt fyri at kunna tekna okkara ship sum t.d playercanvas og síðani pCtx er fyri at faktist fáa virðini vit seta til okkara trykant.
const playerCanvas = document.createElement('canvas');
playerCanvas.width = 50;
playerCanvas.height = 40;
const pCtx = playerCanvas.getContext('2d');
pCtx.fillStyle = "white";
// hetta teknar ein trykant fyri okkara ship
pCtx.beginPath();
pCtx.moveTo(25, 0);    
pCtx.lineTo(50, 40);  
pCtx.lineTo(0, 40);   
pCtx.closePath();
pCtx.fill();

//  hetta er okkara asteroid Sprite. sum merkir at her tekna vit hana og goyma hana so tað er lættari at kalla senni og tekur minni ram
const asteroidCanvas = document.createElement('canvas');
asteroidCanvas.width = 40;
asteroidCanvas.height = 40;
const aCtx = asteroidCanvas.getContext('2d');
aCtx.fillStyle = "darkgray";
// hetta teknar okkara asteroid 
aCtx.beginPath();
aCtx.arc(20, 20, 20, 0, Math.PI * 2);
aCtx.fill();

aCtx.fillStyle = "gray";             
aCtx.beginPath();
aCtx.arc(20, 20, 10, 0, Math.PI * 2); 
aCtx.fill();

// her tekna vit okkara laser
const laserCanvas = document.createElement('canvas');
laserCanvas.width = 4;
laserCanvas.height = 15;
const lCtx = laserCanvas.getContext('2d');
lCtx.fillStyle = "lime";
lCtx.fillRect(0, 0, 4, 15);




// hetta er fyri tá ið vit týrsta ein knapp tað hyggur eftir um hann er uppi elle niðir (hetta er uppi)
function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
        moveLeft = false;
    } else if (event.key === "ArrowRight") {
        moveRight = false;
    }

}
 // hetta er fyri tá ið vit týrsta ein knapp tað hyggur eftir um hann er uppi elle niðir (hetta er niðir)
function handlekeydown(event) {
    if (event.key === "ArrowLeft") {
        moveLeft = true;
    } else if (event.key === "ArrowRight") {
        moveRight = true;
    }
    if (event.key === " "){
        shootLasers();
    }
}
// hetta er spælið sjálvt, har ið vit hava gameover, flyta skipið, okkara asteroids og lasers og nogv anna
function gameloop(){
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Lives: " + lives, 12, 32);

        if(isGameOver){
            ctx.fillStyle = "red";
            ctx.font = "50px Arial";
            ctx.fillText( "gameover", 290, 300);
            return;
        }
    if(moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if(moveRight && player.x + player.width < 800) {
        player.x += player.speed;
    }
    ctx.drawImage(playerCanvas, player.x, player.y, player.width, player.height); // teknar okkara ship

    /*ctx.fillStyle="white";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight); */
   
   let shipCenterX = player.x + player.width / 2;
   let shipCenterY = player.y + player.height / 2;
    for (let i = asteroids.length - 1; i >= 0; i--){ // hetta forloop er fyri okkara asteroids vit kunnu eisini broyta hvussu skjótt hon dettur
        let ast = asteroids[i];
        ast.y += ast.speed;
       ctx.drawImage(asteroidCanvas, ast.x, ast.y, ast.width, ast.height); // hetta tekna okkara asteroid

        /*ctx.fillStyle = "blue"
        ctx.fillRect(ast.x, ast.y, ast.width, ast.height);*/
        
        if(ast.y > 600){ // hetta er fyri at sletta asteroids sum fara av skerminum so tað ikki tekur for nógv ram
            asteroids.splice(i,1);
            continue;
        }

        let astCenterX = ast.x + ast.width / 2; // alt hetta er fyri at rokna okkara hitbox fyri asteroid og shipið 
        let astCenterY = ast.y + ast.height / 2;
        let distX = shipCenterX - astCenterX;
        let distY = shipCenterY - astCenterY;
        let distance = Math.sqrt(distX * distX + distY * distY);
        let shipRadius = 20;
        let astRadius = 18;
        
        if (distance < shipRadius + astRadius){ // hetta er fyri at geva okkara skip og asteroid eina hitbox
            lives--;
            asteroidSound.currentTime = 0; // hetta er fyri at kunna spæla ljóðið aftur og aftur tá ið vit skjóta fleiri asteroids
            asteroidSound.play(); // hetta er fyri at spæla ein ljóð tá ið vit skjóta ein asteroid
            asteroids.splice(i, 1);
            if (lives === 0) {
                isGameOver = true;
            }
            break;
    }
}       // hetta er fyri at gera okkara lasers og kanna um teir hava rakt ein asteroid um teir hava so ferð points upp við einum
    for (let i = lasers.length - 1; i >= 0; i --){ 
        let laser = lasers[i];
        laser.y -= laser.speed;
        ctx.drawImage(laserCanvas, laser.x, laser.y, laser.width, laser.height);
        if (laser.y <-20) { // hetta er fyri at sletta lasers sum fara av skerminum so tað ikki tekur for nógv ram
            lasers.splice (i,1);
            continue;
        }
        for ( let j = 0; j < asteroids.length; j++){
            let ast = asteroids[j];

            if (laser.x < ast.x + ast.width &&
                laser.x + laser.width > ast.x &&
                laser.y < ast.y + ast.height &&
                laser.y + laser.height > ast.y){
                    asteroidSound.currentTime = 0; // hetta er fyri at kunna spæla ljóðið aftur og aftur tá ið vit skjóta fleiri asteroids
                    asteroidSound.play(); // hetta er fyri at spæla ein ljóð tá ið vit skjóta ein asteroid

                    GameScore++; // hetta er fyri at fáa points at fara upp
                    Score.textContent ="Points: " + GameScore;
                    if (GameScore >= nextLifeScore){
                        lives++;
                        nextLifeScore += 20;
                    }
                    asteroids.splice(j, 1);  // hetta er fyri at faktsit kunna raka okkara asteroids og fáa teir vekk tá ið teir vera raktir
                    lasers.splice(i, 1); 
                    break;
                    
                }
            
        }
    }

    
    requestAnimationFrame(gameloop);
}
// her hava vit skapið av okkara asteroid
function spawnAsteroid(){
    let newAsteroid = {
        x: Math.random() * 760, // finnur eitt random X punkt fyri okkara asteroid
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 1.1 // gevur eina random ferð niður eftir
        };
        asteroids.push(newAsteroid);
        
}
function shootLasers(){ // hetta er fyri at gera okkara lasers sum vit kunnu sjóta 
   const currentTime = Date.now();
   if (currentTime - lastShotTime < SHOOT_COOLDOWN) {
    return; // ikki skjóta ein laser um tað er ov tíðliga
   }
   
    let newLaser ={
        x: player.x + (player.width / 2) - 2,
        y: player.y - 10,
        width: 4,
        height: 15,
        speed: 7
    };
    lasers.push(newLaser);
    
    laserSound.currentTime = 0; // hetta er fyri at kunna spæla ljóðið aftur og aftur tá ið vit skjóta fleiri lasers
    laserSound.play(); // hetta er fyri at spæla ljóðið tá ið vit skjóta ein laser
}
function Restart(){
    window.location.reload(true);
}

gameloop();
setInterval(function() { // hetta spawnar okkara asteroid innanfyri eitt tíðspunkt vit hava valt
    spawnAsteroid();
}, 1000);
window.addEventListener("keydown", handlekeydown);
window.addEventListener("keyup", handleKeyUp);
