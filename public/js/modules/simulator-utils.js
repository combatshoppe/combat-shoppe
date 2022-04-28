/**
 * simulator-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

/** Create a new AngularJS module */
/* exported SimulatorUtils */
var SimulatorUtilsModule = angular.module('SimulatorUtils', ['UiModule']); // eslint-disable-line no-unused-vars

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
		return this._height;
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
		this.objects.forEach((object) => { this._height = Math.max(object.height, this._height); });
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
		for (let x = Math.ceil(object.data.size) - 1; x >= 0; x--) {
			for (let y = Math.ceil(object.data.size) - 1; y >= 0; y--) {
				// Convert the position to a indexable string
				let positionString = new Position(position.x + x, position.y + y).toString();
				// Make sure there is a tile at the position
				if (!this._grid.has(positionString)) { this._grid.set(positionString, new Tile()); }
				// Get the tile
				let tile = this._grid.get(positionString);
				// Update the tile
				object.row = position.x;
				object.column = position.y;
				// Add the object to the Tile
				tile.add(object);
			}
		}
	}

	/**
     * Get a position in the grid
     * @param {Position} position - What position of the grid to use
     * @param {TileObject} object - Object to remove, if not specified removes all objects
     * @return {Boolean} - True if the object was removed sucessflly
     */
	remove(position, object = null) {
		// Check all the spaces the object should be in
		for (let x = Math.ceil(object.data.size) - 1; x >= 0; x--) {
			for (let y = Math.ceil(object.data.size) - 1; y >= 0; y--) {
				// Stop if there is no tile
				if (!this._grid.has(new Position(position.x + x, position.y + y)).toString()) {
					return false;
				}
			}
		}
		// Remove the object
		for (let x = Math.ceil(object.data.size) - 1; x >= 0; x--) {
			for (let y = Math.ceil(object.data.size) - 1; y >= 0; y--) {
				let loopPosition = new Position(position.x + x, position.y + y);
				loopPosition = loopPosition.toString();
				// Get the tile
				let tile = this._grid.get(loopPosition);
				// Remove the tile if this is the last object
				if (tile !== undefined && tile.objects.length <= 1) {
					this._grid.delete(loopPosition);
					continue;
				}
				// Otherwise, remove the object from the Tile
				this._grid.get(loopPosition).remove(object);
			}
		}
		return true;
	}

	/**
     * Get a position in the grid
     * @param {TileObject} object - What position of the grid to use
     * @param {Position} to - What position of the grid to use
     * @param {Position} from - What position of the grid to use
     * @return {Boolean} - True if the object was moved sucessflly
     */
	async move(object, to, from) {
		// Remove the object
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
     * @member {int} hp - Current HP
     * @member {int} team - Team id
     * @member {Behavior} behavior - Behavior the token should use for desicion making
     * @member {CreatureSchema} data - The static data of the token
     * @member {ActionSchema[]} actions - List of all actions the Token can use
     * @member {ConditionType[]} conditions - Map of Positions mapped to Tiles
     * @member {Map<StatType:Dice>} stats - Roll type mapped to a rollable die
     */
	hp = 0;
	team = 0;
	behavior = null;
	data = null;
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
		if (roll >= saveDc && saveOrSuck) return false;
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
     * @member {int} toHit - bonus to hit
     * @member {DamageType} primaryDamageType - primary type of damage dealt
     * @member {int} primaryDamage - amount of damage dealt
     * @member {DamageType} secondaryDamageType - secondary type of damage dealt
     * @member {int} secondaryDamage - amount of damage dealt
     * @returns {Boolean} - Returns true if the target was hit
     */
	attackToHit(toHit, primaryDamageType, primaryDamage, secondaryDamageType = null, secondaryDamage = 0) {
		if (this.data.ac > toHit) {
			document.getElementById('log').innerHTML += '\t\tMiss!\n';
			console.log('\t\tMiss!');
			return false;
		}
		document.getElementById('log').innerHTML += '\t\tHit!\n';
		console.log('\t\tHit!');
		this._dealDamage(primaryDamageType, primaryDamage);
		//this._dealDamage(secondaryDamageType, secondaryDamage);

		return true;
	}

	/**
     * Heals the token by a certain amount
     * @member {int} amount - amount of HP to restore
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
		this.hp = Math.max(0, this.hp - amount);
		document.getElementById('log').innerHTML += '\t\tOW! I am now at: ';
		document.getElementById('log').innerHTML += this.hp;
		document.getElementById('log').innerHTML += '\n';
		console.log('\t\tOW! I am now at:', this.hp);
		return;
		/*
		if (type === null || amount == 0) return;
		if (this.data.dmgImmunities.includes(type) !== undefined) return;
		if (this.data.dmgResistances.includes(type) !== undefined) {
			amount = Math.floor(amount / 2);
		}
		this.hp = Math.max(0, this.hp - amount);
		*/
	}

	/**
     * Function that opens up the TokenSettingDisplay
     */
	onRightClick() {
		// TODO : implement this function
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


		var ACTION_SCHEMA = new ActionSchema({ name: 'Test Axe' });

		// Load all of the actions
		/* SHIT BROKE
        schema.actions.forEach((actionId) => {
        	let actionSchema = localData.actions.get(actionId);
        	this.actions.push(new Action(actionSchema));
        });
        */
		this.actions.push(new Action(ACTION_SCHEMA));

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

/**
 * Class representing a wall.
 */
class Wall extends TileObject {

	/**
     * Member variables
     * @member {int} ac - armor class of wall
     * @member {int} hp - hitpoints of wall
     * @member {int} currentHP - current hitpoints of wall
     */
	ac = 0;
	hp = 0;
	currentHP = 0;

	/**
     * checks if wall has HP left
     * @return {Boolean} - True if the wall has HP<=0 otherwise false
     */
	hasHP() {
		//checks if hp is all lost
		if (this.currentHP <= 0) {
			return false;
		} else {
			return true;
		}
	}

	/**
     * sets armor class
     * @param {int} armorClass
     */
	setAC(armorClass) {
		this.ac = armorClass;
	}

	/**
     * sets hitpoints and currentHP
     * @param {int} hitpoints - hitpoints of wall
     */
	setHP(hitpoints) {
		this.hp = hitpoints;
		this.currentHP = hitpoints;
	}

	/**
     * sets the currenthp dependent on attack on wall
     * @param {int} damage
     */
	attacked(damage) {
		this.currentHP -= damage;
	}

}
