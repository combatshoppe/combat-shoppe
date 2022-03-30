/**
 * behavior.js
 * A file for all behaviors.
 */

/** Create a new AngularJS module */
var BehaviorModule = angular.module('BehaviorModule', [])

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


    do(targetPosistion, possibleTargets){//tokenTarget
        //Get new target

        //Loop through all ranked Posistions and compare if they are 
        //distance of attack range
        
        //Hit attack
        if(possibleTargets.length == 0 || (spentMovement >= this._movement && this._action <= 0)){
            return false;
        }
        possibleChoices = []
        for (trgt in possibleTargets){
            if (trgt.row.inRange(this.target.row-1,this.target.row+1) && trgt.row.inRange(this.target.col-1,this.target.col+1)){
                possibleChoices.add(trgt);
            }
        }
        if(possibleChoices.length > 0){
            chosenAction = mostDamagingAction(actions);
            chooseTarget(possibleChoices).attackToHit(chosenAction.toHitBonus, chosenAction.primaryDamage, chosenAction.primary.roll(), chosenAction.secondaryDamage, chosenAction.secondary.roll())
            this._action -= 1;
            return true;
        }
        if(spentMovement >= this._movement){
            return false;
        }
        possibleChoices = []
        for (trgt in possibleTargets){
            
            if(trgt != null && trgt.hp > 0){
                
            }
            range = this.token._movement/5;
            if (trgt.row.inRange(this.target.row-range,this.target.row+range) && trgt.row.inRange(this.target.col-range,this.target.col+range)){
                possibleChoices.add(trgt);
            }
            if(possibleChoices.length == 0){
                for(trgt in possibleTargets){
                    possibleChoices.add(trgt);
                }
            }
        }
        let tokenTarget = chooseTarget(possibleChoices);
        targetPosistion.x = tokenTarget.row;
        targetPosistion.y = tokenTarget.col;
        spentMovement = this._movement;
        return true;
        
    } //Virtual function!!!!!!!!!
    // rankedPosition should be an empty vector that is returned. 
    //The function should return false when if cannot do anything anymore
    chooseTarget(possibleChoices){
        throw "Error: no behavior type defined";
        //return possibleChoices[Math.floor(Math.random*possibleChoices.length)];
    }

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

class RandomBehavior extends Behavior {
    chooseTarget(possibleChoices){
        return possibleChoices[Math.floor(Math.random*possibleChoices.length)];
    }
}

