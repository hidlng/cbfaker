
var item = "";
var hour =  "";
var writedate = "";
var min = "";

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

            hour = data.hour;
            min = data.minute;
            writedate = data.game_date;

            $('#nexttime').html('');
            $('#nextsecond').html('');

            $('#btcuptxt').html('');
            $('#btcdowntxt').html('');

            $('#ethuptxt').html('');
            $('#ethdowntxt').html('');

            $('#golduptxt').html('');
            $('#golddowntxt').html('');


            $('#gbpuptxt').html('');
            $('#gbpdowntxt').html('');

            
            $('#nasuptxt').html('');
            $('#nasdowntxt').html('');


            $('#btcbody').html('');
            $('#ethbody').html('');
            $('#goldbody').html('');
            $('#gbpbody').html('');
            $('#nasbody').html('');

            
            $('#btcfakertxt').html('');
            $('#ethfakertxt').html('');
            $('#goldfakertxt').html('');
            $('#goldfakertxt').css('color', '#fff');
            $('#ethfakertxt').css('color', '#fff');
            $('#btcfakertxt').css('color', '#fff');

            
            $('#gbpfakertxt').html('');
            $('#gbpfakertxt').css('color', '#fff');

            
            $('#nasfakertxt').html('');
            $('#nasfakertxt').css('color', '#fff');

            $('#nexttime').html(data.next_time);
            $('#nextsecond').html(data.second);

            $('#btcuptxt').html(currencyFormat(data.btcupmoney)+'원');
            $('#btcdowntxt').html(currencyFormat(data.btcdownmoney)+'원');

            $('#ethuptxt').html(currencyFormat(data.ethupmoney)+'원');
            $('#ethdowntxt').html(currencyFormat(data.ethdownmoney)+'원');

            $('#golduptxt').html(currencyFormat(data.goldupmoney)+'원');
            $('#golddowntxt').html(currencyFormat(data.golddownmoney)+'원');


            $('#gbpuptxt').html(currencyFormat(data.gbpupmoney)+'원');
            $('#gbpdowntxt').html(currencyFormat(data.gbpdownmoney)+'원');

            
            $('#nasuptxt').html(currencyFormat(data.nasupmoney)+'원');
            $('#nasdowntxt').html(currencyFormat(data.nasdownmoney)+'원');

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

            if( data.gbpList != undefined && data.gbpList.length > 0 ) {
                var gbpHTML = createList(data.gbpList);
                $('#gbpbody').html(gbpHTML);
            } 

            if( data.nasList != undefined && data.nasList.length > 0 ) {
                var nasHTML = createList(data.nasList);
                $('#nasbody').html(nasHTML);
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

            if( data.fakergbp != undefined && data.fakergbp.length > 0 ) {
                $('#gbpfakertxt').html('');
                if( data.fakergbp[0].todo_updown == 'U') {
                    $('#gbpfakertxt').css('color', 'red');
                    $('#gbpfakertxt').html('상승처리');
                } else if( data.fakergbp[0].todo_updown == 'D') {
                    $('#gbpfakertxt').css('color', 'blue');
                    $('#gbpfakertxt').html('하락처리');
                }
            } 

            if( data.fakernas != undefined && data.fakernas.length > 0 ) {
                $('#nasfakertxt').html('');
                if( data.fakernas[0].todo_updown == 'U') {
                    $('#nasfakertxt').css('color', 'red');
                    $('#nasfakertxt').html('상승처리');
                } else if( data.fakernas[0].todo_updown == 'D') {
                    $('#nasfakertxt').css('color', 'blue');
                    $('#nasfakertxt').html('하락처리');
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
function eventInsertFaker(item, updown) {
    
    var updowntxt = "";
    if(updown == 'U') {
        updowntxt = "상승";
    } else if(updown == 'D') {
        updowntxt = "하락";
    }

    bootbox.confirm({
        closeButton: false,
        title: '승리처리',
        message: item +'의' + updowntxt+'처리를 하시겠습니까?',
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
                        'min_std' : '1',
                        'write_date' : writedate,
                        'hour' : hour,
                        'min_idx' : min,
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