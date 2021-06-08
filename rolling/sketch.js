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
// Class: Microvillus
// 
///////////////////////////////////////////////
let MV_MAX_LIFESPAN = 5000; // in ms
let MC_MIN_LENGTH = 0.05;

class Microvillus {
	constructor(y, z) {
		this.y = y;
		this.z = z;
		this.xStuck = 0;
		this.phi = 0;
		this.lifeSpan = 0;
		this.lastTimeBorn = 0;
	}

	display(x, y, z) {
		if (this.isDead()) {
			this.reset(x, y, z);
		}

		push();

		let deltaX = (x - this.xStuck);
		this.phi = atan((LC_RADIUS*1.0)/(deltaX*1.0));
		let hip = (LC_RADIUS*1.0)/(sin(this.phi)*1.0);

// MAYBE UNCOMMENT
		// translate(this.xStuck+cos(this.phi)*0.5*hip, y+sin(this.phi)*0.5*hip, z+10);
		// rotate(this.phi);
		// cone(0.25*LC_RADIUS, hip);

		// translate(this.xStuck, this.y, this.z);
		// beginShape();
		// vertex(0, LC_RADIUS, 0);
		// vertex(2, LC_RADIUS, 0);
		// vertex(0, LC_RADIUS, 2);
		// vertex(2, LC_RADIUS, 2);
		// vertex(x-this.xStuck, 0, 0);
		// vertex(x-this.xStuck+2, LC_RADIUS, 0);
		// vertex(x-this.xStuck, 0, 2);
		// vertex(x-this.xStuck+2, LC_RADIUS, 2);
		// endShape(CLOSE);


		noStroke();
		pop();
	}

	reset(x, y, z) {
		this.lifeSpan = 0;
		while (this.lifeSpan == 0) {
			this.lifeSpan = random(MV_MAX_LIFESPAN)+1;
		}

		this.xStuck = x;
		this.y = y;
		this.z = z;
		this.lastTimeBorn = millis();
	}

	isDead() {
		return (millis() - this.lastTimeBorn) > this.lifeSpan;
	}
}

///////////////////////////////////////////////
//
// Class: Leucocyte
// 
///////////////////////////////////////////////
let LC_MAX_SPEED = 10;
let X_EDGE;
let LC_MASS = 3;
let LC_RADIUS = 100;
let WALL_SHEAR_STRESS = 0.00005;//0.00005;
let SPRING_CONSTANT = 0.25;

class Leucocyte {
	constructor(id) {
		this.id = id;
		this.x = 0;
		this.y = 0;
		this.yCurr = 0;
		this.z = 0;
		this.xEdge = X_EDGE;
		this.mass = LC_MASS;
		this.speed = 0;
		this.shearForce = 0;
		this.dragForce = 0;
		this.minxR = 0;
		this.minyR = 0;
		this.minzR = 0;
		this.varxR = 0;
		this.varyR = 0;
		this.varzR = 0;
		this.rotationAngle = 0;
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.microvillus = new Microvillus(this.y, this.z);
		this.reset();
	}

	updateSpeed() {
		let pullForce = this.calculateShearForce() - this.calculateDragForce();
		let acceleration = pullForce / this.mass;
		this.speed += acceleration;
		if (this.speed < 0) {
			this.speed = 0;
		}
	}

	calculateShearForce() {
		let torque = 11.87*WALL_SHEAR_STRESS*pow(LC_RADIUS, 2);
		let torqueForce = torque/LC_RADIUS;
		let fluidShearForce = 31.97*WALL_SHEAR_STRESS*pow(LC_RADIUS, 2);
		return torqueForce + fluidShearForce;
	}

	calculateDragForce() {
		let deltaX = this.x - this.microvillus.xStuck;
		let phi = atan((LC_RADIUS*1.0)/(deltaX*1.0));
		let cosphi = cos(phi);
		let currLength = deltaX/cosphi;
		let deltaStretch = currLength - MC_MIN_LENGTH;
		let springForce = SPRING_CONSTANT*deltaStretch;
		let springDragForce = springForce*cosphi;
		let torqueDragForce = springDragForce/LC_RADIUS;
		return springDragForce + torqueDragForce;
	}

	move() {
		if (this.isOutOfBounds()) {
			this.reset();
		}

		this.updateSpeed();
		this.x += this.speed;
		this.rotationAngle += this.speed*0.8*PI;

		// this.varxR = abs(sin((frameCount+17*this.id)*0.05 + 5*this.id))*0.25*LC_RADIUS;
		// this.varyR = abs(cos((frameCount+23*this.id)*0.06 + 2*this.id))*0.25*LC_RADIUS;
		// this.varzR = abs(sin((frameCount+4*this.id)*0.04 + this.id))*0.25*LC_RADIUS;
		// this.varxR = 0.25*(this.x - this.microvillus.xStuck);
		this.varyR = 0.25*LC_RADIUS-0.25*(this.x - this.microvillus.xStuck);
		this.varxR = LC_RADIUS-this.varyR;
		this.varzR = abs(sin((frameCount+4*this.id)*0.04 + this.id))*0.25*LC_RADIUS;

		this.yCurr = this.y-0.5*this.varyR;
	}

	isOutOfBounds() {
		return (this.x > X_EDGE);
	}

	reset() {
		// Reset position
		this.x = -this.xEdge;
		this.y = random(-1.5, 1.5)*windowHeight;
		this.z = random(-2000, 200);

		// Reset radia
		this.minxR = 0.5*LC_RADIUS;
		this.minyR = LC_RADIUS;
		this.minzR = 0.5*LC_RADIUS;
		this.rotationAngle = 0;

		// Reset speed
		this.speed = 0;
		while (this.speed == 0) {
			this.speed = random(LC_MAX_SPEED);
		}

		// Reset colour
		this.r = random(255);
		this.g = random(255);
		this.b = random(255);

		// Reset microvillus
		this.microvillus.reset(this.x, this.y, this.z);
	}

	display() {
		push();
		translate(this.x, this.yCurr, this.z);
		specularMaterial(this.r, this.g, this.b, 255);
//		emissiveMaterial(this.r, this.g, this.b, 255);
		shininess(1);
//		ellipsoid(this.minxR + this.varxR, this.minyR + this.varyR, this.minzR + this.varzR, 3, 2);
//		ellipsoid(this.minxR + this.varxR, this.minyR + this.varyR, this.minzR + this.varzR, 6, 4);
		ellipsoid(this.minxR + this.varxR, this.minyR + this.varyR, this.minzR + this.varzR, 4, 3);
		push();
		for (var i = 0; i < 4; i++) {
			rotate(this.rotationAngle+0.25*PI);
			cone(0.1*LC_RADIUS, 2.2*LC_RADIUS);
		}
		rotateX(HALF_PI);
		for (var i = 0; i < 4; i++) {
			rotate(this.rotationAngle+0.25*PI);
			cone(0.1*LC_RADIUS, 2.2*LC_RADIUS);
		}
		rotateY(HALF_PI);
		for (var i = 0; i < 4; i++) {
			rotate(this.rotationAngle+0.25*PI);
			cone(0.1*LC_RADIUS, 2.2*LC_RADIUS);
		}		
		pop();
		pop();
		this.microvillus.display(this.x, this.yCurr, this.z);
	}
}

///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

let NUM_LCS = 50;
let lcs;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  X_EDGE = 2*windowWidth;

  lcs = new Array(NUM_LCS);
  for (var i = 0; i < NUM_LCS; i++) {
  	lcs[i] = new Leucocyte(i);
  }


  rectMode(CENTER);
//  angleMode(DEGREES);
  noStroke();
  background(50, 0, 0);
}

function draw() {
	// Set lights
	//pointLight(255, 255, 255, 0, 0, 500);
	pointLight(cos(frameCount*0.001)*250, cos(frameCount*0.01)*50, 10+abs(sin(frameCount*0.003)*100), sin(frameCount*0.003)*windowWidth, cos(frameCount*0.01)*windowHeight, 500);

	if (millis()%200 == 0) {
		fill(255, 0, 0, 10);
		rect(0, 0, cos(frameCount*0.01)*windowWidth, windowHeight);
	}


	for (var i = 0; i < NUM_LCS; i++) {
		lcs[i].move();
		lcs[i].display();
	}

}