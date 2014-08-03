var elasticsearch = require('elasticsearch');

var elastic = new elasticsearch.Client({
  host: 'http://plato.hackedu.us:9200',
  log: 'info'
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.generate = function(req, res){
  //generate here
  var entity = req.param('entity')
  var content = req.param('content')

  elastic.search({
    index: 'words',
    body: {
      query: {
        match: {
          topic: entity,
          word: content
        }
      }
    }
  }).then(function (err, resp) {
    if (err) {
      return;
    }

    var hits = resp.hits.hits;

    console.log(hits);

    //redirect to video
    var hash = 'foobar'
    var url = '/video/'+hash
    res.redirect(url)
  });
};

exports.video = function(req, res){
  var v = req.param('video')
  res.render('video', { video: v });
};
