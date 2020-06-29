$(document).ready(function () {
    if (isAuthenticated()){
        window.location.href = "dashboard.html";
    }

    if (getUrlParameter('state')=='paleobooks') {
        login('https://www.paleobooks.it/pbapi/public/auth/paleoid', {'code': getUrlParameter('code')});
    }
});

$("#form").submit(function (event) {
    event.preventDefault();
    login('https://www.paleobooks.it/pbapi/public/auth/login', $(this).serialize());
});

function login(url, data) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: data,
        error: (err) => {
            if (err.status == 400) {
                clearFeedback();
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            var expiration_date = new Date();
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);

            sessionStorage.setItem('access_token', response.access_token);
            document.cookie = "refresh_token=" + response.refresh_token + "; expires=" + expiration_date.toUTCString() + "; path=/";

            window.location.href = "profilo.html";
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