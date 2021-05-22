/////////////////////////////////
// Base class
/////////////////////////////////
let BASE_LEN = 2;

class Base {  
  constructor() {
    this.type = int(random(4)); // 0 = A, 1 = T, 2 = C, 3 = G
  }
  
  binds(b) {
    let sum = this.type + b.type;
    return (sum == 1) || (sum == 5);
  }
  
  getColour() {
    let c;
    switch (c) {
      case 0: // A
        c = color(255, 0, 0);
        break;
      case 1: // T
        c = color(0, 255, 0);
        break;
      case 2: // C
        c = color(0, 0, 255);
        break;
      default: //G
        c = color(255, 255, 0);
        break;
    }

    return c;
  }
}


/////////////////////////////////
// ScaffoldSegment class
/////////////////////////////////
class ScaffoldSegment {  
  constructor(ox, oy,  dx,  dy,  dz) {
    this.origin = createVector(ox, oy);
    this.direction = createVector(dx, dy, dz);
    this.bases = new Array();
  }
  
  fold(position) {
    var newSeg = new ScaffoldSegment(0, 0, 0, 0, 0);
    for (var i = position; i < this.bases.length; i++) {
      newSeg.bases.push(this.bases[i]);
    }
    for (var i = this.bases.length-1; i >= position; i--) {
      this.bases.splice(i, 1);
    }
    let blen = this.bases.length*BASE_LEN;
    newSeg.origin.x = this.origin.x + this.direction.x*blen;
    newSeg.origin.y = this.origin.y + this.direction.y*blen;
 
    // Determine new direction
    newSeg.direction.x = this.direction.x;
    newSeg.direction.y = this.direction.y;
    while ((newSeg.direction.x == this.direction.x) && (newSeg.direction.y == this.direction.y)) {
      newSeg.direction.x = this.getDirection();
      newSeg.direction.y = this.getDirection();
      if ((newSeg.direction.x == 0) && (newSeg.direction.y == 0)) {
        while (newSeg.direction.y == 0) {
          newSeg.direction.y = this.getDirection();
        }
      }
    }
    newSeg.direction.z = 0; 
    
    return newSeg;
  }
  
  getDirection() {
    let xFoldType = int(random(100));
    if (xFoldType > 66) {
      return 1;
    } else if (xFoldType > 33) {
       return -1;
    }
    return 0;
  }
  
  propagate(orig, blen, dir) {
    this.origin.x = orig.x + dir.x*blen;
    this.origin.y = orig.y + dir.y*blen;
    
    if (this.direction.x == 0) {
      this.direction.x = -1*this.direction.x*dir.x;
      this.direction.y = this.direction.y*dir.x; 
    }
  }
  
  display() {
    noStroke();
    for (var i = 0; i < this.bases.length; i++) {
      let b = this.bases[i];
      fill(b.getColour(), 20);
      let bx = int(this.origin.x + i*this.direction.x*BASE_LEN);
      let by = int(this.origin.y + i*this.direction.y*BASE_LEN);
      ellipse(bx, by, BASE_LEN, BASE_LEN);
    }
    noFill();
  }
  
}


/////////////////////////////////
// Scaffold class
/////////////////////////////////
let TOTAL_BASES_PER_SCAFFOLD = 500;

class Scaffold {
  constructor() {
  	this.segments = new Array();
    this.reset();
  }
  
  reset() {
    this.segments = new Array();
    let ox = int(random(-0.5*windowWidth, 0.5*windowWidth));
    let oy = int(random(-0.5*windowHeight, 0.5*windowHeight));
    let dx = 1;
    let dy = 0;
    let dz = 0;
    let firstSegment = new ScaffoldSegment(ox, oy, dx, dy, dz);
    this.segments.push(firstSegment);
    
    for (var i = 0; i < TOTAL_BASES_PER_SCAFFOLD; i++) {
      let b = new Base();
      firstSegment.bases.push(b);
    }
  }
  
  fold(segmentIndex, pos) {
    let newSeg = this.segments[segmentIndex].fold(pos);
    this.segments[segmentIndex+1] = newSeg;
    for (var i = segmentIndex+1; i < this.segments.length-2; i++) {
      let s = this.segments[i];
      this.segments[i+1].propagate(s.origin, s.bases.length*BASE_LEN, s.direction);
    }
  }
  
  display() {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].display();
    }
  }
  
}



/////////////////////////////////
// MAIN SECTION
/////////////////////////////////


//let NUM_SCAFFOLDS = 100;
let NUM_SCAFFOLDS = 50;

let scaffolds;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();

  scaffolds = new Array(NUM_SCAFFOLDS);
  for (var i = 0; i < NUM_SCAFFOLDS; i++) {
    let s = new Scaffold();
    scaffolds[i] = s;
  }
  
  background(0, 0, 20);
}

function draw() {
  pointLight(sin(frameCount*0.01)*255, cos(frameCount*0.001)*100, 10+sin(frameCount*0.02)*255, 0, height/2, 500);
  pointLight(sin(frameCount*0.02)*255, cos(frameCount*0.001)*100, sin(frameCount*0.02)*255, width, height/2, cos(frameCount*0.01)*500);
  pointLight(sin(frameCount*0.003)*255, cos(frameCount*0.001)*100, sin(frameCount*0.03)*255, width/2, height/2, sin(frameCount*0.015)*500);
  pointLight(cos(frameCount*0.02)*255, sin(frameCount*0.01)*100, cos(frameCount*0.001)*255, width/2, height/2, -500);
  specularMaterial(cos(frameCount*0.01)*255, sin(frameCount*0.003)*100, sin(frameCount*0.01)*255, 10);
  shininess(1);
  
  for (var i = 0; i < NUM_SCAFFOLDS; i++) {
    scaffolds[i].display();
  }
  
  // Folding simulation
  for (var i = 0; i < NUM_SCAFFOLDS; i++) {    
  	let scaff = scaffolds[i];
    if (random(100) > 80) {
      let index = int(random(scaff.segments.length));
      let pos = int(random(scaff.segments[index].bases.length));
      
      scaff.fold(index, pos);
    }
    
    if (scaff.segments.length > 5) {
      scaff.reset();
    }
  }
  
  // Overlay veil
  // fill(cos(frameCount*0.01)*255, sin(frameCount*0.003)*100, sin(frameCount*0.01)*255, 10);
  fill(255, 1);
  rectMode(CENTER);
  rect(0, 0, windowWidth, windowHeight);
}