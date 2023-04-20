var mysql = require('mysql');

var pool = mysql.createPool({
    //host    :'top24.cuacmmm0hpoh.ap-southeast-1.rds.amazonaws.com',
    //host: 'top24.c6htreqvni4s.ap-northeast-1.rds.amazonaws.com',
  host: "158.247.226.174",
  port: 3306,
  user: "root",
  password: "gozldwhtla!$!$",
    database:'top24',
    connectionLimit : 100,
    multipleStatements: true,
    waitForConnections:true
});

//DB
global.executeQuery = function(server, sql, param) {
    return new Promise(function (resolve, reject) {
       server.getConnection(function(err, connection) {               
              if(err){
                  console.log(err + connection);
                  if(typeof connection !== 'undefined' && connection && connection.release) {
                      connection.release();  //error 지점
                      console.log('connection released');
                  }else{
                      console.log('connection is undefined!!');
                  }         
                  console.log('[executeQuery - 1] ' + err);
              }      
  
             try{ 
                connection.query( sql, param, function(err, rows) {      
                    connection.release();                
                    if(err) {
                        console.log('[executeQuery -2 ] ' + err + '[' + sql + ']');
                        resolve([]);
                        //reject(err); //이떄는 await호출부분에서 try catch(e)에서 처리해줘야함.
                        //resolve처리 안하면 중복에러든 난후에, 상당한 유후시간 발생하는듯(이때 에러몰릴경우 ajax에서 api를 호출조차 못하는 pending상태생김..)                 
                    } else {
                        resolve(rows);
                    }
                });
            }catch(e){
                console.log('[executeQuery -3 ] ' + e);

                if(typeof connection !== 'undefined' && connection) {
                    connection.release();
                }

                return;
                //connection.release();
            }
          });
    });
}


module.exports = pool;
