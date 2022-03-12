/*
data-utils.js
A file for all enums and extremely basic shared classes that many files can
import across the app.
*/

// Position class
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// export allows us to pass these to other files when it is imported
export { Position };
