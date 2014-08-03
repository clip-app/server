var mongoose    = require('mongoose');
var _           = require('underscore'); 
var Word        = require('../word');
var Generation  = require('../generation');

mongoose.connect("mongodb://plato.hackedu.us:27017", function () {
  console.log("connected to mongodb", arguments);
});

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
  var entity = req.param('entity');
  var word = req.param('word');
  Word
  .find()
  .where('topic').equals(entity)
  .where('word').equals(word)
  .exec(function (err, words) {
    if (err) {
      console.log(err);
      res.send(500, err);
    }
    var generation = new Generation({
      words: _.pluck(words, '_id'),
    });
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
    res.render('video', generation.toObject());
  });
};
