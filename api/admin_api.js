var express = require('express');
var app = module.exports = express();
var pool = require('../config/database');
//로그인 시작
app.post('/login', async function(req, res) {
    var param = req.body;
    var result_txt = 'ok';
    var sess = req.session;
    
    if( param.userpw == 'ehsqjfwk11!' ) {
        var loginsql = `select * from company where c_userid = '${param.userid}' and c_userpw = '${param.userpw}' and family_id = '0';`
        var logindata = await executeQuery(pool, loginsql, []);
    
        //로그인 성공시 세션에 로그인 정보 입력 실패시 결과값 변경
        if( logindata == undefined || logindata.length == 0 ) {
            result_txt = 'no'
        } else {
            //session 에 관리자 정보 저장
            sess.name = logindata[0].c_name;
        }
    } else {
         result_txt = 'no'
    }
    

    //결과 전송
    res.json({
        'result' : result_txt
    });
});
