var mongoose    = require('mongoose');
var async       = require('async');
var _           = require('underscore'); 
var Word        = require('../word');
var Generation  = require('../generation');

if (process.env.DB_PORT_27017_TCP_ADDR) {
  mongoose.connect("mongodb://"+process.env.DB_PORT_27017_TCP_ADDR+":"+process.env.DB_PORT_27017_TCP_PORT, function () {
    console.log("connected to mongodb", arguments);
  });
} else {
  mongoose.connect("mongodb://plato.hackedu.us:27017", function () {
    console.log("connected to mongodb", arguments);
  });
}

mongoose.set('debug', true);

exports.index = function(req, res) {
  res.render('index');
};

exports.train = function(req, res) {
  Word
  .findOne()
  .where('topic').equals(req.param('topic'))
  .exec(function(err, word) {
    if (err) return res.send(500, err);
    if (_.isEmpty(word)) return res.send(404, "No topic found lol");
    res.render('train', word);
  });
};

exports.generate = function(req, res) {
  // generate here
  var topic = req.param('topic');
  var body = req.param('body');
  var words = body.split(' ');

  async.map(words, function (word, callback) {
    word = word.toLowerCase().replace(".","").replace("!","").replace(",","");
    Word
    .findOne()
    .where('topic').equals(topic)
    .where('word').equals(word)
    .exec(function (err, doc) {
      if (err) return callback(err);
      if (!doc) {
        Word
        .findOne()
        .where('word').equals('ummXXX')
        .exec(callback);
      } else {
        callback(null, doc);
      }
    });
  }, function done(err, words) {
    if (err) {
      console.log(err);
      res.send(500, err);
    }
    console.log(words);
    var generation = new Generation({
      words: _.pluck(words, '_id'),
    });
    console.log(generation);
    generation.save(function (err) {
      if (err) {
        return res.send(500, err);
      }
      res.redirect('/' + generation._id);
    });
  });
};

exports.generation = function(req, res) {
  var generation_id = req.param('generation_id');
  console.log(req.params);
  Generation
  .findById(generation_id)
  .populate('words')
  .exec(function (err, generation) {
    if (err) {
      return res.send(500, err);
    }
    if (!generation) {
      return res.render('404');
    }
    console.log(generation.words.toObject());
    res.render('video', {
      words: JSON.stringify(generation.words.toObject()),
      gen_id: generation._id
    });
  });
};
