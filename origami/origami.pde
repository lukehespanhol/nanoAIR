int NUM_SCAFFOLDS = 100;

ArrayList<Scaffold> scaffolds;

void setup() {
  //size(900, 600, P3D);
  fullScreen(P3D);
  noCursor();
  scaffolds = new ArrayList<Scaffold>();
  for (int i = 0; i < NUM_SCAFFOLDS; i++) {
    Scaffold s = new Scaffold();
    scaffolds.add(s);
  }
  
  background(0, 0, 20);
}

void draw() {
  pointLight(sin(frameCount*0.01)*255, cos(frameCount*0.001)*100, 10+sin(frameCount*0.02)*255, 0, height/2, 500);
  pointLight(sin(frameCount*0.02)*255, cos(frameCount*0.001)*100, sin(frameCount*0.02)*255, width, height/2, cos(frameCount*0.01)*500);
  pointLight(sin(frameCount*0.003)*255, cos(frameCount*0.001)*100, sin(frameCount*0.03)*255, width/2, height/2, sin(frameCount*0.015)*500);
  pointLight(cos(frameCount*0.02)*255, sin(frameCount*0.01)*100, cos(frameCount*0.001)*255, width/2, height/2, -500);
  specular(255, 255, 255);
  shininess(10);
  
  for (Scaffold s: scaffolds) {
    s.display();
  }
  
  // Folding simulation
  for (Scaffold scaff : scaffolds) {    
    if (random(100) > 80) {
      int index = int(random(scaff.segments.size()));
      int pos = int(random(scaff.segments.get(index).bases.size()));
      
      scaff.fold(index, pos);
    }
    
    if (scaff.segments.size() > 5) {
      scaff.reset();
    }
  }
  
  // Overlay veil
  fill(cos(frameCount*0.01)*255, sin(frameCount*0.003)*100, sin(frameCount*0.01)*255, 10);
  rect(0, 0, width, height);
  
//  rec();
}
