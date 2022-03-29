/**
 * behavior.js
 * A file for all behaviors.
 */

/** Create a new AngularJS module */
var DataUtilsModule = angular.module('BehaviorModule', [])


class RandomBehavior {

    do (targetPosition, possibleTargets) {
        // console.log(target);
        // console.log(possibleTargets);

        // let token = new Token(new Position(0, 0), 1, 1, null);
        // token.setSchema(STOCK_SCHEMA);
        // token.setPosition(0, 0);


        console.log("POSSIBLE TARGETS");
        console.log(possibleTargets);

        targetPosition.x = 1;
        targetPosition.y = 1;

        return true;
    }

}