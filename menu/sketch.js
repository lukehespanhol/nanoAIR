/*
	Disabling canvas scroll for better experience on mobile interface.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23 at:
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
var HOST = window.location.origin + '/nanoAIR';
//var HOST = window.location.origin + ''; // for local test

document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});
document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});

///////////////////////////////////////////////
//
// Class: Button
// 
///////////////////////////////////////////////
class Button {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.lastClicked = millis();
	}

	wasClicked() {
		return (mouseX > (this.x-0.5*this.w)) && (mouseX < (this.x+0.5*this.w))
				&& (mouseY > (this.y-0.5*this.h)) && (mouseY < (this.y+0.5*this.h));
	}

	process() {
		if (this.wasClicked()) {
			if ((millis() - this.lastClicked) > 500) {
				print("CLICKED! mouseX: " + mouseX + ", mouseY: " + mouseY);
				this.lastClicked = millis();
				this.action();
			}
		}
	}

	display() {
		return;
	}

	action() {
		return;
	}
}

///////////////////////////////////////////////
//
// Class: SoundButton
// 
///////////////////////////////////////////////
class SoundButton extends Button {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.on = false;
	}

	display() {
		if (this.on) {
			fill(255);
			stroke(255);
		} else {
			fill(150);
			stroke(150);
		}

		triangle(this.x-0.2*this.w, this.y-0.3*this.h, this.x-0.2*this.w, this.y+0.3*this.h, this.x+0.3*this.w, this.y);
		strokeWeight(3);
		if (!this.on) {
			push();
			translate(this.x, this.y);
			rotate(-PI/4);
			line(-0.5*this.w, 0, 0.5*this.w, 0);
			pop();
		}
		noFill();
		ellipse(this.x, this.y, this.w, this.h);
		strokeWeight(1);
		noStroke();
	}

	action() {
		this.on = !this.on;
		if (song.isPlaying()) {
			song.pause(); // .play() will resume from .pause() position
		} else {
    		song.play();
  		}
	}
}


///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

// LINKS
let linkBotsAndClots;
let linkEmergence;
let linkNanobotrace;
let linkRolling;
let linkSmoothRolling;

// BUTTONS
let soundButton;

let font;
let fontsize = 15;
let logo;
let song;
let firstClick = true;
let logo_w;
let logo_h;

function preload() {
	font = loadFont('SourceSansPro-Regular.otf');
	logo = loadImage('nanosphere.png');
	song = loadSound("nanorobotsTinsheds_mockup.mp3");
}

function setup() {
 	createCanvas(windowWidth, windowHeight);

	logo_w = 0.25*windowWidth;
	logo_h = (logo.height*logo_w)/logo.width;

	// Set text variables
	textFont(font);
 	textSize(fontsize);

 	song.loop();
 	song.pause();

 	// CREATE LINKS
 	let linksMargin_x = 20; //120
	linkBotsAndClots = createA(HOST + "/botsAndClots/", "1. Bots and Clots", "_blank");      
	linkBotsAndClots.position(linksMargin_x, 80);

	linkEmergence = createA(HOST + "/emergence/", "2. Emergence", "_blank");      
	linkEmergence.position(linksMargin_x, 140);

	linkNanobotrace = createA(HOST + "/nanobotrace/", "3. Nanobot Race", "_blank");
	linkNanobotrace.position(linksMargin_x, 200);

	linkRolling = createA(HOST + "/rolling/", "4. Leukocyte Rolling", "_blank");      
	linkRolling.position(linksMargin_x, 260);

	linkSmoothRolling = createA(HOST + "/smoothRolling/", "5. Smooth Rolling", "_blank");      
	linkSmoothRolling.position(linksMargin_x, 320);

	// CREATE BUTTONS
	let sb_w = 0.1*windowWidth;
	let sb_h = sb_w;
	let sb_x = windowWidth - 0.9*sb_w;
	let sb_y = 0.9*sb_h;
	soundButton = new SoundButton(sb_x, sb_y, sb_w, sb_h);
}

function draw() {
	background(sin(frameCount*0.01)*100 + 155, cos(frameCount*0.01)*100 + 155, sin(frameCount*0.01)*100 + 155);
	rectMode(CENTER);
	image(logo, 0.01*windowWidth, 0.01*windowHeight, logo_w, logo_h);
	soundButton.display();

	rectMode(CORNER);
	fill(50);
	let blurb = 'Flow of electron microscopy images of blood clots.';
	text(blurb, linkBotsAndClots.x, linkBotsAndClots.y+15, 0.95*windowWidth-linkBotsAndClots.x, 100);

	blurb = 'Patterns emerging from the eternal folding of DNA strands.';
	text(blurb, linkEmergence.x, linkEmergence.y+15, 0.95*windowWidth-linkEmergence.x, 100);

	blurb = 'Locomotion of DNA-based nanorobots, driven from interaction with environment.';
	text(blurb, linkNanobotrace.x, linkNanobotrace.y+15, 0.95*windowWidth-linkNanobotrace.x, 100);

	blurb = 'Sticky (yet progressive) roll of white cells through blood vessels.';
	text(blurb, linkRolling.x, linkRolling.y+15, 0.95*windowWidth-linkRolling.x, 100);

	blurb = 'Smoother (yet fictitious) version of white cells flow throuhg the bloodstream.';
	text(blurb, linkSmoothRolling.x, linkSmoothRolling.y+15, 0.95*windowWidth-linkSmoothRolling.x, 100);

	credits();
}

function credits() {
	stroke(100);
	line(0, 0.8*windowHeight, windowWidth, 0.80*windowHeight);
	noStroke();	

	fill(50);
	let blurb = 'Created by Luke Hespanhol, as part of artist residence for the NanoResonance Catalyst project, led by Diana Chester, Benjamin Carey and Liam Bray.\n\nAll animations by Luke Hespanhol.\nSoundscape by Ben Carey.';
	text(blurb, 0.01*windowWidth, 0.85*windowHeight, 0.95*windowWidth-0.01*windowWidth);
}

function mousePressed() {
	if (firstClick) {
		soundButton.action();
		firstClick = false;
	} else {
		soundButton.process();
	}
}