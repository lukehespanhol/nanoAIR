int BASE_LEN = 2;

class Base {
  int type; // 0 = A, 1 = T, 2 = C, 3 = G
  
  Base() {
    type = int(random(4));
  }
  
  boolean binds(Base b) {
    int sum = type + b.type;
    return (sum == 1) || (sum == 5);
  }
  
  color getColour() {
    color c;
    switch (type) {
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
