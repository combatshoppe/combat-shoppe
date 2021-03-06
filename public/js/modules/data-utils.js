/**
 * data-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

/** Create a new AngularJS module */
var DataUtilsModule = angular.module('DataUtilsModule', []); // eslint-disable-line no-unused-vars

/** Function to Create Enum like Objects */
function createEnum(labels, values) {
	const enumObject = {};
	for (let i = 0; i < labels.length; i++) {
		enumObject[labels[i]] = values[i];
	}
	return Object.freeze(enumObject);
}

/** Create all enum objects */
// USAGE: "TargetType.Self" returns value 0
/* jslint unparam: true */
const TargetType = createEnum(['Self'], [0]);
const BehaviorType = createEnum(['Random', 'AttackStrongest', 'AttackWeakest'], [0, 1, 2]);
const ActionType = createEnum(['Action', 'Bonus', 'Move', 'Free'], [0, 1, 2, 3]);
const DamageType = createEnum(['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const RechargeType = createEnum(['ShortRest', 'LongRest', 'Dawn', 'Round', 'StartOfTurn', 'D6G4', 'D6G5'], [0, 1, 2, 3, 4, 5, 6]);
const StatType = createEnum(['Initiative', 'Init', 'Strength', 'Str', 'Dexterity', 'Dex', 'Charisma', 'Cha', 'Intelligence', 'Int', 'Wisdom', 'Wis', 'Constitution', 'Con'], [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
/* jslint unparam: false */

/**
 * Class for a simple timer
 */
class Timer {
	delay(time) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(time);
			}, time * 1000);
		});
	}
}

/**
 * Class representing a point.
 */
class Position {
	/**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @constructor
     */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
     * Returns a basic object that can be used as a key
     * @returns {Object}
     */
	toString() {
		return this.x.toString() + ',' + this.y.toString();
	}

	/**
     * Returns a true if the given Position is in the same location
     * @param {Position} position - The Positon object being checked.
     * @returns {Boolean}
     */
	equals(position) {
		return this.x === position.x && this.y === position.y;
	}
}

/**
 * A class representing a pool of a single size of dice and an associated modifier
 */
class Dice {
	/**
     * Member variables
     * @member {int} _diceSize - x in mdx + b
     * @member {int} _diceCount - m in mdx + b
     * @member {int} _modifier - b in mdx + b
     */
	_diceSize = 20;
	_diceCount = 1;
	_modifier = 0;

	/**
     * Dice constructor from string
     * @param {String} dice - The dice in string
     * @returns {Dice} - The dice created
     */
	static parse(dice) {
		dice = dice.replace(' ', '').split('r');
		let diceCount = parseInt(dice[0]);
		dice = dice[1].split('+');
		let diceSize = parseInt(dice[0]);
		let modifier = parseInt(dice[1]);
		return new Dice(diceCount, diceSize, modifier);
	}

	/**
     * Dice constructor from numbers
     * @param {number} size - The size of the die.
     * @param {number} count - This .
     * @param {number} modifier - The y value.
     * @constructor
     */
	constructor(count, size, modifier = 0) {
		this._diceSize = size;
		this._diceCount = count;
		this._modifier = modifier;
		if (isNaN(this._diceSize)) { this._diceSize = 0; }
		if (isNaN(this._diceCount)) { this._diceCount = 0; }
		if (isNaN(this._modifier)) { this._modifier = 0; }
	}

	/**
     * Rolls the dice
     */
	roll() {
		let sum = 0;
		for (let i = 0; i < this._diceCount; ++i) {
			sum += 1 + Math.floor(Math.random() * this._diceSize);
		}
		return sum + this._modifier;
	}

	average(){
		return this._diceCount*((this._diceSize+1)/2)+this._modifier;
	}

	/**
     * Returns the text description of the dice
     */
	text() {
		if (this._modifier === 0) {
			return this._diceCount.toString() + 'd' + this._diceSize.toString() + ' + ' + this._modifier.toString();
		}
		return this._diceCount.toString() + 'd' + this._diceSize.toString();
	}
}

/**
 * Class representing an action
 */
class Action{

	/**
	 * Member variables
	 * @member {int} maxUses - only used if this is a dynamic ability
	 * @member {int} currentUses - only really used if this is a dynamic ability
	 * @member {Dice} primary - primary dice object to help with rolling
	 * @member {Dice} secondary - secondary dice object to help with rolling
	 */
	maxUses = 0;
	currentUses = 0;
	primary = new Dice(1,6,0);
	secondary = new Dice(0,0,0);

	/**
     * Construct Action using actionschmems
     * @param {ActionSchema} stats - the stats of action.
     * @constructor
     */
	constructor(stats) {
		this.stats = stats;
	}


	/**
     * Return if the action can be used
     * @returns {bool}
     */
	canUse() {
		return this.currentUses > this.maxUses;
	}

	/**
     * Increases maxUse by 1
     */
	use(){
		this.maxUses += 1;
	}

	/**
     * Return if this action is a spell
     * @returns {bool}
     */
	isSpell(){
		return this.stats._isSpell();
	}

}
