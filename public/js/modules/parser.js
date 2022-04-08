/**
 * parser.js
 * A file for all things related to parsing and reading in files
 */

/** Create a new AngularJS module */
var ParserModule = angular.module('ParserModule', ['DataModule'])
/** Used in order to load/access action and creatureschemas */
var localData = {actions: new Map(), creatures: new Map()}

/**
 * Class for parsing a json file of monster/character sheets
 */
class Parser {

	/**
	 * Converts json to schemas to be added to either actions map or creatures map
	 * @param {Object} json - json object to be parsed
	 */
    _monsterJsonToSchema(json){

        //properly gets the json to be used
        const monster = json;

        //gets correct size
        let size = monster.meta.split(" ")[0];
        let intSize = 0;
        if(size == "Tiny"){
            intSize = 0.25;
        }else if(size == "Small"){
            intSize = 0.5;
        }else if(size == "Medium"){
            intSize = 1;
        }else if(size == "Large"){
            intSize = 2;
        }else if(size == "Huge"){
            intSize = 3;
        }else{
            intSize = 4;
        }

        //saves variables to be used for the creatureschema
        const name = monster.name;
        const int = monster.INT;
        const cha = monster.CHA;
        const dex = monster.DEX;
        const str = monster.STR;
        const con = monster.CON;
        const wis = monster.WIS;
        const cr = this.getCR(monster.Challenge);
        const speed = this.getSpeed(monster.Speed); //Special for "Speed"
        const ac = this.getArmorClass(monster['Armor Class']); //Special for "Armor Class"
        const pb = this.getProficiencyBonus(monster.Challenge); //Special for prof bonus (use "Challenge")
        const hp = this.getHitPoints(monster['Hit Points']);
        let dmgResistances = []; //Special for "Damage Resistances"
        let dmgImmunities = []; //Special for "Damage Immunities"
        let darkvision = 0; //Special use "Senses"
        let truesight = 0; //Special use "Senses"
        let features = []; //What are features?
        let defaultBehavior = ""; //keep as ""
        let creatureActions = []
        let src = monster.img_url;

        //adds the corresponding actions to overall map
        if (monster.Actions !== undefined) {
            creatureActions = this.parseAction(monster.Actions);
        }

        //creates creature schema
        const creature = new CreatureSchema( {cr:cr,name:name,int:int,cha:cha,dex:dex,str:str,con:con,wis:wis,speed:speed,ac:ac,pb:pb,hp:hp,actions:creatureActions,src:src,size:intSize} );
        console.log(creature.cr);
        //adds creatures schema to overall map
        localData.creatures.set(creature._id,creature);

    }

	/**
	 * Parses string and calculates to get the proper CR score
	 * @param {String} String - CR string
     * @returns {String}
	 */
     getCR(String){
        return String.split(" ")[0]
    }

	/**
	 * Parses string and calculates to get the proper speed as an int
	 * @param {String} String - speed string
     * @returns {int}
	 */
    getSpeed(String){
        return parseInt(String.split(" ")[0])/5;
    }

	/**
	 * Parses string and gets armor class as an int
	 * @param {String} String - armor string
     * @returns {int}
	 */
    getArmorClass(String){
        return parseInt(String.split(" ")[0]);
    }

	/**
	 * Parses string and calculates to get the proper pb as an int
	 * @param {String} String - pb string
     * @returns {int}
	 */
    getProficiencyBonus(String){
        return 2 + Math.floor(Math.abs((parseInt(String.split(" ")[0])-1))/4);
    }

	/**
	 * Parses string to get hitpoints as an int
	 * @param {String} String - hp string
     * @returns {int}
	 */
    getHitPoints(String){
        return parseInt(String.split(" ")[0]);;
    }


	/**
	 * Parses string to get correct action to add correct action schemas to map
	 * @param {String} String - action string
     * @returns {int}
	 */
    parseAction(str){

        //gets the melee action name matches, not fully parsed
        const regex1 = /strong>[A-z ()]*\.<\/strong><\/em>[<>a-z ]*Melee Weapon Attack/gm;
        let meleeArray = str.match(regex1);

        //gets the melee action attributes matches, not fully parsed
        const regex2 = /Melee Weapon Attack:<\/em>[<>a-z\+\−,.\/ 0-9:A-Z(]*\) [a-z. 0-9(),'A-Z-]*</gm;
        let meleeAttributesArray = str.match(regex2);

        //gets the ranged action name matches, not fully parsed
        const regexRange = /strong>[A-z ()]*\.<\/strong><\/em>[<>a-z ]*Ranged Weapon Attack/gm;
        let rangeArray = str.match(regexRange);
        //gets the ranged action attributes matches, not fully parsed
        const regexRangeAttributes = /Ranged Weapon Attack:<\/em>[<>a-z\+\−,.\/ 0-9:A-Z(]*\) [a-z. 0-9(),'A-Z-]*</gm;
        let rangeAttributesArray = str.match(regexRangeAttributes);

        //if no melee actions or range actions then return an empty array;
        if(( meleeArray == null || meleeAttributesArray == null) && (rangeArray == null || rangeAttributesArray == null) ){
            return [];
        }

        var arrayLength=0;
        let finalActionIds = []; //overall array
        let meleeActionIds; //stores ranged attack id keys of the global map

        //does the final parse if melee actions exist properly
        if(meleeArray != null && meleeAttributesArray != null){
            //checks if proper
            if(meleeArray.length>meleeAttributesArray.length){
                arrayLength = meleeAttributesArray.length;

            }else{
                arrayLength = meleeArray.length;
            }

            meleeActionIds = this.parseActionFinal(arrayLength, meleeArray, meleeAttributesArray,0);
            finalActionIds.concat(meleeActionIds);//adds the melee actions ids to overall actions array
        }

        arrayLength=0;
        let rangeActionIds; //stores ranged attack id keys of the global map

        //does the final parse if range actions exist properly
        if(rangeArray != null && rangeAttributesArray != null){
            if(rangeArray.length>rangeAttributesArray.length){
                arrayLength = rangeAttributesArray.length;

            }else{
                arrayLength = rangeArray.length;
            }

            rangeActionIds = this.parseActionFinal(arrayLength, rangeArray, rangeAttributesArray,1);
            finalActionIds.concat(rangeActionIds);//adds the range actions ids to overall actions array
        }
        
        return finalActionIds;
    }

    /**
	 * Parses string to get correct action and attributes in the 
     * global map, and returns the corresponding action ids in array form
	 * @param {int} arrayLength - length of array to loop over
     * @param {int} type - action type
     * @param {String[]} actionArray - array of action strings to be completely parsed
     * @param {String[]} attributesArray - array of attributes to be completely parsed
     * @returns {int[]} 
	 */
    parseActionFinal(arrayLength, actionArray, attributesArray, type){
        //holds the action ids that correspond to a monster
        let actionIdArray = [];
        //gets the exact name from the action matches
        var parseRegex = /[a-zA-Z ]*\./gm;
        var parseRegex2 = /[a-zA-Z ]*\(/gm; 

        //loop that acquires the name and attributes, further parsing them
        for (var q = 0; q < arrayLength; q++) {
            
            //parses to get name of action
            let name = actionArray[q].match(parseRegex);

            //parses name correctly if runs into a form dependent action
            if(name == "."){
                name = actionArray[q].match(parseRegex2);
            }

            var parsedName = name[0].substring(0,name[0].length -1);
            //attributes of the action
            var attributes = [];
            //temp string holding the numbers of the attributes to be added to the attributes array
            let temp = "";
            for (let i = 0; i < attributesArray[q].length; i++) {

                //if ranged type, then don't use the 3rd parsed int
                if(type == 1 && i == 2){
                    continue;
                }

                //getting only ints
                if( (!isNaN(attributesArray[q][i])) && !(attributesArray[q][i] == " ") ){
                    temp+=attributesArray[q][i];
                    continue;

                }else{

                    if(temp.length == 0){
                        continue; //no ints found, continue loop

                    }else{

                        if(i<2){ //turns attribute string into ints unless for damage roll strings
                            attributes.push(parseInt(temp));
                        }else{
                            attributes.push(temp);
                        }
                        temp = "";//resetting temp string for next attribute

                    }
                }
            }

            if(temp.length != 0){
                attributes.push(temp); //add attribute to attribute array
            }

            //generating actionschema of creature
            const action =  new ActionSchema( {name: parsedName, toHitBonus: attributes[0], range: attributes[1], primaryDamage: attributes[2], primaryDice: attributes[3]+"d"+attributes[4]+"+"+attributes[5] });
            actionIdArray.push(action._id);//adding the corresponding action id
            localData.actions.set(action._id, action); //storing the action schemas to an overall hashmap
        }

        //returns the action id arrays for the creatureshema to store
        return actionIdArray;
    
    }
}


/**
 * asynchronous function that uses promises to read in the json file
 * that contains statblocks
 * @param {str} fileName - string of json file name to be loaded in
 */
async function loadCreatures(fileName) {
    //store the what is read from the json
    let dataAll;
    var parser = new Parser();
    //read the file
    const response = await fetch(fileName);
    dataAll = await response.json();
    //read in the jsons
    for (let index = 0; index < dataAll.length; index++) {
        parser._monsterJsonToSchema(JSON.parse(JSON.stringify(dataAll[index])));
    }
	console.log("Data loaded!")
}

/**
 * reading the json file and converting into action and creatures,
 * putting them in their respective maps
 */
loadCreatures("../../data/srd_5e_monsters.json");
