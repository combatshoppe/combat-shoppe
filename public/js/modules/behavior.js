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


