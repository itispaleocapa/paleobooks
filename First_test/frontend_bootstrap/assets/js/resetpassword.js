$(document).ready(function () {
    if (isAuthenticated()){
        window.location.href = "index.html";
    }

    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");

    if (!token) {
        $('#password-form').hide();
    } else {
        $('#password-form').show();
        $('#form').hide();
    }
});

$("#form").submit(function (event) {
    event.preventDefault();
    sendResetpassword('https://www.paleobooks.it/pbapi/public/auth/password-reset', $(this).serialize());
});

function sendResetpassword(url, data) {
    clearFeedback();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: data,
        error: (err) => {
            clearError('emailError');
            if (err.status == 400) {
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
            } else if (err.status == 422) {
                if (err.responseJSON['email']) {
                    putError('emailError', err.responseJSON['email']);
                }
            }
        },
        success: (response) => {
            $("#feedback").add("<p>" + response['success'] + "</p>").css( "color", "green" ).css( "font-size", "20px" ).appendTo('#feedback');
        }
    });
}

$("#password-form").submit(function (event) {
    event.preventDefault();
    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");
    resetpassword('https://www.paleobooks.it/pbapi/public/auth/password-reset/' + token, $(this).serialize());
});

function resetpassword(url, data) {
    clearFeedback();
    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirm_password').value;
    if (password == confirm_password) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            error: (err) => {
                clearError('passwordError');
                if (err.status == 400) {
                    $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
                } else if (err.status == 422) {
                    if (err.responseJSON['new_password']) {
                        putError('passwordError', err.responseJSON['new_password']);
                    }
                }
            },
            success: () => {
                window.location.href = "login.html";
            }
        });
    } else {
        $("#feedback").add("<p>Passwords don't match.</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};