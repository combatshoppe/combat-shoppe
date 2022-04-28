/**
 * behavior.js
 * A file for all behaviors.
 */

/** Create a new AngularJS module */
var BehaviorModule = angular.module('BehaviorModule', []); // eslint-disable-line no-unused-vars

class Behavior {
	actions = [];
	thisToken = null;
	_movement = 30;
	spentMovement = 0;
	_action = 1.0;
	_ba = false;
	_currentTarget = null;
	token = null; //me

	constructor(actions) {
		this.actions = actions;
	} //ngl i might have missed this in other places

	/**
     * Runs and controls the token's actions on the map
     * @param {Token} targetPosistion - to me modified if the token is to be moved
     * @param {Token[]} possibleTargets - list of all possible tokens on the map
     * @param {Token} token2 - sends in itself as a reference for the Behavior to use
     * @returns {Boolean} - true if it is done with all actions, false if it still has more to do
     */
	do(targetPosistion, possibleTargets, token2 = null) { //tokenTarget
		//Get new target
		//Loop through all ranked Posistions and compare if they are
		//distance of attack range
		if (token2 != null)
			this.thisToken = token2;
		if (this.thisToken.hp <= 0) {
			document.getElementById('log').innerHTML += '\tI am dead\n';
			console.log('\tI am dead');
			return true;
		}
		//Hit attack
		if (possibleTargets.length == 0 || (this.spentMovement >= this._movement && this._action <= 0)) {
			this.start();
			return true;
		}
		let possibleChoices = [];
		//let trgt = possibleTargets[0];
		for (let i = 0; i < possibleTargets.length; i++) {
			let trgt = possibleTargets[i];
			if (trgt != this.thisToken) {

				if (this.inRange2(trgt.row, this.thisToken.row - 1, this.thisToken.row + 1) && this.inRange2(trgt.column, this.thisToken.column - 1, this.thisToken.column + 1)) {
					possibleChoices.push(trgt);
				}
			}
		}
		if (possibleChoices.length > 0 && this._action > 0) {
			let chosenAction = this.mostDamagingAction(this.actions);
			//console.log(chosenAction);
			//let chosenAction = this.actions[0];
			// console.log(this.chooseTarget(possibleChoices));
			// this.chooseTarget(possibleChoices).attackToHit(chosenAction.stats.toHitBonus, chosenAction.stats.primaryDamage, chosenAction.primary.roll(), chosenAction.stats.secondaryDamage, chosenAction.secondary.roll())
			let tgt = this.chooseTarget(possibleChoices);
			while (tgt.hp <= 0) {
				possibleChoices.pop(tgt);
				if (possibleChoices.length == 0) {
					this._action -= 1;
					document.getElementById('log').innerHTML += '\tno alive targets\n';
					console.log('\tno alive targets');
					return false;
				}
				tgt = this.chooseTarget(possibleChoices);
			}
			document.getElementById('log').innerHTML += '\tAttack!\n';
			console.log('\tAttack!');
			tgt.attackToHit(chosenAction.stats.toHitBonus + Math.floor(Math.random() * 20), chosenAction.stats.primaryDamage, chosenAction.primary.roll(), chosenAction.stats.secondaryDamage, chosenAction.secondary.roll());
			this._action -= 1;
			return false;
		}
		if (this.spentMovement >= this._movement) {
			this.start();
			return true;
		}
		possibleChoices = [];
		possibleTargets.forEach((trgt) => {
			if (trgt != null && trgt.hp > 0 && (trgt.row == this.thisToken.row && trgt.column == this.thisToken.column)) {
				null;
			} else {
				let range = this.thisToken._movement / 5;
				if (this.inRange2(trgt.row, this.thisToken.row - range, this.thisToken.row + range) && this.inRange2(trgt.column, this.thisToken.column - range, this.thisToken.column + range)) {
					possibleChoices.push(trgt);
				}
			}
		});

		if (possibleChoices.length == 0) {
			possibleTargets.forEach((trgt) => {
				possibleChoices.push(trgt);
			});
		}

		document.getElementById('log').innerHTML += '\tMove!\n';
		console.log('\tMove!');

		let tokenTarget = this.chooseTarget(possibleChoices);
		targetPosistion.x = tokenTarget.row;
		targetPosistion.y = tokenTarget.column;
		this.spentMovement = this._movement;
		if (this._action > 0) {
			return false;
		} else {
			this.start();
			return true;
		}

	}

	/**
     * Chooses target based on behavior type
     * @param {Token[]} possibleChoices - list of all possible token targets
     * @returns {Token} - The choice of target
     */
	chooseTarget(possibleChoices) {
		console.log(possibleChoices);
		throw 'Error: no behavior type defined';
		//return possibleChoices[Math.floor(Math.random*possibleChoices.length)];
	}


	/**
     * Selects the action that does the most damage from all actions in "actions"
     * @param {Action[]} actions - list of all possible actions
     * @returns {Action} - returns most damaging action
     */
	mostDamagingAction(actions) {
		//How tf do you get the actions, asume actions has the actual combat actions
		if (actions.length == 0)
			return null;
		let mostDamage = actions[0];
		this.damageOfMost = 0;
		actions.forEach((a) => {
			let newChallengerDamage = a.primary.average() + a.secondary.average();
			if (newChallengerDamage > this.damageOfMost) {
				this.damageOfMost = newChallengerDamage;
				mostDamage = a;
			}
		});
		return mostDamage;
	}

	inRange2(num, low, high) {
		return (num >= low && num <= high); // CHECK RANGE NEEDS TO BE FIXED
	}

	start() {
		this._action = 1.0;
		this.spentMovement = 0;
		this._ba = false;
	} //Resets the behavior, indicating it is the next turn.
	//Restart all member variables


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

class RandomBehavior extends Behavior { // eslint-disable-line no-unused-vars
	chooseTarget(possibleChoices) {
		return possibleChoices[Math.floor(Math.random() * possibleChoices.length)];
	}
}
