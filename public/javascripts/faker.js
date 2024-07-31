
var item = "";
var hour =  "";
var writedate = "";
var min = "";
var tx_min = "";
var data_min = 0;
var data_min_2 = 0;
var data_min_5 = 0;

var i = 0;
$(document).ready(function() {
    
    setInterval(() => {
        eventGetTxdata();
        i++; 
      }, 1000);
});

/******************************************************* */
function eventGetTxdata() {
    $.ajax({
        method: 'GET',
        url: '/game_api/remain_time',
        cache: false,
        async: true,
        data: {
        },
        success: function (data) {

            //console.log(data);

            hour = data.hour;
            min = data.minute;
            tx_min = data.minute;
            writedate = data.game_date;
            min_idx = data.cur_min_idx;

            data_min = data.minute;
            data_min_2 = data.minute2;
            data_min_5 = data.minute5;
           
            $('#nexttime').html('');
            $('#nextsecond').html('');

            $('#btcuptxt').html('');
            $('#btcdowntxt').html('');

            $('#ethuptxt').html('');
            $('#ethdowntxt').html('');

            $('#golduptxt').html('');
            $('#golddowntxt').html('');

            
            $('#eurgdpuptxt').html('');
            $('#eurgdpdowntxt').html('');

            $('#eurgdpup2txt').html('');
            $('#eurgdpdown2txt').html('');


            $('#eurgdpup5txt').html('');
            $('#eurgdpdown5txt').html('');

            $('#gbpauduptxt').html('');
            $('#gbpaudpdowntxt').html('');

            $('#gbpauduptxt2').html('');
            $('#gbpaudpdowntxt2').html('');

            $('#gbpauduptxt5').html('');
            $('#gbpaudpdowntxt5').html('');


            $('#btcbody').html('');
            $('#ethbody').html('');
            $('#goldbody').html('');

            $('#eurgdpbody').html('');
            $('#eurgdp2body').html('');
            $('#eurgdp5body').html('');

            $('#gbpaudbody').html('');
            $('#gbpaudbody2').html('');
            $('#gbpaudbody5').html('')
            
            $('#btcfakertxt').html('');
            $('#ethfakertxt').html('');
            $('#goldfakertxt').html('');
            
            $('#eurgdp1mfakertxt').html('');
            $('#eurgdp2mfakertxt').html('');
            $('#eurgdp5mfakertxt').html('');

            $('#gbpaudfakertxt').html('');
            $('#gbpaudfakertxt2').html('');
            $('#gbpaudfakertxt5').html('');

            $('#goldfakertxt').css('color', '#fff');
            $('#ethfakertxt').css('color', '#fff');
            $('#btcfakertxt').css('color', '#fff');

            $('#eurgdp1mfakertxt').css('color', '#fff');
            $('#eurgdp2mfakertxt').css('color', '#fff');
            $('#eurgdp5mfakertxt').css('color', '#fff');


            $('#gbpaudfakertxt').css('color', '#fff');
            $('#gbpaudfakertxt2').css('color', '#fff');
            $('#gbpaudfakertxt5').css('color', '#fff');



            $('#nexttime').html(data.next_time);
            $('#nextsecond').html(data.second);

            $('#nexttime5').html(data.next_time5);
            $('#nextsecond5').html(data.total_second5);


            $('#nexttime2').html(data.next_time2);
            $('#nextsecond2').html(data.total_second2);


            $('#btcuptxt').html(currencyFormat(data.btcupmoney)+'원');
            $('#btcdowntxt').html(currencyFormat(data.btcdownmoney)+'원');

            $('#ethuptxt').html(currencyFormat(data.ethupmoney)+'원');
            $('#ethdowntxt').html(currencyFormat(data.ethdownmoney)+'원');

            $('#golduptxt').html(currencyFormat(data.goldupmoney)+'원');
            $('#golddowntxt').html(currencyFormat(data.golddownmoney)+'원');

            // $('#eurgdpuptxt').html(currencyFormat(data.eurusdupmoney)+'원');
            // $('#eurgdpdowntxt').html(currencyFormat(data.eurusddownmoney)+'원');

            $('#eurgdpup2txt').html(currencyFormat(data.eurusdupmoney2)+'원');
            $('#eurgdpdown2txt').html(currencyFormat(data.eurusddownmoney2)+'원');

            $('#eurgdpup5txt').html(currencyFormat( parseInt(data.eurusdupmoney) +parseInt(data.eurusdupmoney2) + parseInt(data.eurusdupmoney5) )+'원');
            $('#eurgdpdown5txt').html(currencyFormat(  parseInt(data.eurusddownmoney) +parseInt(data.eurusddownmoney2) + parseInt(data.eurusddownmoney5)  )+'원');

            
            // $('#gbpauduptxt').html(currencyFormat(data.gbpaudupmoney)+'원');
            // $('#gbpaudpdowntxt').html(currencyFormat(data.gbpauddownmoney)+'원');

            
             $('#gbpauduptxt2').html(currencyFormat(data.gbpaudupmoney2)+'원');
             $('#gbpaudpdowntxt2').html(currencyFormat(data.gbpauddownmoney2)+'원');

            
            $('#gbpauduptxt5').html(currencyFormat(parseInt(data.gbpaudupmoney) +parseInt(data.gbpaudupmoney2) + parseInt(data.gbpaudupmoney5))+'원');
            $('#gbpaudpdowntxt5').html(currencyFormat(parseInt(data.gbpauddownmoney) +parseInt(data.gbpauddownmoney2) + parseInt(data.gbpauddownmoney5))+'원');


            if( data.btcList != undefined && data.btcList.length > 0 ) {
                var btcHTML = createList(data.btcList);
                $('#btcbody').html(btcHTML);
            } 

            if( data.ethList != undefined && data.ethList.length > 0 ) {
                var ethHTML = createList(data.ethList);
                $('#ethbody').html(ethHTML);
            } 

            if( data.goldList != undefined && data.goldList.length > 0 ) {
                var goldHTML = createList(data.goldList);
                $('#goldbody').html(goldHTML);
            } 

            if( data.eurusdList != undefined && data.eurusdList.length > 0 ) {
                var eurusdHTML = createList(data.eurusdList);
                $('#eurgdp5body').append(eurusdHTML);
            } 

            if( data.eurusdList2 != undefined && data.eurusdList2.length > 0 ) {
                var eurusdHTML = createList(data.eurusdList2);
                $('#eurgdp2body').append(eurusdHTML);
            } 

            if( data.eurusdList5 != undefined && data.eurusdList5.length > 0 ) {
                var eurusdHTML = createList(data.eurusdList5);
                $('#eurgdp5body').append(eurusdHTML);
            } 


            if( data.gbpaudList != undefined && data.gbpaudList.length > 0 ) {
                var gbpaudHTML = createList(data.gbpaudList);
                $('#gbpaudbody5').append(gbpaudHTML);
            } 

            if( data.gbpaudList2 != undefined && data.gbpaudList2.length > 0 ) {
                var gbpaudHTML = createList(data.gbpaudList2);
                $('#gbpaudbody2').append(gbpaudHTML);
            } 


            if( data.gbpaudList5 != undefined && data.gbpaudList5.length > 0 ) {
                var gbpaudHTML = createList(data.gbpaudList5);
                $('#gbpaudbody5').append(gbpaudHTML);
            } 

//
            if( data.fakerbtc != undefined && data.fakerbtc.length > 0 ) {
                if( data.fakerbtc[0].todo_updown == 'U') {
                    $('#btcfakertxt').css('color', 'red');
                    $('#btcfakertxt').html('상승처리');
                } else if( data.fakerbtc[0].todo_updown == 'D') {
                    $('#btcfakertxt').css('color', 'blue');
                    $('#btcfakertxt').html('하락처리');
                }
                
            } 

            if( data.fakereth != undefined && data.fakereth.length > 0 ) {
                $('#ethfakertxt').html('');
                if( data.fakereth[0].todo_updown == 'U') {
                    $('#ethfakertxt').css('color', 'red');
                    $('#ethfakertxt').html('상승처리');
                } else if( data.fakereth[0].todo_updown == 'D') {
                    $('#ethfakertxt').css('color', 'blue');
                    $('#ethfakertxt').html('하락처리');
                }
            } 

            if( data.fakergold != undefined && data.fakergold.length > 0 ) {
                $('#goldfakertxt').html('');
                if( data.fakergold[0].todo_updown == 'U') {
                    $('#goldfakertxt').css('color', 'red');
                    $('#goldfakertxt').html('상승처리');
                } else if( data.fakergold[0].todo_updown == 'D') {
                    $('#goldfakertxt').css('color', 'blue');
                    $('#goldfakertxt').html('하락처리');
                }
            } 


            // if( data.fakereurusd != undefined && data.fakereurusd.length > 0 ) {
            //     $('#eurgdp1mfakertxt').html('');
            //     if( data.fakereurusd[0].todo_updown == 'U') {
            //         $('#eurgdp1mfakertxt').css('color', 'red');
            //         $('#eurgdp1mfakertxt').html('상승처리');
            //     } else if( data.fakereurusd[0].todo_updown == 'D') {
            //         $('#eurgdp1mfakertxt').css('color', 'blue');
            //         $('#eurgdp1mfakertxt').html('하락처리');
            //     }
            // } 

             if( data.fakereurusd2 != undefined && data.fakereurusd2.length > 0 ) {
                 $('#eurgdp2mfakertxt').html('');
                 if( data.fakereurusd2[0].todo_updown == 'U') {
                     $('#eurgdp2mfakertxt').css('color', 'red');
                     $('#eurgdp2mfakertxt').html('상승처리');
                 } else if( data.fakereurusd2[0].todo_updown == 'D') {
                     $('#eurgdp2mfakertxt').css('color', 'blue');
                     $('#eurgdp2mfakertxt').html('하락처리');
                 }
             } 

            if( data.fakereurusd5 != undefined && data.fakereurusd5.length > 0 ) {
                $('#eurgdp5mfakertxt').html('');
                if( data.fakereurusd5[0].todo_updown == 'U') {
                    $('#eurgdp5mfakertxt').css('color', 'red');
                    $('#eurgdp5mfakertxt').html('상승처리');
                } else if( data.fakereurusd5[0].todo_updown == 'D') {
                    $('#eurgdp5mfakertxt').css('color', 'blue');
                    $('#eurgdp5mfakertxt').html('하락처리');
                }
            } 

            // if( data.fakergbpaud != undefined && data.fakergbpaud.length > 0 ) {
            //     $('#gbpaudfakertxt').html('');
            //     if( data.fakergbpaud[0].todo_updown == 'U') {
            //         $('#gbpaudfakertxt').css('color', 'red');
            //         $('#gbpaudfakertxt').html('상승처리');
            //     } else if( data.fakergbpaud[0].todo_updown == 'D') {
            //         $('#gbpaudfakertxt').css('color', 'blue');
            //         $('#gbpaudfakertxt').html('하락처리');
            //     }
            // } 

             if( data.fakergbpaud2 != undefined && data.fakergbpaud2.length > 0 ) {
                 $('#gbpaudfakertxt2').html('');
                 if( data.fakergbpaud2[0].todo_updown == 'U') {
                    $('#gbpaudfakertxt2').css('color', 'red');
                     $('#gbpaudfakertxt2').html('상승처리');
                 } else if( data.fakergbpaud2[0].todo_updown == 'D') {
                     $('#gbpaudfakertxt2').css('color', 'blue');
                     $('#gbpaudfakertxt2').html('하락처리');
                 }
             } 

            if( data.fakergbpaud5 != undefined && data.fakergbpaud5.length > 0 ) {
                $('#gbpaudfakertxt5').html('');
                if( data.fakergbpaud5[0].todo_updown == 'U') {
                    $('#gbpaudfakertxt5').css('color', 'red');
                    $('#gbpaudfakertxt5').html('상승처리');
                } else if( data.fakergbpaud5[0].todo_updown == 'D') {
                    $('#gbpaudfakertxt5').css('color', 'blue');
                    $('#gbpaudfakertxt5').html('하락처리');
                }
            } 
        }
    });
}

function createList(list) {
    var resultHtml = "";
    for( var i = 0; i < list.length; i++ ) {
        var obj = list[i];
        resultHtml += "<tr>";
        resultHtml += "<td>"+obj.name+"</td>";
        resultHtml += "<td>"+obj.min_std+"분</td>";
        resultHtml += "<td>"+obj.c_name+"</td>";
        resultHtml += "<td>"+obj.cal_yn+"</td>";
        resultHtml += "<td>"+currencyFormat(obj.bet_money)+"</td>";
        if( obj.bet_type == 'U' ) {
            resultHtml += "<td style='color:red'><i class='zmdi zmdi-long-arrow-up'></i> 상승</td>";
        } else if( obj.bet_type == 'D' ) {
            resultHtml += "<td style='color:blue'><i class='zmdi zmdi-long-arrow-down'></i> 하락</td>";
        }
        resultHtml += "</tr>";
    }
    return resultHtml;
}

//insertEvent 
function eventInsertFaker(item, updown, clickmin) {
    
    var updowntxt = "";
    if(updown == 'U') {
        updowntxt = "상승";
    } else if(updown == 'D') {
        updowntxt = "하락";
    }

    var data_trans_min = 0;
    var tx_min_idx = 0;
    if( clickmin == 1 ) {
        data_trans_min = data_min
        tx_min_idx = parseInt( tx_min / clickmin );
    } else if( clickmin == 2 ) {
        data_trans_min = data_min_2
        tx_min_idx = parseInt( data_min_2 / clickmin );
    } else if( clickmin == 5 ) {
        data_trans_min = data_min_5
        tx_min_idx = parseInt( data_min_5 / clickmin );
    }        

    
    

    bootbox.confirm({
        closeButton: false,
        title: '승리처리',
        message: item +'의 ' + updowntxt+'에 ' + clickmin+'분 처리를 하시겠습니까?',
        centerVertical: true,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> 취소' 
            },
            confirm: {
                label: '<i class="fa fa-check"></i> 처리'
            }
        },
        callback: function (result) {
            if( result == 'error' ) {            
                bootbox.alert({
                    closeButton: false,
                    title: "Error",
                    message:  "!"      
                });
                return;
            }
            if(result == true) {
                $.ajax({
                    method: 'POST',
                    url: '/game_api/insertFaker',
                    cache: false,
                    async: true,
                    data: {
                        'item' : item,
                        'min_std' : clickmin,
                        'write_date' : writedate,
                        'hour' : hour,
                        'min' : data_trans_min,
                        'min_idx' : tx_min_idx,
                        'todo_updown' : updown
                    },
                    success: function (data) {
                        bootbox.alert({
                            closeButton: false,
                            title: "입력",
                            message:  "입력완료"
                        });
                    }
                });
            }
        }
    });
    
}

function currencyFormat(inputNumber) {
    return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 