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

        //properly converts the json to be used
        const monster = JSON.parse(JSON.stringify(json));

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
        //console.log(intSize);

        //saves variables to be used for the creatureschema
        const name = monster.name;
        const int = monster.INT;
        const cha = monster.CHA;
        const dex = monster.DEX;
        const str = monster.STR;
        const con = monster.CON;
        const wis = monster.WIS;
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
        const creature = new CreatureSchema( {name:name,int:int,cha:cha,dex:dex,str:str,con:con,wis:wis,speed:speed,ac:ac,pb:pb,hp:hp,actions:creatureActions,src:src,size:intSize} );

        //adds creatures schema to overall map
        localData.creatures.set(creature._id,creature);

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

        //if no melee actions then return an empty array;
        if(meleeAttributesArray == null || meleeArray == null){
            return [];
        }

        //gets the exact name from the action matches
        var regex3 = /[a-zA-Z ]*\./gm;

        var arrayLength=0;

        //checks if proper
        if(meleeArray.length>meleeAttributesArray.length){
            arrayLength = meleeAttributesArray.length;

        }else{
            arrayLength = meleeArray.length;

        }

        //holds the action ids that correspond to a monster
        let actionIdArray = [];

        //loop that acquires the name and attributes, further parsing them
        for (var q = 0; q < arrayLength; q++) {

            //parses to get name of action
            const name = meleeArray[q].match(regex3);
            var parsedName = name[0].substring(0,name[0].length -1);

            //attributes of the action
            var attributes = [];
            //temp string holding the numbers of the attributes to be added to the attributes array
            let temp = "";
            for (let i = 0; i < meleeAttributesArray[q].length; i++) {

                //getting only ints
                if( (!isNaN(meleeAttributesArray[q][i])) && !(meleeAttributesArray[q][i] == " ") ){
                    temp+=meleeAttributesArray[q][i];
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
 */
async function loadCreatures() {
    //store the what is read from the json
    let dataall;
    var parser = new Parser();
    //read the file
    const response = await fetch('../../data/srd_5e_monsters.json');
    dataall = await response.json();
    //read in the jsons
    for (let index = 0; index < dataall.length; index++) {
        parser._monsterJsonToSchema(dataall[index]);
    }
	console.log("Data loaded!")
}

/**
 * reading the json file and converting into action and creatures,
 * putting them in their respective maps
 */
loadCreatures();
