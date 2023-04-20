//admin login
function adminlogin() {
    var adminid =  $('#id').val();
    var adminpw =  $('#password').val();
    
    if( adminid == undefined || adminid == '' ) {
        alert( '아이디 입력 해 주세요.' );
        return;
    }

    if( adminpw == undefined || adminpw == '' ) {
        alert( '비밀번호 입력 해 주세요.' );
        return;
    }

    $.ajax({
        method: 'POST',
        url: '/admin_api/login',
        cache: false,
        async: true,
        data: {
            'userid' : adminid,
            'userpw' : adminpw
        },
        success: function (data) {
            if( data.result == 'no' ) {
                alert('아이디 또는 비밀번호를 확인해주세요.');
                return;
            } else {
                window.location.replace('/');
                return false;
            }
        }
    });
}

function enter_test() {
    if ( window.event.keyCode == 13 ) {
        // 실행시킬 함수 입력
        adminlogin(); 
    }
}
