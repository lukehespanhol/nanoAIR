class ScaffoldSegment {
  PVector origin;
  PVector direction;
  ArrayList<Base> bases;
  
  ScaffoldSegment() {
    this(0, 0, 0, 0, 0);
  }
  
  ScaffoldSegment(int ox,int oy, int dx, int dy, int dz) {
    origin = new PVector(ox, oy);
    direction = new PVector(dx, dy, dz);
    bases = new ArrayList<Base>();
  }
  
  ScaffoldSegment fold(int position) {
    ScaffoldSegment newSeg = new ScaffoldSegment();
    for (int i = position; i < bases.size(); i++) {
      newSeg.bases.add(bases.get(i));
    }
    for (int i = bases.size()-1; i >= position; i--) {
      bases.remove(i);
    }
    int blen = bases.size()*BASE_LEN;
    newSeg.origin.x = origin.x + direction.x*blen;
    newSeg.origin.y = origin.y + direction.y*blen;
 
    // Determine new direction
    newSeg.direction.x = direction.x;
    newSeg.direction.y = direction.y;
    while ((newSeg.direction.x == direction.x) && (newSeg.direction.y == direction.y)) {
      newSeg.direction.x = getDirection();
      newSeg.direction.y = getDirection();
      if ((newSeg.direction.x == 0) && (newSeg.direction.y == 0)) {
        while (newSeg.direction.y == 0) {
          newSeg.direction.y = getDirection();
        }
      }
    }
    newSeg.direction.z = 0; 
    
    return newSeg;
  }
  
  int getDirection() {
    int xFoldType = int(random(100));
    if (xFoldType > 66) {
      return 1;
    } else if (xFoldType > 33) {
       return -1;
    }
    return 0;
  }
  
  void propagate(PVector orig, int blen, PVector dir) {
    origin.x = orig.x + dir.x*blen;
    origin.y = orig.y + dir.y*blen;
    
    if (direction.x == 0) {
      direction.x = -1*direction.x*dir.x;
      direction.y = direction.y*dir.x; 
    }
  }
  
  void display() {
    noStroke();
    for (int i = 0; i < bases.size(); i++) {
      Base b = bases.get(i);
      fill(b.getColour(), 20);
      int bx = int(origin.x + i*direction.x*BASE_LEN);
      int by = int(origin.y + i*direction.y*BASE_LEN);
      ellipse(bx, by, BASE_LEN, BASE_LEN);
    }
    noFill();
  }
  
}
