var ParserModule = angular.module('ParserModule', ['DataModule'])
//var localData = new Map();
var ActionIds = [];

class Parser {

    localData = new Map();

    schemaToJson(schema){
        JSON.stringify(schema);
    }

    jsonToSchema(json){
        //Figure out 
    }

    _monsterJsonToSchema(json){
        const monster = JSON.parse(JSON.stringify(json));
        //const monster = JSON.parse(json);
        const name = monster.name;
        const int = monster.INT;
        const cha = monster.CHA;
        const dex = monster.DEX;
        const str = monster.STR;
        const con = monster.CON;
        const wis = monster.WIS;
        //Make movement action out of speed!!!
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

        const creatureActions = this.parseAction(monster.Actions);
        if(creatureActions.length <1){
            return;
        }
        //console.log(creatureActions);
        const creature = new CreatureSchema( {name:name,int:int,cha:cha,dex:dex,str:str,con:con,wis:wis,speed:speed,ac:ac,pb:pb,hp:hp,actions:creatureActions} );

        this.localData.set(creature._id,creature);
        //console.log(localData);

    } // Automatically detects the type of DataSchema to make. This is a BUILDER
    
    //https://gist.github.com/tkfu/9819e4ac6d529e225e9fc58b358c3479

    getSpeed(String){
        return parseInt(String.split(" ")[0])/5;
    }

    getArmorClass(String){
        return parseInt(String.split(" ")[0]);
    }

    getProficiencyBonus(String){
        return 2 + Math.floor(Math.abs((parseInt(String.split(" ")[0])-1))/4);
    }

    getHitPoints(String){
        return parseInt(String.split(" ")[0]);;
    }

    fiveEtoolsToSchema(String, json){

        return null; //returns DataSchema
    } // converts a json string from 5e tools to our schema structure. Automatically detects the type of DataSchema. This is a BUILDER.

    actionJsonToSchema(json){
        return null;
    }

    parseAction(str){

        //gets the melee action name matches
        const regex1 = /strong>[A-z ()]*\.<\/strong><\/em>[<>a-z ]*Melee Weapon Attack/gm;
        let meleeArray = str.match(regex1);

        //gets the melee action attributes matches
        //const regex2 = /k:<\/em>[<>a-z+,.\/ 0-9:A-Z(]*\) [a-z. 0-9(),'A-Z-]*</gm;
        const regex2 = /Melee Weapon Attack:<\/em>[<>a-z\+\−,.\/ 0-9:A-Z(]*\) [a-z. 0-9(),'A-Z-]*</gm;
        let meleeAttributesArray = str.match(regex2);
        
        if(meleeAttributesArray == null){
            return [];
        }

        //gets the exact name from the action matches
        var regex3 = /[a-zA-Z ]*\./gm;

        var arrayLength=0;
        
        if(meleeArray.length>meleeAttributesArray.length){
            arrayLength = meleeAttributesArray.length;
        }else{
            arrayLength = meleeArray.length;
        }

        //holds the action ids that correspond to a monster
        var ActionIdArray = [];

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
                        temp = "";

                    }
                }
            }

            if(temp.length != 0){
                attributes.push(temp); //add attribute to attribute array
            }

            //generating actionschema of creature
            const action =  new ActionSchema( {name: parsedName, toHitBonus: attributes[0], range: attributes[1], primaryDamage: attributes[2], primaryDice: attributes[3]+"d"+attributes[4]+"+"+attributes[5] });
            ActionIdArray.push(action._id);//adding the corresponding action id
            this.localData.set(action._id, action); //storing the action schemas to an overall hashmap
        }
        
        return ActionIdArray;
    }

}


//parser.parseAction("<p><em><strong>Bite.</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 10 (1d10 + 5) piercing damage. </p><p><em><strong>Claw.</strong></em> <em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 12 (2d6 + 5) slashing damage.</p>");

//import jsonData from '../../data/srd_5e_monsters.json';

var dataall;
//var creatureData = new Map();
async function loadCreatures() {
    var parser = new Parser();
    const response = await fetch('../../data/srd_5e_monsters.json');
    dataall = await response.json();
    for (let index = 0; index < dataall.length; index++) {
        
        parser._monsterJsonToSchema(dataall[index]);
    }
    console.log(dataall);
    //console.log(parser);
}

/*
var parser2 = new Parser();
fetch("../../data/srd_5e_monsters.json")
    .then(function(resp){
        return resp.json();
    } )
    .then(function(data) {
        dataall = data;
        for (let index = 0; index < creatures.length; index++) {
        
            parser2._monsterJsonToSchema(data[index]);
        }

    });
*/
//loadCreatures();
//console.log(dataall);
//console.log(bruh);
//console.log(parserData.get(1));

//const jsonData= require('../../data/srd_5e_monsters.json'); 
//console.log(jsonData);
//var parser1 = new Parser();
//parser1.readJson();
//console.log(parser1.bruha);