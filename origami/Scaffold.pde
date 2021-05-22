int TOTAL_BASES_PER_SCAFFOLD = 500;

class Scaffold {
  ArrayList<ScaffoldSegment> segments;
  
  Scaffold() {
    reset();
  }
  
  void reset() {
    segments = new ArrayList<ScaffoldSegment>();
    int ox = int(random(0, width));
    int oy = int(random(0, height));
    int dx = 1;
    int dy = 0;
    int dz = 0;
    ScaffoldSegment firstSegment = new ScaffoldSegment(ox, oy, dx, dy, dz);
    segments.add(firstSegment);
    
    for (int i = 0; i < TOTAL_BASES_PER_SCAFFOLD; i++) {
      Base b = new Base();
      firstSegment.bases.add(b);
    }
  }
  
  void fold(int segmentIndex, int pos) {
    ScaffoldSegment newSeg = segments.get(segmentIndex).fold(pos);
    segments.add(segmentIndex+1, newSeg);
    for (int i = segmentIndex+1; i < segments.size()-2; i++) {
      ScaffoldSegment s = segments.get(i);
      segments.get(i+1).propagate(s.origin, s.bases.size()*BASE_LEN, s.direction);
    }
  }
  
  void display() {
    for(ScaffoldSegment seg : segments) {
      seg.display();
    }
  }
  
}
