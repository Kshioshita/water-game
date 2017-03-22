// motion and orientation variables are global
var alpha, beta, gamma; //ORIENTATION
var xmotion, ymotion, zmotion; //MOTION
// P5 STUFF
var teamA;
var teamB;
var widthA;
var widthB;
var bg="#2d7eff";
var waterLevel=0;
var originalHeight;
var originalWidth;
var even=false;
var odd=false;
var team;
var winner=false;
var winningLevel=.9;
var headerHeight=256;

var myTeam;
function setup() {
	if(windowWidth<700){
		var myCanvas=createCanvas(320, 380);
		myCanvas.parent('canvas');
		originalHeight=380;
		originalWidth=window.innerWidth;
		teamA=5;
		teamB=5;
	}
	else{
		var myCanvas=createCanvas(windowWidth, 326);
		// myCanvas.parent('canvas');
		originalHeight=326;
		originalWidth=window.innerWidth;
		teamA=5;
		teamB=5;
	}

}

function draw() {
	if(winner==false){
		if(originalWidth>840){
			background(bg);
			noStroke();
			fill(200);
			rect(0, 0, windowWidth/2, originalHeight-teamA);
			rect(windowWidth/2, 0, windowWidth/2, originalHeight-teamB);
			fill(200);
			strokeWeight(4);
			stroke('red');
			line(0, height*(1-winningLevel), width, height*(1-winningLevel));
			stroke(0);
			strokeWeight(6);
			line(width/2, 0, windowWidth/2, height);
			strokeWeight(2);
			line(0, height*.25, width/10, height*.25);
			line(width/2, height*.25, width*(3/5), height*.25);
			line(0, height*.5, width/10, height*.5);
			line(width/2, height*.5, width*(3/5), height*.5);
			line(0, height*.75, width/10, height*.75);
			line(width/2, height*.75, width*(3/5), height*.75);

		}
		else{
			background(bg);
			noStroke();
			fill(220);
			rect(0, 0, windowWidth, originalHeight-waterLevel);
			stroke('black');
			strokeWeight(2);
			line(0, height*.25, width/6, height*.25);
			line(0, height*.5, width/6, height*.5);
			line(0, height*.75, width/6, height*.75);
		}
	}
	else{
		clear();
		createCanvas(windowWidth, windowHeight-200);
		background("#6AB5D4");
	}
	
}

function isEven(){
	team="even";
	console.log(team);
}

function isOdd(){
	team="odd";
	console.log(team);
}

function changeHeight(t, level){
	// console.log('level is '+level);
	if(t=='even'){
		teamA=teamA+level;
		if(teamA>originalHeight){
			teamA=originalHeight;
		}
		if(teamA>winningLevel*originalHeight){
			// console.log("team A is winner");
			winner=true;
			congratsA();
		}
	}
	else if(t=='odd'){
		teamB=teamB+level;
		// console.log('inside changeHeight odd');
		// console.log(teamB);
		if(teamB>originalHeight){
			teamB=originalHeight;
		}
		if(teamB>winningLevel*originalHeight){
			// console.log("team B is winner");
			winner=true;
			congratsB();
		}
	}
}
// OTHER JAVASCRIPT DOWN HEARE
// run this AFTER the page has loaded
function congratsA(){
	document.getElementById('teamA').style.display="none";
	document.getElementById('teamB').style.display="none";
	document.getElementById('bucket').style.display="none";
	document.getElementById('congrats').innerHTML="Congratulations! <br><span>Team A Survived Another Day!</span>";
}
function congratsB(){
	document.getElementById('teamA').style.display="none";
	document.getElementById('teamB').style.display="none";
	document.getElementById('bucket').style.display="none";
	document.getElementById('congrats').innerHTML="Congratulations! <br><span>Team B Survived Another Day!</span>";
}
function init(){

	////// ORIENTATION

	// declare the variables that we'll be using for orientation


	// function for orientation
	function handleOrientation(event){
		alpha=Math.floor(event.alpha);
		beta=Math.floor(event.beta);
		gamma=Math.floor(event.gamma);
		
		if(windowWidth<645){
			if(beta<0 && xmotion<1 && ymotion<5 && xmotion<5){
				var level=Math.abs(map(beta, -180, 180, 0, 20));
				waterLevel=waterLevel-level;
				if(waterLevel<0){
					waterLevel=0;
					level=0;
				}
				// console.log('the team is ' + team);
				// document.getElementById('gamma').innerHTML="inside pour "+level;
				socket.emit('orientation', {
					'waterLevel': level,
					'team':team
					// 'alpha': alpha,
					// 'beta': beta,
					// 'gamma':gamma
				});

			}
		}
		// send values to the DOM so that we can see them
		// document.getElementById('alpha').innerHTML=alpha;
		// document.getElementById('beta').innerHTML=beta;
		// document.getElementById('gamma').innerHTML=gamma;
		// document.getElementById('wlevel').innerHTML=waterLevel;
		// socket.emit('orientation', {
		// 			'waterLevel': waterLevel,
		// 			'team':team
		// 			// 'alpha': alpha,
		// 			// 'beta': beta,
		// 			// 'gamma':gamma
		// 		});

	}
	// event listener for orientation
	window.addEventListener('deviceorientation',handleOrientation, true);


	////// MOTION

	function deviceMotion(event){
		var acc=event.acceleration; //will return acceleration object
		// extract x, y, z from acceleration
		xmotion=Math.abs(acc.x);
		ymotion=Math.abs(acc.y);
		zmotion=Math.abs(acc.z);

		// document.getElementById('xmov').innerHTML=Math.floor(xmotion);
		// document.getElementById('ymov').innerHTML=Math.floor(ymotion);
		// document.getElementById('zmov').innerHTML=Math.floor(zmotion);
		// document.getElementById('wlevel').innerHTML=waterLevel;

		if(windowWidth<645){
			if(beta>40){
				var y=map(ymotion, 0, 5000, 0, 30);
				var z=map(zmotion, 0, 5000, 0, 30);
				var x=map(xmotion, 0, 5000, 0, 30);
				waterLevel=waterLevel+y+z+x;
			}
			
		}
	}
	window.addEventListener('devicemotion', deviceMotion, true);
	
}

window.addEventListener('load', init);

