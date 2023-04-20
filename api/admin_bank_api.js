var express = require('express');
var app = module.exports = express();
var pool = require('../config/database');



//실시간 정산금 리스트 
app.post('/company_bank_list', async function(req, res) {
    var param = req.body;
    var sess = req.session;
    var listdata;
    var listsql = ""
    if(sess.name != undefined && sess.name != ''){
        if( sess.grade_id == '1' ) {
            listsql =  `select * ,
            DATE_FORMAT(req_date, '%Y-%m-%d %H:%i:%s') as req_date_origin ,
            DATE_FORMAT(confirm_date, '%Y-%m-%d %H:%i:%s') as confirm_date_origin ,
            DATE_FORMAT(DATE_ADD(req_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as req_date_9 ,
            DATE_FORMAT(DATE_ADD(confirm_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as confirm_date_9 
            from company_bank cb, company_view cv
            where cb.c_id = cv.c_id

            and cb.req_date > '20210229'
            order by status asc, req_date desc, confirm_date desc;`;    
        } else {
            if( sess.depth == '1' ) {
                listsql =  `select * ,
                DATE_FORMAT(req_date, '%Y-%m-%d %H:%i:%s') as req_date_origin ,
                DATE_FORMAT(confirm_date, '%Y-%m-%d %H:%i:%s') as confirm_date_origin ,
                DATE_FORMAT(DATE_ADD(req_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as req_date_9 ,
                DATE_FORMAT(DATE_ADD(confirm_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as confirm_date_9 
                from company_bank cb, company_view cv
                where cb.c_id = cv.c_id
                    and cv.family_id = '${sess.family_id}'
                    and cv.depth >= '${sess.depth}'
                    and cb.req_date > '20210229'
                order by req_date desc, confirm_date desc;`;
            } else {
                listsql =  `select * ,
                DATE_FORMAT(req_date, '%Y-%m-%d %H:%i:%s') as req_date_origin ,
                DATE_FORMAT(confirm_date, '%Y-%m-%d %H:%i:%s') as confirm_date_origin ,
                DATE_FORMAT(DATE_ADD(req_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as req_date_9 ,
                DATE_FORMAT(DATE_ADD(confirm_date, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') as confirm_date_9 
                from company_bank cb, company_view cv
                where cb.c_id = cv.c_id
                and cv.family_id = '${sess.family_id}'
                and cv.depth >= '${sess.depth}'
                and cv.brother like concat('%','${sess.brother}','%')
                and cb.req_date > '20210229'
                order by req_date desc, confirm_date desc;`;
            }
        }
        listdata = await executeQuery(pool, listsql, []);
    } else {
        listdata = null;
    }

    //결과 전송
    res.json({
        'result' : listdata
    });
});


app.post('/incomeInsert', async function(req, res) {
    var param = req.body;
    var result_txt = 'ok';
    var sess = req.session;

    if(sess.name == undefined || sess.name == ''){
        result_txt = 'session';
    } else {
        //입력시작
        var myPointsql = `
                select '1' as gubun, c_id, sum(today_money) as money from company_daily_bank where c_id = '${sess.c_id}'
                union all
                select '2' as gubun, ifnull(c_id,'${sess.c_id}') as c_id, 
                ifnull(SUM(
                CASE 
                WHEN c_money_option = '1' THEN c_money 
                WHEN c_money_option = '2' THEN concat('-',c_money)  
                ELSE 0 END
                ),0) AS money 
                from company_bank where c_id = '${sess.c_id}' and status = '3'
                union all
                select '3' as gubun, ifnull(c_id,'${sess.c_id}') as c_id, 
                ifnull(SUM(
                CASE 
                WHEN c_money_option = '3' THEN c_money
                WHEN c_money_option = '4' THEN concat('-',c_money) 
                ELSE 0 END
                ),0) AS money 
                from company_bank where c_id = '${sess.c_id}' and status = '3';
        `;
        var myPointData = await executeQuery(pool, myPointsql, []);
        var ready_money = 0;
        var bank_money = 0;
        var bank_manual_money = 0;
        if( myPointData != undefined && myPointData.length > 0 ) {
            myPointData.forEach(element => {
                if(element.gubun == '1') {
                    if( element.money != undefined ) {
                        ready_money = element.money;
                    }
                } else if(element.gubun == '2') {
                    if( element.money != undefined ) {
                        bank_money = element.money;
                    }
                } else if(element.gubun == '3') {
                    if( element.money != undefined ) {
                        bank_manual_money = element.money;
                    }
                }
            });
        }
        //현재 보유금
        var myMoney = bank_money + bank_manual_money;

        if( req.body.money_option == '2' ) {
            if( parseFloat(myMoney) < req.body.money ) {
                result_txt = 'money';
            } else {
                var sql = `
                insert into company_bank ( c_id, c_money, coin_addr, coin_destination_code, c_coin, c_money_option, status, req_date ) values (
                    '${sess.c_id}',
                    '${req.body.money}',
                    '${req.body.wallet}',
                    '${req.body.destination_code}',
                    '${req.body.coin}',
                    '${req.body.money_option}',
                    '1',
                    now()
                );
                `;
                var data = await executeQuery(pool, sql, []);
                
                var alertsql = `insert into alert ( alert_id, msg, place, gubun,check_yn, writedate ) values (
                    '${data.insertId}','${sess.name}님 신청', '환전', '2', 'N', now() 
                )`
                await executeQuery(pool, alertsql, []);
            }
        } else {
            var sql = `
            insert into company_bank ( c_id, c_money, coin_addr, coin_destination_code, c_coin, c_money_option, status, req_date ) values (
                '${sess.c_id}',
                '${req.body.money}',
                '${req.body.wallet}',
                '${req.body.destination_code}',
                '${req.body.coin}',
                '${req.body.money_option}',
                '1',
                now()
            );
            `;
            var data = await executeQuery(pool, sql, []);
            var alertsql = `insert into alert ( alert_id, msg, place, gubun,check_yn, writedate ) values (
                '${data.insertId}','${sess.name}님 신청', '충전', '2','N', now() 
            )`
            await executeQuery(pool, alertsql, []);
        }

        
    }

    //결과 전송
    res.json({
        'result' : result_txt
    });
});



app.post('/incomeInsert_admin', async function(req, res) {
    var param = req.body;
    var result_txt = 'ok';
    var sess = req.session;
    var c_id = param.c_id;
    if(sess.name == undefined || sess.name == ''){
        result_txt = 'session';
    } else {
        //입력시작
        var myPointsql = `
                select '1' as gubun, c_id, sum(today_money) as money from company_daily_bank where c_id = '${param.c_id}'
                union all
                select '2' as gubun, ifnull(c_id,'${param.c_id}') as c_id, 
                ifnull(SUM(
                CASE 
                WHEN c_money_option = '1' THEN c_money 
                WHEN c_money_option = '2' THEN concat('-',c_money)  
                ELSE 0 END
                ),0) AS money 
                from company_bank where c_id = '${param.c_id}' and status = '3'
                union all
                select '3' as gubun, ifnull(c_id,'${param.c_id}') as c_id, 
                ifnull(SUM(
                CASE 
                WHEN c_money_option = '3' THEN c_money
                WHEN c_money_option = '4' THEN concat('-',c_money) 
                ELSE 0 END
                ),0) AS money 
                from company_bank where c_id = '${param.c_id}' and status = '3';
        `;
        var myPointData = await executeQuery(pool, myPointsql, []);
        var ready_money = 0;
        var bank_money = 0;
        var bank_manual_money = 0;
        if( myPointData != undefined && myPointData.length > 0 ) {
            myPointData.forEach(element => {
                if(element.gubun == '1') {
                    if( element.money != undefined ) {
                        ready_money = element.money;
                    }
                } else if(element.gubun == '2') {
                    if( element.money != undefined ) {
                        bank_money = element.money;
                    }
                } else if(element.gubun == '3') {
                    if( element.money != undefined ) {
                        bank_manual_money = element.money;
                    }
                }
            });
        }
        //현재 보유금
        var myMoney = bank_money + bank_manual_money;

        if( req.body.money_option == '4' ) {
            if( parseFloat(myMoney) < req.body.money ) {
                result_txt = 'money';
            } else {
                var sql = `
                insert into company_bank ( c_id, c_money, coin_addr, coin_destination_code, c_coin, c_money_option, status, req_date, confirm_date ) values (
                    '${param.c_id}',
                    '${req.body.money}',
                    '${req.body.wallet}',
                    '${req.body.destination_code}',
                    '${req.body.coin}',
                    '${req.body.money_option}',
                    '3',
                    now(),
                    now()
                );
                `;
                var data = await executeQuery(pool, sql, []);
            }
        } else {
            var sql = `
            insert into company_bank ( c_id, c_money, coin_addr, coin_destination_code, c_coin, c_money_option, status, req_date, confirm_date ) values (
                '${param.c_id}',
                '${req.body.money}',
                '${req.body.wallet}',
                '${req.body.destination_code}',
                '${req.body.coin}',
                '${req.body.money_option}',
                '3',
                now(),
                now()
            );
            `;
            var data = await executeQuery(pool, sql, []);
        }
    }

    //결과 전송
    res.json({
        'result' : result_txt
    });
});

app.post('/process_bank', async function(req, res) {
    var param = req.body;
    var result_txt = 'ok';
    var sess = req.session;

    if(sess.name == undefined || sess.name == ''){
        result_txt = 'session';
    } else {
        //입력시작
        var sql = `
        update company_bank set status ='${req.body.status}', confirm_date=now() where id = '${req.body.id}'`;
        var data = await executeQuery(pool, sql, []);
    }

    //결과 전송
    res.json({
        'result' : result_txt
    });
});


//실시간 정산금 리스트 
app.post('/company_bank_info', async function(req, res) {
    var param = req.body;
    var sess = req.session;
    var listdata;
    var listsql = ""
    if(sess.name != undefined && sess.name != ''){
        if( sess.grade_id == '1' ) {
            listsql =  `select 1 as gubun, c_id, sum(today_money) as money from company_daily_bank where c_id = '${sess.c_id}'
            union all
            select 2 as gubun, c_id, 
            SUM(
            CASE 
            WHEN c_money_option = '1' THEN c_money 
            WHEN c_money_option = '2' THEN concat('-',c_money) 
            WHEN c_money_option = '3' THEN c_money 
            WHEN c_money_option = '4' THEN concat('-',c_money) 
            ELSE 0 END
            ) AS money 
            from company_bank where c_id = '${sess.c_id}' and status = '3';`;    
        } else {
            listsql =  `select '1' as gubun, c_id, sum(today_money) as money from company_daily_bank where c_id = '${sess.c_id}'
            union all
            select '2' as gubun, ifnull(c_id,'${sess.c_id}') as c_id, 
            ifnull(SUM(
            CASE 
            WHEN c_money_option = '1' THEN c_money 
            WHEN c_money_option = '2' THEN concat('-',c_money)  
            ELSE 0 END
            ),0) AS money 
            from company_bank where c_id = '${sess.c_id}' and status = '3'
            union all
            select '3' as gubun, ifnull(c_id,'${sess.c_id}') as c_id, 
            ifnull(SUM(
            CASE 
            WHEN c_money_option = '3' THEN c_money
            WHEN c_money_option = '4' THEN concat('-',c_money) 
            ELSE 0 END
            ),0) AS money 
            from company_bank where c_id = '${sess.c_id}' and status = '3'`;  
        }
        listdata = await executeQuery(pool, listsql, []);
    } else {
        listdata = null;
    }

    //결과 전송
    res.json({
        'result' : listdata
    });
});
