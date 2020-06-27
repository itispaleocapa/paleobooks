$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/offers',
        data: {"token": sessionStorage.getItem('access_token')},
        error: (response) => {
            if (response.status == '400' || response.status == '401') {
               refreshToken();
            }
            //console.log(response.status);
        },
        success: (offers) => {
            $.each(offers, (i, offer) => {
                var row = $('<tr>');
                row.append('<td>' + offer.id + '</td>');
                row.append('<td>' + offer.book.title + '</td>');
                row.append('<td>' + offer.book.isbn + '</td>');
                row.append('<td>' + offer.user.name + '</td>');
                $('#table_body').append(row);
            });
        }
    });
});

function refreshToken() {
    var refresh_token = getRefreshCookie("refresh_token");
    if (refresh_token != "") {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://www.paleobooks.it/pbapi/public/auth/refresh-token',
            data: {"refresh_token": refresh_token},
            error: (err) => {
                //console.log(err);
                window.location.href = "user/login.html";
            },
            success: (response) => {
                sessionStorage.setItem('access_token', response.token);
                location.reload();
            }
        });
    }
    else {
        // Need to logout
        window.location.href = "user/login.html";
    }
        
}

function getRefreshCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function logout() {
    document.cookie = "refresh_token=; path=/;";
    sessionStorage.removeItem('access_token');
    window.location.href = "user/login.html";
    //location.reload();
}