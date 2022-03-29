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