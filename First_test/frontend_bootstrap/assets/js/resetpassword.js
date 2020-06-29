$(document).ready(function () {
    if (isAuthenticated()){
        window.location.href = "dashboard.html";
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
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: data,
        error: (err) => {
            if (err.status == 400) {
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            alert(response['success'] + ' Check the link.');
        }
    });
}

$("#password-form").submit(function (event) {
    event.preventDefault();
    resetpassword('https://www.paleobooks.it/pbapi/public/auth/password-reset/' + token, $(this).serialize());
});

function resetpassword(url, data) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: data,
        error: (err) => {
            if (err.status == 400) {
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            alert(response['success']);
        }
    });
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