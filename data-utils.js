/**
 * data-utils.js
 * A file for all enums and extremely basic shared classes that many files can
 * import across the app.
 */

/** Create a new AngularJS module */
var DataUtilsModule = angular.module('DataUtilsModule', [])

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
TargetType = createEnum(['Self'], [0])
BehaviorType = createEnum(['Random', 'AttackStrongest', 'AttackWeakest'], [0, 1, 2])
ActionType = createEnum(['Action', 'Bonus', 'Move', 'Free'], [0, 1, 2, 3])
DamageType = createEnum(['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
RechargeType = createEnum(['ShortRest', 'LongRest', 'Dawn', 'Round', 'StartOfTurn', 'D6G4', 'D6G5'], [0, 1, 2, 3, 4, 5, 6])

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
        dice = dice.split("r");
        let diceCount = parseInt(dice[0]);
        dice = dice[1].split("+");
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
    constructor(size, count = 1, modifier = 0) {
        this._diceSize = size;
        this._diceCount = count;
        this._modifier = modifier;
        if (!isNaN(this._diceSize)) { this._diceSize = 0; }
        if (!isNaN(this._diceCount)) { this._diceCount = 0; }
        if (!isNaN(this._modifier)) { this._modifier = 0; }
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

    //import * as data from './example.json';

}

class Behavior {
    actions = [];
    target = null;
    _movement = 0;
    spentMovement = 0;
    _action = 1.0;
    _ba = false;
    _currentTarget = null;
    token = null; //me

    constructor(actions){
        this.actions = actions;
    } //ngl i might have missed this in other places


    do(tokenTarget, rankedPositions){//tokenTarget
        //Get new target

        //Loop through all ranked Posistions and compare if they are 
        //distance of attack range

        for (trgt in rankedPosition){
            if(trgt != null && trgt.hp > 0){

            }
            if (trgt.row.inRange(this.target.row-1,this.target.row+1) && trgt.row.inRange(this.target.col-1,this.target.col+1)){
                
            }
        }

        if(target == null && rankedPositions.length() == 0){
            return false;
        }
        out = false;
        if(spentMovement > 0){
            out = true;
            if(target == null){
                //Find new target
                //target = smthing
            }
        }
        if(target != null && this.action > 0){
            out = true;
            chosenAction = mostDamagingAction(actions);
            this.target.attackToHit(chosenAction.toHitBonus, chosenAction.primaryDamage, chosenAction.primary.roll(), chosenAction.secondaryDamage, chosenAction.secondary.roll(),)
            //Attack target, use mostDamagingAction(actions) and 
            //update _action -= action.cost
        }
        return out;
    } //Virtual function!!!!!!!!!
    // rankedPosition should be an empty vector that is returned. 
    //The function should return false when if cannot do anything anymore
    start(){
        this._action = 1.0;
        this.spentMovement = 0;
        this._ba = false;
    } //Resets the behavior, indicating it is the next turn. 
    //Restart all member variables
    mostDamagingAction(actions){
        //How tf do you get the actions, asume actions has the actual combat actions
        if (actions.length == 0)
            return null;
        mostDamage = actions[0];
        damageOfMost = 0;
        for(a in actions){
            newChallengerDamage = a.primary.average() + a.secondary.average();
            if(newChallenger > damageOfMost){
                damageOfMost = newChallengerDamage;
                mostDamage = a;
            }
        }
        return mostDamage;
    }

    /*averageDamage(damageString){

        if(damageString.contains("+")){
            damageArr = damageString.split("+");
            dam1 = averageDice(damageArr[0]);
            dam2 = parseInt(damageArr);
            return (dam1 + dam2);
        }
        return parseInt(damageArr);
    }

    averageDice(dieString){
        dieArr = dieString.split("d");
        return dieArr[0]*((dieArr[1]+1)/2);
    }*/
}


class Parser {

    schemaToJson(schema){
        JSON.stringify(schema);
    }

    jsonToSchema(json){
        //Figure out 
    }

    _monsterJsonToSchema(json){
        const monster = JSON.parse(json);
        
        int = monster.INT;
        cha = monster.CHA;
        dex = monster.DEX;
        str = monster.STR;
        con = monster.CON;
        wis = monster.WIS;
        //Make movement action out of speed!!!
        speed = this.getSpeed(monster.Speed); //Special for "Speed"
        ac = getArmorClass(monster['Armor Class']); //Special for "Armor Class"
        pb = getProficiencyBonus(monster.Challenge); //Special for prof bonus (use "Challenge")
        dmgResistances = []; //Special for "Damage Resistances"
        dmgImmunities = []; //Special for "Damage Immunities"
        darkvision = 0; //Special use "Senses"
        truesight = 0; //Special use "Senses"
        actions = []; //Special use "Actions"
        features = []; //What are features?
        defaultBehavior = ""; //keep as ""

        const creature = new CreatureSchema({int: int});


        return creature; //returns DataSchema
    } // Automatically detects the type of DataSchema to make. This is a BUILDER
    
    //https://gist.github.com/tkfu/9819e4ac6d529e225e9fc58b358c3479

    getSpeed(String){
        return parseInt(String.split(" ")[0])/5;
    }

    getArmorClass(String){
        return parseInt(String.split(" ")[0]);
    }

    getProficiencyBonus(String){
        return 2 + floor(Math.abs((parseInt(String.split(" ")[0])-1))/4);
    }

    fiveEtoolsToSchema(String, json){

        return null; //returns DataSchema
    } // converts a json string from 5e tools to our schema structure. Automatically detects the type of DataSchema. This is a BUILDER.

    actionJsonToSchema(json){

    }

    parseAction(str){
        let nameRex = new RegExp("[A-z ]*\.");
        let name = str.match(nameRex)[0];

        let toHitRex = new RegExp("[ ][+][0-9]*");
        //let toHit = (str.match(toHitRex)[0])[1:-2];
        //^^ why no string???


        //https://regex101.com/
        //[A-z ]*\.
        //[ ][+][0-9]*
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
        return currentUses > maxUses;
	}

	/**
     * Increases maxUse by 1
     */
    use(){
        maxUses+=1;
    }

	/**
     * Return if this action is a spell
     * @returns {bool}
     */
    isSpell(){
        return this.stats._isSpell();
    }

}