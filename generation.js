var mongoose = require('mongoose');

var GenerationSchema = mongoose.Schema({
    created: {
    	type: Date,
    	default: new Date(0)
    },
    words: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Word'
    }]
});

module.exports = mongoose.model('Generation', GenerationSchema);