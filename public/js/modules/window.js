/**
 * window.js
 * A file for the Display and Placement implimentations of the Window bridge
 */

/** Create a new AngularJS module */
var WindowModule = angular.module('WindowModule', ['SimulatorUtils', 'WindowUtilsModule', 'UiModule'])

/**
 * Subclass of the Placement that only holds one active window.
 */
class GridDisplay extends Display {
    /**
     * Member variables
     * @member {Grid} grid - the number of grid rows
     * @member {Position} gridOffset - the offset of the grid
     * @member {GridLine[]} hLines - Array of grid lines
     * @member {GridLine[]} vLines - Array of grid lines
     * @member {TileObject[]} objects - Array of all TileObjects
     * @member {TileObject} selectedObject - Array of all TileObjects
     * @member {Display} settingDisplay - Connected token setting display
     */
    grid = new Grid();
    gridOffset = new Position(0, 0);
    hLines = [];
    vLines = [];
    objects = [];
    selectedObject = null;
    settingDisplay = null;

    /**
     * Adds a token to the grid at the nearest unoccupied spot to row, col with a given schema
     * @param {int} row - The position of the click
     * @param {int} column - The position of the click
     * @returns {Token} - the token created
     */
    addToken(row, column, schema) {
        // Find the nearest spot to col, row that is empty
        let done = false;
        let a = 0;
        while (!done) {
            for (let x = a; x >= -a; --x) {
                for (let y = a; y >= -a; --y) {
                    let goodSpot = true;
                    for (let xx = Math.ceil(schema.size - 1); xx >= 0; --xx) {
                        for (let yy = Math.ceil(schema.size - 1); yy >= 0; --yy) {
                            if (this.grid.get(new Position(x + xx, y + yy)) !== undefined) {
                                goodSpot = false;
                                break;
                            }
                            if (goodSpot === false) { break; }
                        }
                    }
                    if (goodSpot) {
                        row += x;
                        column += y;
                        done = true;
                        break;
                    }
                }
                if (done) break;
            }
            a += 1;
        }
        // Get the offset of the parent plust row/col
        let offset = new Position(row * this.grid.size, column * this.grid.size);
        offset.x += this.offset.x - this.gridOffset.x
        offset.y += this.offset.y - this.gridOffset.y
            // Make the token
        let token = new Token(offset, schema.size * this.grid.size, schema.size * this.grid.size, this.parent);
        token.setSchema(schema);
        token.setPosition(row, column);
        this.grid.add(new Position(row, column), token);
        this.objects.push(token);
        return token;
    }

    async moveToken(token, to, from, time) {
        await token.slide(this.grid.size * (to.x - from.x), this.grid.size * (to.y - from.y), time);
        await this.grid.move(token, to, from)
    }

    /**
     * Clear the grid.
     */
    _deleteGrid() {
        // Error check, then get global offset
        if (this.parent == null) return;
        // Remove the objects
        this.objects.forEach((object, i) => {
            object.delete();
        });
        // Clear the grid
        this.vLines.forEach((line) => { line.delete(); });
        this.vLines = [];
        this.hLines.forEach((line) => { line.delete(); });
        this.hLines = [];
    }

    /**
     * Clear the grid and redraw it.
     */
    _redrawGrid() {
        // Delete the current grid
        this._deleteGrid();
        // Make the vertical grid lines
        let x = -(this.gridOffset.x % this.grid.size)
        for (x -= this.grid.size; x < this.width + this.grid.size; x += this.grid.size) {
            let offset = new Position(x + this.offset.x, this.offset.y);
            this.vLines.push(new GridLine(offset, 2, this.height, this.parent));
        }
        // Make the horizontal grid lines
        let y = -(this.gridOffset.y % this.grid.size)
        for (y -= this.grid.size; y < this.height + this.grid.size; y += this.grid.size) {
            let offset = new Position(this.offset.x, y + this.offset.y);
            this.hLines.push(new GridLine(offset, this.width, 2, this.parent));
        }
        // Make the objects
        this.objects.forEach((object, i) => {
            let offset = new Position(object.row * this.grid.size, object.column * this.grid.size);
            offset.x += -this.gridOffset.x + this.offset.x;
            offset.y += -this.gridOffset.y + this.offset.y;
            object.make(offset, object.data.size * this.grid.size, object.data.size * this.grid.size, this.parent);
        });
        // Fix some visual bugs
        this.onDrag(-1, -1);
        this.onDrag(1, 1);
    }

    /**
     * Remove a token from the grid
     */
    removeToken(token) {
        // Remove from inistaive
        globalSideWindow.displays.forEach((display) => {
                if (display.token === token) {
                    globalSideWindow.removeDisplay(display);
                }
            })
            // Remove from storage
        this.grid.remove(new Position(token.row, token.column), token);
        let index = this.objects.indexOf(this.selectedObject);
        if (index > -1) { this.objects.splice(index, 1); }
        token.delete();
    }

    /**
     * Virtual function that visually creates and activates a display.
     */
    _activate() {
        this._redrawGrid();
    }

    /**
     * Function that removes a display from the visual window.
     */
    _deactivate() {
        this._deleteGrid();
    }

    /**
     * Function that defines what to do when the Display is clicked and no
     * clickable objects are able to be clicked. Unless overriden, nothing it done.
     * @param {Position} position - The position of the click
     */
    onLeftClick(position) {
        let clampPosition = new Position(0, 0);
        clampPosition.x = Math.floor((position.x + this.gridOffset.x) / this.grid.size);
        clampPosition.y = Math.floor((position.y + this.gridOffset.y) / this.grid.size);
        let tile = this.grid.get(clampPosition);
        // Click on empyt space
        if (tile === undefined || tile.objects.length === 0) {
            // If there was an object selcted
            if (this.selectedObject != null) {
                // If the object is not a token, return
                if (this.selectedObject.constructor.name !== "Token") { return; }
                // Hide the details of the object
                globalSideWindow.removeDisplay(this.settingDisplay);
                // Show the initiative
                globalSideWindow.displays.forEach((display) => {
                        globalSideWindow.placement.activateDisplay(globalSideWindow.dom, display, globalSideWindow.displays);
                    })
                    // Reset
                this.selectedObject.dom.className = "";
                this.selectedObject = null;
                this.settingDisplay = null;
            }
            return;
        }
        // Click on filled space
        if (this.selectedObject != null) {
            this.selectedObject.dom.className = "";
        }
        this.selectedObject = tile.objects[0];
        this.selectedObject.dom.className = "token-selected";

        // Remove the current setting display if there is one
        if (this.settingDisplay !== null) {
            globalSideWindow.removeDisplay(this.settingDisplay);
            this.settingDisplay = null;
        }
        // If the object is not a token, return
        if (this.selectedObject.constructor.name !== "Token") { return; }
        // Hide the initiative
        globalSideWindow.displays.forEach((display) => {
            globalSideWindow.placement.deactivateDisplay(display, globalSideWindow.displays);
        });
        // Show the details of this object
        this.settingDisplay = new TokenSettingDisplay().linkToken(this.selectedObject);
        globalSideWindow.addDisplay(this.settingDisplay);
    }

    /**
     * Function that defines what to do when the Display is scrolled and no
     * clickable objects are able to be scrolled. Unless overriden, nothing it done.
     * @param {float} direction - The distance scrolled
     */
    onScroll(direction) {
        // Zoom
        this.grid.size += direction * -5;
        // Keep a max and minimum zoom
        this.grid.size = Math.min(this.grid.size, 250);
        this.grid.size = Math.max(this.grid.size, 50);
        // Remake the grid
        this._redrawGrid();
    }

    /**
     * Function that defines what to do when the Display is dragged on and no
     * clickable objects are able to be dragged. Unless overriden, nothing it done.
     * @param {float} dx - The movement in the x direction
     * @param {float} dy - The movement in the y direction
     */
    onDrag(dx, dy) {
        let isOutOfBounds = 0,
            x = 0,
            y = 0;
        // Adjust the offset
        this.gridOffset.x -= dx;
        this.gridOffset.y -= dy;
        // Loop thru all of the TileObjects
        this.objects.forEach((object, i) => {
            // Move the line and see if it is out of bounds
            isOutOfBounds = object.move(dx, dy);
            // If the object is visible and just moved out of bounds, hide it
            if (isOutOfBounds) {
                object.dom.style.visibility = 'hidden';
                // Reset the flag variable
                isOutOfBounds = 0;
            }
            // Line is not out of bounds, make sure it can be seen
            else object.dom.style.visibility = 'visible';
        });
        // Loop through all horizontal lines
        this.hLines.forEach((line, i) => {
            // Move the line and see if it is out of bounds
            isOutOfBounds = line.move(0, dy);
            // If the line is visible and just moved out of bounds, move it to the other side
            // OR if the line is moving up and out of bounds up, move it to the other side
            // OR if the line is moving down and out of bounds down, move it to the other side
            if (isOutOfBounds) {
                if (line.dom.style.visibility === 'visible' ||
                    (dy < 0 && isOutOfBounds === 1) ||
                    (dy > 0 && isOutOfBounds === 3)) {
                    // Move the line to the other side for the grid
                    line.move(0, -this.grid.size * this.hLines.length * Math.abs(dy) / dy);
                    // Hide the line until it is in bounds again
                    line.dom.style.visibility = 'hidden';
                }
                // Reset the flag variable
                isOutOfBounds = 0;
            }
            // Line is not out of bounds, make sure it can be seen
            else line.dom.style.visibility = 'visible';
        });
        // Loop through all vertical lines
        this.vLines.forEach((line, i) => {
            // Move the line and see if it is out of bounds
            isOutOfBounds = line.move(dx, 0);
            // Line is out of bounds
            if (isOutOfBounds) {
                // If the line is visible and just moved out of bounds, move it to the other side
                // OR if the line is moving left and out of bounds left, move it to the other side
                // OR if the line is moving right and out of bounds right, move it to the other side
                if (line.dom.style.visibility === 'visible' ||
                    (dx < 0 && isOutOfBounds === 4) ||
                    (dx > 0 && isOutOfBounds === 2)) {
                    // Move the line to the other side for the grid
                    line.move(-this.grid.size * this.vLines.length * Math.abs(dx) / dx, 0);
                    // Hide the line until it is in bounds again
                    line.dom.style.visibility = 'hidden';
                }
                // Reset the flag variable
                isOutOfBounds = 0;
            }
            // Line is not out of bounds, make sure it can be seen
            else line.dom.style.visibility = 'visible';
        });
    }

    /**
     * Defines what happens when a key is pressed.
     * @param {String} key - The key pressed
     */
    onKeyPress(key) {
        // Make sure there is a selected token
        if (this.selectedObject === null) return;
        if (key === 'Delete' || key === 'Backspace') {
            this.removeToken(this.selectedObject);
            // Hide the details of the token
            globalSideWindow.removeDisplay(this.settingDisplay);
            // Show the initiative
            globalSideWindow.displays.forEach((display) => {
                globalSideWindow.placement.activateDisplay(globalSideWindow.dom, display, globalSideWindow.displays);
            })
            this.settingDisplay = null;
            this.selectedObject = null;
            return;
        }
        // Move the token
        let from = new Position(this.selectedObject.row, this.selectedObject.column);
        let to = new Position(this.selectedObject.row, this.selectedObject.column);
        if (key === 'w') {
            to.y -= 1;
            this.grid.move(this.selectedObject, to, from);
            this._redrawGrid();
        }
        if (key === 's') {
            to.y += 1;
            this.grid.move(this.selectedObject, to, from);
            this._redrawGrid();
        }
        if (key === 'a') {
            to.x -= 1;
            this.grid.move(this.selectedObject, to, from);
            this._redrawGrid();
        }
        if (key === 'd') {
            to.x += 1;
            this.grid.move(this.selectedObject, to, from);
            this._redrawGrid();
        }
        this.selectedObject.dom.className = "token-selected";
    }
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class InitiativeDisplay extends Display {
    /**
     * Member variables
     * @member {Position} offset - the offset of the grid
     * @member {Image} image - the offset of the grid
     */
    _rank = 0;
    token = null;
    image = null;
    text = null;

    /**
     * Gets the initiative of the displat
     */
    getInitiative() {
        return this._rank;
    }

    /**
     * Initializes a token into the display and rolls its initiative
     * @member {Token} token - the token to link
     * @returns {InitiativeDisplay}
     */
    linkToken(token) {
        this._rank = token.roll(StatType.Initiative);
        this.token = token;
        return this;
    }

    /**
     * Virtual function that visually creates and activates a display.
     */
    _activate() {
        this.image = new Image(this.offset, this.height, this.height, this.parent);
        this.image.setImage(this.token.data.src);
        this.text = new Text(this.offset, this.width, this.height, this.parent);
        this.text.setText(this.getInitiative().toString());
    }

    /**
     * Function that removes a display from the visual window.
     */
    _deactivate() {
        if (this.image !== null) this.image.delete();
        if (this.text !== null) this.text.delete();
        this.image = null;
        this.text = null;
    }

    /**
     * Function that defines what to do when the Display is clicked and no
     * clickable objects are able to be clicked. Unless overriden, nothing it done.
     * @param {Position} position - The position of the click
     */
    onLeftClick(position) {
        console.log("CLICK")
    }

    /**
     * Function that defines what to do when the Display is scrolled and no
     * clickable objects are able to be scrolled. Unless overriden, nothing it done.
     * @param {float} direction - The distance scrolled
     */
    onScroll(direction) {

    }

    /**
     * Function that defines what to do when the Display is dragged on and no
     * clickable objects are able to be dragged. Unless overriden, nothing it done.
     * @param {float} dx - The movement in the x direction
     * @param {float} dy - The movement in the y direction
     */
    onDrag(dx, dy) {

    }
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class AddTokenDisplay extends Display {
    /**
     * Member variables
     * @member {Position} offset - the offset of the grid
     * @member {Image} image - the offset of the grid
     */
    _rank = -4503599627370495;
    _src = 'https://cdn.onlinewebfonts.com/svg/img_45824.png';
    image = null;

    /**
     * Virtual function that visually creates and activates a display.
     */
    _activate() {
        this.image = new Image(this.offset, this.height, this.height, this.parent);
        this.image.setImage(this._src);
    }

    /**
     * Function that removes a display from the visual window.
     */
    _deactivate() {
        if (this.image != null) { this.image.delete(); }
        this.image = null;
    }

    /**
     * Function that defines what to do when the Display is clicked and no
     * clickable objects are able to be clicked. Unless overriden, nothing it done.
     * @param {Position} position - The position of the click
     */
    onLeftClick(position) {
        let keys = Array.from(localData.creatures.keys()); // change ourGlobalSchemaMap
        let schema = localData.creatures.get(keys[Math.floor(Math.random() * keys.length)]);
        let token = globalGrid.addToken(0, 0, schema);
        globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
    }

    /**
     * Defines what happens when a key is pressed.
     * @param {String} key - The key pressed
     */
    onKeyPress(key) {
        // Add token
        if (key === ' ') {
            let keys = Array.from(localData.creatures.keys()); // change ourGlobalSchemaMap
            let schema = localData.creatures.get(keys[Math.floor(Math.random() * keys.length)]);
            let token = globalGrid.addToken(0, 0, schema);
            globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
        }
    }
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class TokenSettingDisplay extends Display {
    /**
     * Member variables
     * @member {Position} _rank - Order in a list to use
     * @member {Image} image - The image itself
     * @member {Image} src - The image src to use
     * @member {Text[]} text - Array of text
     */
    _rank = 0;
    _src = 'https://cdn.onlinewebfonts.com/svg/img_45824.png';
    image = null;
    text = [];
    token = null;

    /**
     * Virtual function that visually creates and activates a display.
     */
    _activate() {
        // Get an offset
        let offset = new Position(this.offset.x, this.offset.y);
        offset.x += 10;
        offset.y += 10
            // Add the image
        this.image = new Image(offset, this.height, this.height, this.parent);
        this.image.setImage(this._src);
        offset.y += this.height + 2;
        // Add the text
        for (let i = 0; i < 4; i++) {
            this.text.push(new Text(offset, this.width, this.height, this.parent));
            offset.y += parseInt(window.getComputedStyle(this.text[i].dom).fontSize) + 2;
        }
        this.text[0].setText(this.token.data.name);
        this.text[1].setText('HP: ' + this.token.hp.toString() + '/' + this.token.data.hp.toString());
        this.text[2].setText('Speed: ' + (this.token.data.speed * 5).toString() + ' ft.');
        this.text[3].setText('AC: ' + this.token.data.ac);
    }

    /**
     * Function that removes a display from the visual window.
     */
    _deactivate() {
        this.image.delete();
        this.image = null;
        this.text.forEach((paragraph) => {
            paragraph.delete();
        })
        this.text = [];
    }

    /**
     * Initializes a token into the display and rolls its initiative
     * @member {Token} token - the token to link
     * @returns {InitiativeDisplay}
     */
    linkToken(token) {
        this._src = token.data.src;
        this.token = token;
        return this;
    }
}

/**
 * Subclass of the Placement that only holds one active window.
 */
class SinglePlacement extends Placement {
    /**
     * Function that activates a display in the window.
     * @param {Display} parent - The DOM parent the display is in
     * @param {Display} display - The display being added
     * @param {Array[Display]} allDisplays - All other existing displays
     */
    activateDisplay(parent, display, allDisplays) {
        // Remove all currently active displays
        allDisplays.forEach((display, i) => {
            if (display.active) display.deactivate();
        });
        // Activate the new display
        let rect = parent.getBoundingClientRect();
        display.activate(new Position(rect.x, rect.y), parent, this.displayWidth, this.displayHeight);
    }

    /**
     * Function that deactivates a display in the window.
     * @param {Display} display - The display being removed
     * @param {Array[Display]} allDisplays - All other existing displays
     */
    deactivateDisplay(display, allDisplays) {
        // Remove the display
        display.deactivate();
        // Activate a display if we have another to activate
        if (allDisplays.length !== 0) {
            allDisplays[allDisplays.length - 1].activate(new Position(0, 0), this.displayWidth, this.displayHeight);
        }
    }
}

/**
 * Subclass of the Placement that only holds a sorted list of placements.
 */
class SortedListPlacement extends Placement {
    /**
     * Function that activates a display in the window.
     * @param {Display} parent - The DOM parent the display is in
     * @param {Display} display - The display being added
     * @param {Array[Display]} allDisplays - All other existing displays
     */
    activateDisplay(parent, display, allDisplays) {
        // Preload the display at the default position
        let rect = parent.getBoundingClientRect();
        display.activate(new Position(rect.x, rect.y), parent, this.width, this.displayHeight);
        // Sort the current display list
        allDisplays.sort(function(a, b) { return a._rank < b._rank ? 1 : -1; });
        // Update the visual
        this._update(allDisplays);
    }

    /**
     * Function that deactivates a display in the window.
     * @param {Display} display - The display being removed
     * @param {Array[Display]} allDisplays - All other existing displays
     */
    deactivateDisplay(display, allDisplays) {
        // Remove the display
        display.deactivate();
        // Update the visual
        this._update(allDisplays);
    }

    /**
     * Defines what happens when a key is pressed.
     * @param {Display[]} allDisplays - All current displays
     */
    _update(allDisplays) {
        // Update the position of every display in list
        let y = 0;
        allDisplays.forEach((_display, i) => {
            // If the display is not active, skip it
            if (!_display.active) return;
            // If the display is not in the calculated position, deactivate it and reactivate it
            let parent = _display.parent;
            let rect = parent.getBoundingClientRect();
            if (_display.offset.y !== rect.y + y) {
                _display.deactivate();
                _display.activate(new Position(rect.x, rect.y + y), parent, this.width, this.displayHeight);
            }
            // Increase the y position of the display
            y += _display.height;
        });
    }
}