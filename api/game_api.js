var express = require('express');
var app = module.exports = express();
var pool = require('../config/database');
const moment = require('moment');

app.get('/time/second', async (req, res) => {
    var result = moment().format("ss");
    res.json(result)
})

app.post('/insertFaker', async (req, res) => {

  var deletesql = `
  delete from faker 
  where item ='${req.body.item}'
  and min_std = 1
  and write_date= '${req.body.write_date}'
  and hour = '${req.body.hour}'
  and min_idx = '${req.body.min_idx}'`;
  await executeQuery(pool, deletesql, []);

  var sql = `
  insert into faker ( item, min_std, write_date, hour, min, min_idx, todo_updown,pump_val ) values (
      '${req.body.item}',
      '${req.body.min_std}',
      '${req.body.write_date}',
      '${req.body.hour}',
      '${req.body.min_idx}',
      '${req.body.min_idx}',
      '${req.body.todo_updown}','0.1'
  );`;
  await executeQuery(pool, sql, []);
  res.json('ok')
})

app.get('/remain_time', async (req, res) => {

    var min_std = 1;
    // var next_unixtime = mom_next.format('X'); //다음시간 구하기 위해 3분을 강제로 더해줌                    
    // var next_ddhh = mom_next.format('DD일 HH');
    //  var next_date = mom_next.format('YYYY-MM-DD');
    //  var next_hour = mom_next.hour();
    //  var next_minute = mom_next.minute();
    //  next_minute = digit(next_minute);


    var mom_next = getNextGameMoment(min_std , new moment());

    var cur_date = mom_next.format('YYYY-MM-DD');
    var cur_hour = mom_next.hour();
    var cur_min = mom_next.minute();
    var cur_min_idx = parseInt(cur_min / min_std);



    var now = new moment();
    var next = getNextGameMoment(min_std , now , new moment());
    
    // console.log(now.format('YYYY-MM-DD hh:mm:ss'))
   // console.log(next.format('YYYY-MM-DD hh:mm:ss'))
    //var total_second = moment.duration(next.diff(now)).asSeconds()

    var minute = moment.duration(next.diff(now)).minutes()
    var second = moment.duration(next.diff(now)).seconds()
   
    var total_second = minute * 60 + second;
    if(minute < 0 ) minute = 0;
    if(second < 0 ) second = 0;
    if(total_second < 0 ) total_second = 0;

    var cur_second = 60 - second;
    if( cur_second < 10 ) {
        cur_second = '0'+cur_second;
    }
    var next_open_time_format = cur_date + ' '  + cur_hour+ ':' + cur_min + ':' + cur_second;
    
    var next_game_time = cur_hour+ ':' + cur_min;

    //BIT
    var btcDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='BTC/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var btcDowndata = await executeQuery(pool, btcDownsql, []);


    var btcUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='BTC/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var btcUpdata = await executeQuery(pool, btcUpsql, []);

    var btcListSql = `  select name, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='BTC/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var btcListdata = await executeQuery(pool, btcListSql, []);

    var fakerbtcSql = `      select * from faker
    where item ='BTC/USD'
    and min_std = 1
    and write_date= '${cur_date}'
    and hour = ${cur_hour}
    and min = ${cur_min_idx}
    and min_idx = ${cur_min_idx}
    ;`;
    var fakerbtcdata = await executeQuery(pool, fakerbtcSql, []);

    //ETH
    var ethDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='ETH/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var ethDowndata = await executeQuery(pool, ethDownsql, []);


    var ethUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='ETH/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var ethUpdata = await executeQuery(pool, ethUpsql, []);

    var ethListSql = `  select name, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='ETH/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var ethListdata = await executeQuery(pool, ethListSql, []);

    var fakerethSql = `      select * from faker
    where item ='ETH/USD'
    and min_std = 1
    and write_date= '${cur_date}'
    and hour = ${cur_hour}
    and min = ${cur_min_idx}
    and min_idx = ${cur_min_idx}
    ;`;
    var fakerethdata = await executeQuery(pool, fakerethSql, []);

    //GOLD
    var goldDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GOLD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var goldDowndata = await executeQuery(pool, goldDownsql, []);


    var goldUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GOLD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var goldUpdata = await executeQuery(pool, goldUpsql, []);

    var goldListSql = `  select name, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GOLD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var goldListdata = await executeQuery(pool, goldListSql, []);

    var fakergoldSql = `      select * from faker
    where item ='GOLD'
    and min_std = 1
    and write_date= '${cur_date}'
    and hour = ${cur_hour}
    and min = ${cur_min_idx}
    and min_idx = ${cur_min_idx}
    ;`;
    var fakergolddata = await executeQuery(pool, fakergoldSql, []);


    //GBP
    var gbpDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var gbpDowndata = await executeQuery(pool, gbpDownsql, []);


    var gbpUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var gbpUpdata = await executeQuery(pool, gbpUpsql, []);

    var gbpListSql = `  select name, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var gbpListdata = await executeQuery(pool, gbpListSql, []);

    var fakergbpSql = `      select * from faker
    where item ='GBP/AUD'
    and min_std = 1
    and write_date= '${cur_date}'
    and hour = ${cur_hour}
    and min = ${cur_min_idx}
    and min_idx = ${cur_min_idx}
    ;`;
    var fakergbpdata = await executeQuery(pool, fakergbpSql, []);

    //NAS
    var nasDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='NAS100'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var nasDowndata = await executeQuery(pool, nasDownsql, []);


    var nasUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='NAS100'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var nasUpdata = await executeQuery(pool, nasUpsql, []);

    var nasListSql = `  select name, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='NAS100'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var nasListdata = await executeQuery(pool, nasListSql, []);

    var fakernasSql = `      select * from faker
    where item ='NAS100'
    and min_std = 1
    and write_date= '${cur_date}'
    and hour = ${cur_hour}
    and min = ${cur_min_idx}
    and min_idx = ${cur_min_idx}
    ;`;
    var fakernasdata = await executeQuery(pool, fakernasSql, []);

    res.json({
        next_date : next_open_time_format,
        next_time : next_game_time, 
        hour : cur_hour,
        minute : cur_min , 
        second : second, 
        total_second: total_second, 
        min_idx : cur_min_idx, 
        game_date : cur_date,
        
        btcdownmoney :btcDowndata[0].bet_money, 
        btcupmoney :btcUpdata[0].bet_money, 
        ethdownmoney :ethDowndata[0].bet_money, 
        ethupmoney :ethUpdata[0].bet_money, 
        golddownmoney :goldDowndata[0].bet_money, 
        goldupmoney :goldUpdata[0].bet_money,

        gbpdownmoney :gbpDowndata[0].bet_money, 
        gbpupmoney :gbpUpdata[0].bet_money,

        nasdownmoney :nasDowndata[0].bet_money, 
        nasupmoney :nasUpdata[0].bet_money,


        btcList : btcListdata,
        ethList : ethListdata,
        goldList : goldListdata,
        gbpList : gbpListdata,
        nasList : nasListdata,

        fakerbtc :fakerbtcdata,
        fakereth :fakerethdata,
        fakergold :fakergolddata,
        fakergbp :fakergbpdata,
        fakernas :fakernasdata
    });
})

 
 function makeFakeNewData(data, min_std){
    var last = data[0];    
    var mom_last =  moment(last.open_time);       
    
    //현재시간측정                    
    var makeNewFakeData = false;
    var mom_now = new moment().seconds(0);//!! 0초로 고정    
    var min_mod = parseInt(mom_now.minute() / min_std) * min_std ; //현재시간기준 3분단위 첫 min 구함
    mom_now.minute(min_mod); //현재 시간 기준 진행중인 3분단위 시간 구해짐.
 

    // conole.log(mom_now.format('YYYY-MM-DD hh:mm:ss'))
    // console.log(mom_last.format('YYYY-MM-DD hh:mm:ss'))
    
    var diff_min  = mom_last.diff(mom_now, 'minutes');
 
    //console.log('diff_min : ' + diff_min)
    if (diff_min < 0) {
        //마지막시간이 현재보다 이전시간이라면 아직 새데이터를 못받은거                      
        makeNewFakeData = true;
    }else if(diff_min == 0){//현재 시간값이 history에 있는경우 PASS
         makeNewFakeData = false; 
    } else {//현재시간보다 앞선데이터가 있는경우로 에러
        console.log('[ERROR?] mom_last > mom_now') //                      
    } 
    
    if(makeNewFakeData){     
         //var mom_now = mom_now.add(3,'minutes'); //초는 0으로고정, 현재시간에 3분을 더해준다.                     
         var now_ddhh = mom_now.format('DD일 HH');
         var now_hour = mom_now.hour(); 
         now_hour = (now_hour < 10) ? ('0' + now_hour) :now_hour
         var now_minute = mom_now.minute(); 
         now_minute = (now_minute < 10) ? ('0' + now_minute) :now_minute
         var now_open_time_format = now_ddhh + ':' + now_minute;                  


        //  var time =  parseInt(((parseInt(mom_now.format('x')) + 32400000) / 1000).toFixed(0))
        // console.log(time)
         // , ROUND((open_time + 32400000) / 1000 )   as time 
        data.unshift({ updown : 100, open_time : parseInt(mom_now.format('x')), open_time_format : now_open_time_format, open_format : ''
                    , hour : now_hour , min : now_minute
                })                   

        //time : time,
    }

    return data;
}



function checkSession(req, res){
    var sess = req.session;  
    return typeof sess.userid !='undefined' && sess.userid != null && sess.userid != '' 
}




function getNextGameMoment(min_std , now_mom ){
    //var now = now_mom;
    var now_min = now_mom.minutes(); //59
    var remain = now_min % min_std; // 59 % 5 (5분단위일경우) => 나머지 4
    
    
    var next = new moment();
    next.seconds(0);
    //console.log( min_std, remain , parseInt(min_std - remain));
    next = next.add(  parseInt(min_std - remain), 'minutes') ;  // 59에서 4를 뺀후 (55) => 다시 5(min_std)를 더하면 다음 게임시간 구해짐
    
    return next;
}


