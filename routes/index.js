
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

  //redirect to video
  var hash = 'foobar'
  var url = '/video/'+hash
  res.redirect(url)
};

exports.video = function(req, res){
  var v = req.param('video')
  res.render('video', { video: v });
};