var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session;
  var c_name = "";
	if(sess != undefined && sess.name != undefined && sess.name != ''){
    //화면에 필요한 정보 세션에서 넣기
    c_name = sess.name;
    res.render('index', { title: c_name });
  } else {
    res.clearCookie('im24faker@!@#'); // 세션 쿠키 삭제
    res.redirect('/login');
  }
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
