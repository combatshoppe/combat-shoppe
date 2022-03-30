/**
 * behavior.js
 * A file for all behaviors.
 */

/** Create a new AngularJS module */
var DataUtilsModule = angular.module('BehaviorModule', [])

class Behavior {
    actions = [];
    thisToken = null;
    _movement = 30;
    spentMovement = 0;
    _action = 1.0;
    _ba = false;
    _currentTarget = null;
    token = null; //me

    constructor(actions){
        this.actions = actions;
    } //ngl i might have missed this in other places

    do(targetPosistion, possibleTargets, token2=null){//tokenTarget
        //Get new target
        //Loop through all ranked Posistions and compare if they are 
        //distance of attack range
        if(token2 != null)
            this.thisToken = token2;
        //Hit attack
        if(possibleTargets.length == 0 || (this.spentMovement >= this._movement && this._action <= 0)){
            return true;
        }
        let possibleChoices = [];
        //let trgt = possibleTargets[0];
        for (let i = 0; i < possibleTargets.length; i++){
            let trgt = possibleTargets[i];
            if(trgt != this.thisToken){

                if (this.inRange2(trgt.row,this.thisToken.row-1,this.thisToken.row+1) && this.inRange2(trgt.column,this.thisToken.column-1,this.thisToken.column+1)){
                possibleChoices.push(trgt);
                }
            }
        }
        if(possibleChoices.length > 0 && this._action > 0){
            let chosenAction = this.mostDamagingAction(this.actions);
            //console.log(chosenAction);
            //let chosenAction = this.actions[0];
            // console.log(this.chooseTarget(possibleChoices));

            // this.chooseTarget(possibleChoices).attackToHit(chosenAction.stats.toHitBonus, chosenAction.stats.primaryDamage, chosenAction.primary.roll(), chosenAction.stats.secondaryDamage, chosenAction.secondary.roll())
            possibleChoices[0].attackToHit(chosenAction.stats.toHitBonus, chosenAction.stats.primaryDamage, chosenAction.primary.roll(), chosenAction.stats.secondaryDamage, chosenAction.secondary.roll())

            this._action -= 1;
            console.log("trueatk");
            return false;
        }
        if(this.spentMovement >= this._movement){
            return true;
        }
        possibleChoices = []
        possibleTargets.forEach((trgt) => {
            if(trgt != null && trgt.hp > 0 && (trgt.row == this.thisToken.row && trgt.column == this.thisToken.column)){
                
            } else{
                let range = this.thisToken._movement/5;
                if (this.inRange2(trgt.row,this.thisToken.row-range,this.thisToken.row+range) && this.inRange2(trgt.column,this.thisToken.column-range,this.thisToken.column+range)){
                    possibleChoices.push(trgt);
                }
            }
        });

        if(possibleChoices.length == 0){
            possibleTargets.forEach((trgt) => {
                possibleChoices.push(trgt);
            });
        }

        console.log("Move!");
        
        let tokenTarget = this.chooseTarget(possibleChoices);
        targetPosistion.x = tokenTarget.row;
        targetPosistion.y = tokenTarget.column;
        this.spentMovement = this._movement;
        return true;
        
    } //Virtual function!!!!!!!!!
    // rankedPosition should be an empty vector that is returned. 
    //The function should return false when if cannot do anything anymore
    chooseTarget(possibleChoices){
        throw "Error: no behavior type defined";
        //return possibleChoices[Math.floor(Math.random*possibleChoices.length)];
    }

    mostDamagingAction(actions){
        //How tf do you get the actions, asume actions has the actual combat actions
        if (actions.length == 0)
            return null;
        let mostDamage = actions[0];
        this.damageOfMost = 0;
        actions.forEach((a) => {
            let newChallengerDamage = a.primary.average() + a.secondary.average();
            if(newChallengerDamage > this.damageOfMost){
                this.damageOfMost = newChallengerDamage;
                mostDamage = a;
            }
        });
        return mostDamage;
    }

    inRange2(num, low, high){
        return (num >= low && num <= high);             // CHECK RANGE NEEDS TO BE FIXED
    }
    
    start(){
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

class RandomBehavior extends Behavior {
    chooseTarget(possibleChoices){
        // console.log(possibleChoices);
        return possibleChoices[1];                          //  THIS NEEDS TO BE FIXED TOO AT SOME POINT
        // return possibleChoices[Math.floor(Math.random*possibleChoices.length)];
    }
}

