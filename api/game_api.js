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
  and min_std = '${req.body.min_std}'
  and write_date= '${req.body.write_date}'
  and hour = '${req.body.hour}'
  and min_idx = '${req.body.min_idx}'`;
  await executeQuery(pool, deletesql, []);

  var sql = `
  insert into faker ( item, min_std, write_date, hour, min, min_idx, todo_updown,pump_val,write_time ) values (
      '${req.body.item}',
      '${req.body.min_std}',
      '${req.body.write_date}',
      '${req.body.hour}',
      '${req.body.min}',
      '${req.body.min_idx}',
      '${req.body.todo_updown}','0.1', now()
  );`;
  await executeQuery(pool, sql, []);
  res.json('ok')
})

app.get('/remain_time', async (req, res) => {

    var min_std = 1;
    var min_std_2 = 2;
    var min_std_5 = 5;
    // var next_unixtime = mom_next.format('X'); //다음시간 구하기 위해 3분을 강제로 더해줌                    
    // var next_ddhh = mom_next.format('DD일 HH');
    //  var next_date = mom_next.format('YYYY-MM-DD');
    //  var next_hour = mom_next.hour();
    //  var next_minute = mom_next.minute();
    //  next_minute = digit(next_minute);


    var mom_next = getNextGameMoment(min_std , new moment());
    var mom_next_2 = getNextGameMoment(min_std_2 , new moment());
    var mom_next_5 = getNextGameMoment(min_std_5 , new moment());

    var cur_min_2 = mom_next_2.minute();
    var cur_min_5 = mom_next_5.minute();

    var cur_date2 = mom_next_2.format('YYYY-MM-DD');
    var cur_date5 = mom_next_5.format('YYYY-MM-DD');
    var cur_date = mom_next.format('YYYY-MM-DD');
    
    var cur_hour = mom_next.hour();
    var cur_min = mom_next.minute();

    var cur_hour_2 = mom_next_2.hour();
    var cur_min_2 = mom_next_2.minute();


    var cur_hour_5 = mom_next_5.hour();
    var cur_min_5 = mom_next_5.minute();


    var cur_min_idx = parseInt(cur_min / min_std);
    var cur_min_idx_2 = parseInt(cur_min_2 / min_std_2);
    var cur_min_idx_5 = parseInt(cur_min_5 / min_std_5);



    var now = new moment();
    var next = getNextGameMoment(min_std , now , new moment());
    var next2 = getNextGameMoment(min_std_2 , now , new moment());
    var next5 = getNextGameMoment(min_std_5 , now , new moment());
    
    // console.log(now.format('YYYY-MM-DD hh:mm:ss'))
    // console.log(next.format('YYYY-MM-DD hh:mm:ss'))
    //var total_second = moment.duration(next.diff(now)).asSeconds()

    var minute = moment.duration(next.diff(now)).minutes()
    var second = moment.duration(next.diff(now)).seconds()



    var minute2 = moment.duration(next2.diff(now)).minutes()
    var second2 = moment.duration(next2.diff(now)).seconds()


    var minute5 = moment.duration(next5.diff(now)).minutes()
    var second5 = moment.duration(next5.diff(now)).seconds()
   
    var total_second = minute * 60 + second;
    if(minute < 0 ) minute = 0;
    if(second < 0 ) second = 0;
    if(total_second < 0 ) total_second = 0;

    var cur_second = 60 - second;
    if( cur_second < 10 ) {
        cur_second = '0'+cur_second;
    }


    var total_second2 = minute2 * 60 + second2;
    if(minute < 0 ) minute2 = 0;
    if(second < 0 ) second2 = 0;
    if(total_second2 < 0 ) total_second2 = 0;

    var cur_second2 = 60 - second2;
    if( cur_second2 < 10 ) {
        cur_second2 = '0'+cur_second2;
    }


    var total_second5 = minute5 * 60 + second5;
    if(minute < 0 ) minute5 = 0;
    if(second < 0 ) second5 = 0;
    if(total_second5 < 0 ) total_second5 = 0;

    var cur_second5 = 60 - second5;
    if( cur_second5 < 10 ) {
        cur_second5 = '0'+cur_second5;
    }


    var next_open_time_format = cur_date + ' '  + cur_hour+ ':' + cur_min + ':' + cur_second;
    var next_game_time = cur_hour+ ':' + cur_min;

    var next_open_time_format2 = cur_date2 + ' '  + cur_hour_2+ ':' + cur_min_2 + ':' + cur_second2;
    var next_game_time2 = cur_hour_2+ ':' + cur_min_2;

    var next_open_time_format5 = cur_date5 + ' '  + cur_hour_5+ ':' + cur_min_5 + ':' + cur_second5;
    var next_game_time5 = cur_hour_5+ ':' + cur_min_5;

    
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

    var btcListSql = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='BTC/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
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

    var ethListSql = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='ETH/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
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

    var goldListSql = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GOLD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
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


    // //EURUSD
    var eurDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var eurDowndata = await executeQuery(pool, eurDownsql, []);


    var eurUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var eurUpdata = await executeQuery(pool, eurUpsql, []);

    var eurListSql = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='EUR/USD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var eurusdListdata = await executeQuery(pool, eurListSql, []);

    // var fakereurusdSql = `  select * from faker
    // where item ='EUR/USD'
    // and min_std = 1
    // and write_date= '${cur_date}'
    // and hour = ${cur_hour}
    // and min = ${cur_min_idx}
    // and min_idx = ${cur_min_idx}
    // ;`;
    // var fakereurusddata = await executeQuery(pool, fakereurusdSql, []);


    // //EURUSD2
    var eurDownsql2 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      and bet_type= 'D';`
    var eurDowndata2 = await executeQuery(pool, eurDownsql2, []);


    var eurUpsql2 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      and bet_type= 'U';`
    var eurUpdata2 = await executeQuery(pool, eurUpsql2, []);

    var eurListSql2 = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='EUR/USD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var eurusdListdata2 = await executeQuery(pool, eurListSql2, []);

     var fakereurusdSql2 = `  select * from faker
     where item ='EUR/USD'
     and min_std = 2
     and write_date= '${cur_date}'
     and hour = ${cur_hour_2}
     and min = ${cur_min_2}
     and min_idx = ${cur_min_idx_2}
     ;`;
     var fakereurusddata2 = await executeQuery(pool, fakereurusdSql2, []);


    //EURUSD5
    var eurDownsql5 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      and bet_type= 'D';`
    var eurDowndata5 = await executeQuery(pool, eurDownsql5, []);


    var eurUpsql5 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='EUR/USD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      and bet_type= 'U';`
    var eurUpdata5 = await executeQuery(pool, eurUpsql5, []);

    var eurListSql5 = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='EUR/USD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var eurusdListdata5 = await executeQuery(pool, eurListSql5, []);

    var fakereurusdSql5 = `  select * from faker
    where item ='EUR/USD'
    and min_std = 5
    and write_date= '${cur_date5}'
    and hour = ${cur_hour_5}
    and min = ${cur_min_5}
    and min_idx = ${cur_min_idx_5}
    ;`;
    var fakereurusddata5 = await executeQuery(pool, fakereurusdSql5, []);

    //GBPAUD 1
    var gbpaudDownsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'D';`
    var gbpaudDowndata = await executeQuery(pool, gbpaudDownsql, []);


    var gbpaudUpsql = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      and bet_type= 'U';`
    var gbpaudUpdata = await executeQuery(pool, gbpaudUpsql, []);

    var gbpaudListSql = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GBP/AUD'
      and min_std = 1
      and write_date= '${cur_date}'
      and hour = ${cur_hour}
      and min_idx = ${cur_min_idx}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var gbpaudListdata = await executeQuery(pool, gbpaudListSql, []);

    // var fakergbpaudSql = `  select * from faker
    // where item ='GBP/AUD'
    // and min_std = 1
    // and write_date= '${cur_date}'
    // and hour = ${cur_hour}
    // and min = ${cur_min}
    // and min_idx = ${cur_min_idx}
    // ;`;
    // var fakergbpauddata = await executeQuery(pool, fakergbpaudSql, []);


    //GBPAUD 2
    var gbpaudDownsql2 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      and bet_type= 'D';`
    var gbpaudDowndata2 = await executeQuery(pool, gbpaudDownsql2, []);


    var gbpaudUpsql2 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      and bet_type= 'U';`
    var gbpaudUpdata2 = await executeQuery(pool, gbpaudUpsql2, []);

    var gbpaudListSql2 = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GBP/AUD'
      and min_std = 2
      and write_date= '${cur_date2}'
      and hour = ${cur_hour_2}
      and min_idx = ${cur_min_idx_2}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var gbpaudListdata2 = await executeQuery(pool, gbpaudListSql2, []);

     var fakergbpaudSql2 = `  select * from faker
     where item ='GBP/AUD'
     and min_std = 2
     and write_date= '${cur_date}'
     and hour = ${cur_hour}
     and min = ${cur_min_2}
     and min_idx = ${cur_min_idx_2}
     ;`;
     var fakergbpauddata2 = await executeQuery(pool, fakergbpaudSql2, []);


    //GBPAUD 5
    var gbpaudDownsql5 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      and bet_type= 'D';`
    var gbpaudDowndata5 = await executeQuery(pool, gbpaudDownsql5, []);


    var gbpaudUpsql5 = `select ifnull(sum(bet_money),0) as bet_money from game_tx_view 
    where item ='GBP/AUD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      and bet_type= 'U';`
    var gbpaudUpdata5 = await executeQuery(pool, gbpaudUpsql5, []);

    var gbpaudListSql5 = `  select name,  a.min_std, c_name, ifnull(sum(bet_money),0) as bet_money, bet_type, b.cal_yn from game_tx_view a, user_view b
    where a.u_id = b.id
      and item ='GBP/AUD'
      and min_std = 5
      and write_date= '${cur_date5}'
      and hour = ${cur_hour_5}
      and min_idx = ${cur_min_idx_5}
      group by name,  a.min_std, c_name, bet_type, b.cal_yn
      order by ifnull(sum(bet_money),0) desc;`;
      
    var gbpaudListdata5 = await executeQuery(pool, gbpaudListSql5, []);

    var fakergbpaudSql5 = `  select * from faker
    where item ='GBP/AUD'
    and min_std = 5
    and write_date= '${cur_date5}'
    and hour = ${cur_hour_5}
    and min = ${cur_min_5}
    and min_idx = ${cur_min_idx_5}
    ;`;
    var fakergbpauddata5 = await executeQuery(pool, fakergbpaudSql5, []);

    res.json({
        next_date : next_open_time_format,
        next_time : next_game_time,

        next_date2 : next_open_time_format2,
        next_time2 : next_game_time2,
		
		next_date5 : next_open_time_format5,
        next_time5 : next_game_time5,

        hour : cur_hour,
        minute : cur_min , 
        second : second, 
        total_second: total_second, 

        min_idx : cur_min_idx, 
        game_date : cur_date,

        
        minute2 : cur_min_2 , 
        minute5 : cur_min_5 , 

        min_idx_2 : cur_min_idx_2, 
        min_idx_5 : cur_min_idx_5, 
        
        second2 : second2, 
        total_second2: total_second2, 
        
        second5 : second5, 
        total_second5: total_second5,

        
        btcdownmoney :btcDowndata[0].bet_money, 
        btcupmoney :btcUpdata[0].bet_money, 
        ethdownmoney :ethDowndata[0].bet_money, 
        ethupmoney :ethUpdata[0].bet_money, 
        golddownmoney :goldDowndata[0].bet_money, 
        goldupmoney :goldUpdata[0].bet_money,


        eurusddownmoney :eurDowndata[0].bet_money, 
        eurusdupmoney :eurUpdata[0].bet_money,

        eurusddownmoney2 :eurDowndata2[0].bet_money, 
        eurusdupmoney2 :eurUpdata2[0].bet_money,

        eurusddownmoney5 :eurDowndata5[0].bet_money, 
        eurusdupmoney5 :eurUpdata5[0].bet_money,

        gbpauddownmoney :gbpaudDowndata[0].bet_money, 
        gbpaudupmoney :gbpaudUpdata[0].bet_money,

        gbpauddownmoney2 :gbpaudDowndata2[0].bet_money, 
        gbpaudupmoney2 :gbpaudUpdata2[0].bet_money,

        gbpauddownmoney5 :gbpaudDowndata5[0].bet_money, 
        gbpaudupmoney5 :gbpaudUpdata5[0].bet_money,


        btcList : btcListdata,
        ethList : ethListdata,
        goldList : goldListdata,
        eurusdList : eurusdListdata,
        eurusdList2 : eurusdListdata2,
        eurusdList5 : eurusdListdata5,
        
        gbpaudList : gbpaudListdata,
        gbpaudList2 : gbpaudListdata2,
        gbpaudList5 : gbpaudListdata5,


        fakerbtc :fakerbtcdata,
        fakereth :fakerethdata,
        fakergold :fakergolddata,
        // fakereurusd :fakereurusddata,
        fakereurusd2 :fakereurusddata2,
        fakereurusd5 :fakereurusddata5,
        
        // fakergbpaud :fakergbpauddata,
        fakergbpaud2 :fakergbpauddata2,
        fakergbpaud5 :fakergbpauddata5
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


