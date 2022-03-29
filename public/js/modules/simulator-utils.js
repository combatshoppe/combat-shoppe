/**
 * simulator-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

 /** Create a new AngularJS module */
 var SimulatorUtils = angular.module('SimulatorUtils', ['UiModule'])

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
		this.objects.push(object);
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
		// Convert the position to a basic object
		position = position.toString();
		// Get the poistion
		return this._grid.get(position);
	}

	/**
	 * Get a position in the grid
	 * @param {Position} position - What position of the grid to use
	 * @param {TileObject} object - Object to add
	 */
	add(position, object) {
		// Convert the position to a indexable string
		let pString = position.toString();
		// Make sure there is a tile at the position
		if (!this._grid.has(pString)) { this._grid.set(pString, new Tile()); }
		// Update the token position
		object.row = position.x;
		object.column = position.y;
		console.log(`==> ${object.row}, ${object.column}`)
		// Get the tile
		let tile = this._grid.get(pString);
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
		// Convert the position to a basic object
		position = position.toString();
		console.log(this._grid)
		console.log(position)
		// Stop if there is no tile
		if (!this._grid.has(position)) { return false; }
		// Get the tile
		let tile = this._grid.get(position);
		// Remove the tile if this is the last object
		if (tile.objects.length <= 1) {
			console.log("I am the best code ever")
			this._grid.delete(position);
			return true;
		}
		// Otherwise, remove the object from the Tile
		return this._grid.get(position).remove(object);
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
		console.log("I am the worst code ever")
		if (!this.remove(from, object)) { return false; }
		// Update the tile
		object.row = to.x;
		object.column = to.y;
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
	data = null;
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
	 * Function to attack and deal damage to the token
	 * @member {StatType} saveType -
	 * @member {int} saveDc -
	 * @member {Boolean} noDamageOnSucess -
	 * @member {DamageType} primaryDamageType -
	 * @member {int} primaryDamage -
	 * @member {DamageType} secondaryDamageType -
	 * @member {int} secondaryDamage -
	 * @returns {Boolean} - Returns true if damage was taken (not accounting for immunities)
	 */
	attackToSave(saveType, saveDc, saveOrSuck, primaryDamageType, primaryDamage,
	             secondaryDamageType = 0, secondaryDamage = 0) {
		let roll = this.roll(saveType);
		if (roll >= saveDc && noDamageOnSucess) return false;
		if (roll >= saveDc) {
			primaryDamage = Math.floor(primaryDamage / 2);
			secondaryDamage = Math.floor(secondaryDamage / 2);
		}
		this._dealDamage(primaryDamageType, primaryDamage);
		this._dealDamage(secondaryDamageType, secondaryDamage);
		return true;
	}

	/**
	 * Function to attack and deal damage to the token
	 * @member {int} toHit -
	 * @member {DamageType} primaryDamageType -
	 * @member {int} primaryDamage -
	 * @member {DamageType} secondaryDamageType -
	 * @member {int} secondaryDamage -
	 * @returns {Boolean} - Returns true if the target was hit
	 */
	attackToHit(toHit, primaryDamageType, primaryDamage, secondaryDamageType = null, secondaryDamage = 0) {
		if (this.data.ac > toHit) return false;
		this._dealDamage(primaryDamageType, primaryDamage);
		this._dealDamage(secondaryDamageType, secondaryDamage);
		return true;
	}

	/**
	 * Heals the token by a certain amount
	 * @member {int} amount -
	 */
	heal(amount) {
		this.hp = Math.min(this.data.hp, this.hp + amount);
	}

	/**
	 * Deals damage to the token
	 * @member {DamageType} type -
	 * @member {int} amount -
	 */
	_dealDamage(type, amount) {
		if (type === null || amount == 0) return;
		if (this.data.dmgImmunities.find(type) !== undefined) return;
		if (this.data.dmgResistances.find(type) !== undefined) {
			amount = Math.floor(amount / 2);
		}
		this.hp = Math.max(0, this.hp - amount);
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
	 * @returns {Token}
	 */
	setTeam(team) {
		this.team = team;
		return this;
	}

	/**
	 * Set the stats of the Token
	 * @param {CreatureSchema} schema - what the data associated with the Token is
	 * @returns {Token}
	 */
	setSchema(schema) {
		this.hp = schema.hp;
		this.data = schema;

		// Load all of the dice for rolling
		this.stats.set(StatType.Strength, new Dice(1, 20, Math.floor(schema.str / 2) - 5));
		this.stats.set(StatType.Dexterity, new Dice(1, 20, Math.floor(schema.dex / 2) - 5));
		this.stats.set(StatType.Charisma, new Dice(1, 20, Math.floor(schema.cha / 2) - 5));
		this.stats.set(StatType.Intelligence, new Dice(1, 20, Math.floor(schema.int / 2) - 5));
		this.stats.set(StatType.Wisdom, new Dice(1, 20, Math.floor(schema.wis / 2) - 5));
		this.stats.set(StatType.Constitution, new Dice(1, 20, Math.floor(schema.con / 2) - 5));
		this.stats.set(StatType.Initiative, new Dice(1, 20, Math.floor(schema.dex / 2) - 5));

		// Load all of the actions
		schema.actions.forEach((actionId) => {
			let actionSchema = globalData.find(actionId);
			this.actions.push(new Action(actionSchema));
		});

		// Load the behavior
		if (schema.defaultBehavior === BehaviorType.Random) {
			this.behavior = new RandomBehavior(this.actions, this);
		}

		// Load the image
		this.setImage(schema.src);

		return this;
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
