///////////////////////////////////////////////
//
// Class: Bot
// 
///////////////////////////////////////////////
let NUMBER_OF_LIGHTS = 4.0;
let CHANGE_LEG_DURATION = 500.0;
 
class Bot {
	constructor(id, x, y, r, g, b) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = 0;
		this.r = r;
		this.g = g;
		this.b = b;
		this.direction = 1;
		this.changingLeg = false;
		this.changeLegStart = 0;
		this.changingLegStartingX = 0;
		this.changingLegEndingX = 0;
		this.changingLegDistance = 0;
		this.leg  = new Leg(-1, this.x-0.5*BOT_SIZE, this.y + 0.5+BOT_SIZE + 0.5*LEG_HEIGHT, 255, 255, 255);
		this.newLeg;
	}

	isOutOfBounds() {
		return ((this.x > 0.5*windowWidth) || (this.x < -0.5*windowWidth) 
			|| (this.y > 0.5*windowHeight) || (this.y < -0.5*windowHeight));
	}

	display() {
		push();
		for (var i = 0; i < (NUMBER_OF_LIGHTS+1); i++) {
		  spotLight(this.r, this.g, this.b, -0.5*windowWidth + i*(windowWidth/NUMBER_OF_LIGHTS), this.y, 800, 0, 0, -1);
		}
		noStroke();
		specularMaterial(this.r, this.g, this.b);
		shininess(100);
		translate(this.x, this.y, this.z);
		sphere(BOT_SIZE);
		pop();
		this.leg.display();

		if ((this.direction > 0) && (this.x > 0.5*windowWidth-BOT_SIZE)) {
			this.direction = -1;
		} else if ((this.direction < 0) && (this.x < -0.5*windowWidth+BOT_SIZE)) {
			this.direction = 1;
		}
	}

	fitsNewLeg(leg) {
		if (this.changingLeg) {
			let elapsedTime = (millis() - this.changeLegStart);
			let xIncrement = (elapsedTime/CHANGE_LEG_DURATION)*this.changingLegDistance;
			if (this.direction > 0) {
				this.x = this.changingLegStartingX + xIncrement;
			} else {
				this.x = this.changingLegStartingX - xIncrement;
			}

			if (elapsedTime > CHANGE_LEG_DURATION) {
				this.changingLeg = false;		
				this.newLeg.frozen = false;
				this.leg.frozen = false;
			}

			// if ((this.direction > 0) && (this.x > 0.5*windowWidth-BOT_SIZE)) {
			// 	this.direction = -1;
			// } else if ((this.direction < 0) && (this.x < -0.5*windowWidth+BOT_SIZE)) {
			// 	this.direction = 1;
			// }
		} else if (this.isLegCloseEnough(leg)) {
			this.newLeg = leg;
			this.adoptNewLeg(leg);
			this.changingLeg = true;
			this.changeLegStart = millis();
			return true;
		}
		return false;
	}

	isLegCloseEnough(leg) {
		if (this.direction > 0) {
			return ((leg.x - this.x) > 0) && (abs(leg.x - this.x) < BOT_SIZE) && (abs(this.leg.y - leg.y) < 10);
		}
		return ((leg.x - this.x) < 0) && (abs(leg.x - this.x) < BOT_SIZE) && (abs(this.leg.y - leg.y) < 10); 
	}

	adoptNewLeg(newLeg) {
		this.changingLegStartingX = this.x;
		if (this.direction > 0) {
			this.changingLegEndingX = newLeg.x + 0.5*BOT_SIZE;
		} else {
			this.changingLegEndingX = newLeg.x - 0.5*BOT_SIZE;
		}
		this.changingLegDistance = abs(this.changingLegEndingX - this.changingLegStartingX);

		this.leg.swapWithFree(newLeg);

		newLeg.frozen = true;
		this.leg.frozen = true;
	}
}


///////////////////////////////////////////////
//
// CLASS: Leg
// 
///////////////////////////////////////////////
class Leg {
	constructor(id, x, y, r, g, b) {
		this.id - id;
		this.x = x;
		this.y = y;
		this.z = 0;
		this.r = r;
		this.g = g;
		this.b = b;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.frozen=false;

		this.resetSpeed();
	}

	resetSpeed() {
		while(this.xSpeed == 0) {
			this.xSpeed = random(-3, 3);
		}

		while(this.ySpeed == 0) {
			this.ySpeed = random(-3, 3);
		}
	}

	move() {
		// BOUNCING
		if (!this.frozen) {
			this.x += this.xSpeed;
			this.y += this.ySpeed;

			if (((this.xSpeed > 0) && (this.x > 0.5*windowWidth))
				|| ((this.xSpeed < 0) && (this.x < -0.5*windowWidth))) {
				this.xSpeed = -this.xSpeed;
			}

			if (((this.ySpeed > 0) && (this.y > 0.5*windowHeight))
				|| ((this.ySpeed < 0) && (this.y < -0.5*windowHeight))) {
				this.ySpeed = -this.ySpeed;
			}

			// RANDOM WALK
			// this.x += ((random(100)>50)?1:-1)*random(5);
			// this.y += ((random(100)>50)?1:-1)*random(5);

			// if (this.x < -0.5*windowWidth) {
			// 	this.x = -0.5*windowWidth
			// }

			// if (this.x > 0.5*windowWidth) {
			// 	this.x = 0.5*windowWidth
			// }

			// if (this.y < -0.5*windowHeight) {
			// 	this.y = -0.5*windowHeight
			// }

			// if (this.y > 0.5*windowHeight) {
			// 	this.y = 0.5*windowHeight
			// }
		}
	}
	
	display() {
		push();
		noStroke();
		specularMaterial(this.r, this.g, this.b);
		specularMaterial(255, 255, 255);
		shininess(100);
		translate(this.x, this.y, this.z);
		ellipsoid(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH);
		pop();
	}

	swapWithFree(freeLeg) {
		var newX = freeLeg.x;
		freeLeg.x = this.x;
		this.x = newX;
		this.resetSpeed();
	}
}


///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

let NUM_BOTS = 8;
let BOT_SIZE = 25;
let LEG_WIDTH = 0.25*BOT_SIZE;
let LEG_HEIGHT = 0.5*BOT_SIZE;
let NUM_FREE_LEGS = 150;
let bot;
let allBots;
let freeLegs;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  allBots = new Array(NUM_BOTS);
  for (var i = 0; i < NUM_BOTS; i++) {
//	let newbot = new Bot(i, -0.5*windowWidth+BOT_SIZE, -0.5*windowHeight + i*(windowHeight/NUM_BOTS)+1.2*BOT_SIZE, 255, 0, 0);
	let newbot = new Bot(i, -0.5*windowWidth+BOT_SIZE, -0.5*windowHeight + i*(windowHeight/NUM_BOTS)+0.5*(windowHeight/NUM_BOTS), random(255), random(255), random(255));
	allBots[i] = newbot;
  }
//  bot = new Bot(0, -0.5*windowWidth+BOT_SIZE, 0, 255, 0, 0);

  freeLegs = new Array(NUM_FREE_LEGS);
  for (var i = 0; i < NUM_FREE_LEGS; i++) {
	let lgx = random(-0.5*windowWidth, 0.5*windowWidth);
	let lgy = random(-0.5*windowHeight, 0.5*windowHeight);
	let lgz = 0;
	let lg = new Leg(i, lgx, lgy, lgz, 255, 255, 255);
	freeLegs[i] = lg;
  }

  rectMode(CENTER);
  background(200, 100, 150);
}

function draw() {
  // bot.display();
  // for (var i = 0; i < NUM_FREE_LEGS; i++) {
  // 	freeLegs[i].move();
  // 	freeLegs[i].display();

  // 	bot.fitsNewLeg(freeLegs[i]);
  // }
  for (var i = 0; i < NUM_BOTS; i++) {
  	stroke(50, 20);
  	let ly = -0.5*windowHeight + (i+1)*(windowHeight/NUM_BOTS);
  	line(-0.5*windowWidth, ly, 0.5*windowWidth, ly);
  	noStroke();
  }

  ambientLight(cos(frameCount*0.01)*200, 0, 0);
  spotLight(255, 0, 0, 0, 0, 5000, 0, 0, -1);

  for (var i = 0; i < NUM_BOTS; i++) {
	  allBots[i].display();
  }
  for (var i = 0; i < NUM_FREE_LEGS; i++) {
  	freeLegs[i].move();
  	freeLegs[i].display();

  	for (var j = 0; j < NUM_BOTS; j++) {
  		allBots[j].fitsNewLeg(freeLegs[i]);
  	}
  }

  // Veils
  // fill(abs(cos(frameCount*0.001))*30+30, sin(frameCount*0.001)*10, cos(frameCount*0.01)*30, 1);
  fill(abs(cos(frameCount*0.001))*30+30, sin(frameCount*0.001)*10, cos(frameCount*0.01)*30, 200);
  rect(0, 0, windowWidth, windowHeight);
}