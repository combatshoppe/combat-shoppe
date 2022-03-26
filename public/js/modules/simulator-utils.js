/**
 * simulator-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

 /** Create a new AngularJS module */
 var SimulatorUtils = angular.module('SimulatorUtils', [])

/**
 * Class representing a Tile
 */
class Tile {
	/**
	 * Member variables
	 * @member {int} difficulty - Movement cost through this tile is difficulty * 5
	 * @member {TileObject[]} objects - List of objects in this tile
	 * @member {int} _height - Maximum object height (used for cover calculations)
	 */
	difficulty = 1;
	objects = [];
	_height = 0;

	/**
	 * Get a position in the grid
	 * @param {number} difficulty - Movement cost through this tile is difficulty * 5
	 * @constructor
	 */
	constructor(difficulty) {
		this.difficulty = difficulty;
	}

	/**
	 * Get a position in the grid
	 * @returns {number} - Maximum object height (used for cover calculations)
	 */
	getHeight() {
		return _height;
	}

	/**
	 * Get a position in the grid
	 * @param {TileObject} object - What position of the grid to get
	 * @returns {Tile} - Retuns a tile or undefined if nothing it at the position
	 */
	add(object) {
		this.object.push(object);
	}

	/**
	 * Get a position in the grid
	 * @param {TileObject} object - What position of the grid to get
	 * @returns {Boolena} - True if the object is deleted
	 */
	remove(object) {
		let index = this.objects.indexOf(object);
		if (index === -1) { return false; }
		this.objects.splice(index, 1);
		return true;
	}

	/**
	 * Sets the maximum height of the Tile
	 */
	_setMaxHeight() {
		objects.forEach((object) => { this._height = max(object.height, this._height); });
	}
}

/**
 * Class representing a grid.
 */
class Grid {
	/**
	 * Member variables
	 * @member {int} size - The width/height of the grid in px
	 * @member {int} _grid - Map of Positions mapped to Tiles
	 */
	size = 100;
	_grid = new Map();

	/**
	 * Get a position in the grid
	 * @param {Position} position - What position of the grid to get
	 * @returns {Tile} - Retuns a tile or undefined if nothing it at the position
	 */
	get(position) {
		return _grid.get(position);
	}

	/**
	 * Get a position in the grid
	 * @param {Position} position - What position of the grid to use
	 * @param {TileObject} object - Object to add
	 */
	add(position, object) {
		// Make sure there is a tile at the position
		if (!_grid.has(position)) { _grid.add(new Tile()); }
		// Get the tile
		let tile = _grid.get(position);
		// Add the object to the Tile
		tile.add(object);
	}

	/**
	 * Get a position in the grid
	 * @param {Position} position - What position of the grid to use
	 * @param {TileObject} object - Object to remove, if not specified removes all objects
	 * @return {Boolean} - True if the object was removed sucessflly
	 */
	remove(position, object = null) {
		// Stop if there is no tile
		if (!_grid.has(position)) { return false; }
		// Get the tile
		let tile = _grid.get(position);
		// Remove the tile if object is null
		if (object === null) {
			_grid.delete(position);
			return true;
		}
		// Otherwise, remove the object from the Tile
		return _grid.get(poistion).remove(object);
	}

	/**
	 * Get a position in the grid
	 * @param {TileObject} object - What position of the grid to use
	 * @param {Position} to - What position of the grid to use
	 * @param {Position} from - What position of the grid to use
	 * @return {Boolean} - True if the object was moved sucessflly
	 */
	move(object, to, from) {
		// Remove the object
		if (!this.remove(from, object)) { return false; }
		// Add the object
		this.add(to, object);
		return true;
	}
}


/**
 * define the token class
 */
class Token extends TileObject {
	/**
	 * Member variables
	 * @member {int} hp - The width/height of the grid in px
	 * @member {int} team - Map of Positions mapped to Tiles
	 * @member {Behavior} behavior - The width/height of the grid in px
	 * @member {CreatureSchema} _grid - Map of Positions mapped to Tiles
	 * @member {Boolean} size - The width/height of the grid in px
	 * @member {int} actions - Map of Positions mapped to Tiles
	 * @member {int} conditions - Map of Positions mapped to Tiles
	 * @member {Map<StatType:Dice>} stats - Map of Positions mapped to Tiles
	 */
	hp = 0;
	team = 0;
	behavior = null;
	schema = null;
	hasCastSpell = false;
	actions = [];
	conditions = [];
	stats = new Map();


	/**
	 * Function that defines if the token has health
	 * @returns {Boolean} - Returns true
	 */
	hasHP() {
		return true;
	}

	/**
	 * Function that opens up the TokenSettingDisplay
	 */
	onRightClick() {

		// To do : implement this function
	}

	/**
	 * Set the team of the Token
	 * @param {int} team - What to set the team as
	 */
	setTeam(team) {
		this.team = team;
	}

	/**
	 * Set the stats of the Token
	 * @param {CreatureSchema} schema - what the data associated with the Token is
	 */
	setSchema(schema) {
		this.hp = stats.hp;
		this.schema = schema;

		schema.actions.forEach((actionId) => {
			let actionSchema = globalData.find(actionId);
			this.actions.push(new Action(actionSchema));
		});

		if (schema.defaultBehavior === BehaviorType.Random) {
			this.behavior = new RandomBehavior(this.actions);
		}
	}

	/**
	 * Rolls initative for the Token
	 * @param {StatType} type - What to roll
	 * @returns {int} - the resulting roll or 0 if not defined
	 */
	roll(type) {
		let dice = this.stats.get(type);
		if (dice === undefined) return 0;
		return dice.roll();
	}
}
