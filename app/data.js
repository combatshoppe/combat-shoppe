var mongoose = require('mongoose');

// define a generic statblocks model
function AbstractStatSchema() {
	// call super
	Schema.apply(this, arguments);
	// add
	this.add({
		name: {type: String, default: ''},
		description: {type: String, default: '', required: false},
		id: {type: String}
	});
};
util.inherits(AbstractStatblockSchema, Schema);

// define a second abstract statblocks model
var AbstractCreatureSchema = new AbstractStatblockSchema();
AbstractCreatureSchema.add({
  int: {type: Number, required: true},
	wis: {type: Number, required: true},
	cha: {type: Number, required: true},
	dex: {type: Number, required: true},
	str: {type: Number, required: true},
	con: {type: Number, required: true}
});

// create a PCSchema based off the AbstractCreatureSchema
var MonsterSchema = new AbstractCreatureSchema();
MonsterSchema.add({
  level: {type: Number, required: true}
});

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Monster', MonsterSchema);
