/**
 * data-utils.js
 * A file for all the behavior classes and any classes related
 */

/** Create a new AngularJS module */
var BehaviorModule = angular.module('BehaviorModule', [])

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
	 **/
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
