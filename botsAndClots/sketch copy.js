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
// Class: Tile
// 
///////////////////////////////////////////////
class Tile {
	constructor(id, x, y, z) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.imgIndex = 10;
	}

	reset() {

	}

	move() {

	}

	display() {
		let imgId = round(((frameCount*0.03)+15*this.id+NUM_IMAGES))%NUM_IMAGES;
		let img = clotImages[imgId];
		//let img = clotImages[this.imgIndex];
		tint(0, 0, 255, abs(sin(frameCount*0.02 + 15*this.id))*255);
		image(img, this.x, this.y, TILE_WH, TILE_WH);
	}
}


///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

let NUM_IMAGES = 33;
let TILE_WH = 45;

let clotImages = [NUM_IMAGES];
let tiles = [];
let numTilesX;
let numTilesy;

function preload() {
	for (var i = 0; i < NUM_IMAGES; i++) {
		let img = loadImage("/images/screen-00" + i + ".png");
		clotImages[i] = img;
	}
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  numTilesX = windowWidth/TILE_WH;
  numTilesY = windowHeight/TILE_WH;

  tiles = [numTilesX*numTilesY];
  for (var i = 0; i < numTilesX; i++) {
  	for (var j = 0; j < numTilesY; j++) {
  		let id = j*numTilesY + i;
  		let x = -0.5*windowWidth + (i+0.5)*TILE_WH;
  		let y = -0.5*windowHeight + (j+0.5)*TILE_WH;
  		let z = 0;
  		tiles[id] = new Tile(id, x, y, z);
  	}
  }

  imageMode(CENTER);
  rectMode(CENTER);
}

function draw() {
	//background(200, 100, 150);
	background(255, 0, 0);

	for (var i = 0; i < numTilesX; i++) {
		for (var j = 0; j < numTilesY; j++) {
			tiles[j*numTilesY + i].display();
		}
	}

  // let img = clotImages[frameCount%NUM_IMAGES];
  // image(img, 0, 0, 500, 500);
}