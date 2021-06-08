/*
	Disabling canvas scroll for better experience on mobile interface.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23 at:
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});
document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});


///////////////////////////////////////////////
//
// Class: Leucocyte
// 
///////////////////////////////////////////////
let LC_MAX_SPEED = 3;
let X_EDGE;

class Leucocyte {
	constructor(id) {
		this.id = id;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.xEdge = X_EDGE;
		this.speed = 0;
		this.minxR = 0;
		this.minyR = 0;
		this.minzR = 0;
		this.varxR = 0;
		this.varyR = 0;
		this.varzR = 0;
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.reset();
	}

	move() {
		if (this.isOutOfBounds()) {
			this.reset();
		}

		this.x += this.speed;

		this.varxR = sin((frameCount+17*this.id)*0.05 + 5*this.id)*30;
		this.varyR = cos((frameCount+23*this.id)*0.06 + 2*this.id)*30;
		this.varzR = sin((frameCount+4*this.id)*0.04 + this.id)*30;
	}

	isOutOfBounds() {
		return (this.x > X_EDGE);
	}

	reset() {
		// Reset position
		this.x = -this.xEdge;
		this.y = random(-1.5, 1.5)*windowHeight;
		this.z = random(-2000, 5);

		// Reset radia
		this.minxR = 70;
		this.minyR = 70;
		this.minzR = 70;

		// Reset speed
		this.speed = 0;
		while (this.speed == 0) {
			this.speed = random(LC_MAX_SPEED);
		}

		// Reset colour
		this.r = random(255);
		this.g = random(255);
		this.b = random(255);
	}

	display() {
		push();
		translate(this.x, this.y, this.z);
//		fill(this.r, this.g, this.b);
		specularMaterial(this.r, this.g, this.b, 255);
//		emissiveMaterial(this.r, this.g, this.b, 255);
		shininess(1);
		ellipsoid(this.minxR + this.varxR, this.minyR + this.varyR, this.minzR + this.varzR, 3, 2);
		pop();
	}
}

///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

let NUM_LCS = 25;
let lcs;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  X_EDGE = 2*windowWidth;

  lcs = new Array(NUM_LCS);
  for (var i = 0; i < NUM_LCS; i++) {
  	lcs[i] = new Leucocyte(i);
  }


  rectMode(CENTER);
  noStroke();
  background(50, 0, 0);
}

function draw() {
	// Set lights
	//pointLight(255, 255, 255, 0, 0, 500);
	pointLight(cos(frameCount*0.001)*250, cos(frameCount*0.01)*50, 10+abs(sin(frameCount*0.003)*100), sin(frameCount*0.003)*windowWidth, cos(frameCount*0.01)*windowHeight, 500);

//	fill(cos(frameCount*0.001)*250, cos(frameCount*0.01)*100, sin(frameCount*0.003)*50, 1);
//	rect(0, 0, windowWidth, windowHeight);


	for (var i = 0; i < NUM_LCS; i++) {
		lcs[i].move();
		lcs[i].display();
	}

}