function logout(onlyDestroyMemory) {
    if (!onlyDestroyMemory) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://www.paleobooks.it/pbapi/public/auth/logout',
            data: {"refresh_token": getRefreshCookie("refresh_token")},
            error: (err) => {
                /*if (response.status == '400' || response.status == '401') {
                    refreshToken();
                }*/
                console.log(err);
            },
            success: (response) => {
                //location.reload();
                console.log(response);
            }
        });
    }

    document.cookie = "refresh_token=; path=/;";
    sessionStorage.removeItem('access_token');
    window.location.href = "login.html";
}

function refreshToken() {
    var refresh_token = getRefreshCookie("refresh_token");
    if (refresh_token != "") {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://www.paleobooks.it/pbapi/public/auth/refresh-token',
            data: {"refresh_token": refresh_token},
            error: (err) => {
                logout(true);
                window.location.href = "login.html";
            },
            success: (response) => {
                sessionStorage.setItem('access_token', response.access_token);
                //location.reload();
            }
        });
    }
    else {
        // Need to logout
        logout(true);
        window.location.href = "login.html";
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

function checkUnauthorized(err) {
    if (err.status == '401' || err.responseJSON['error'] == 'Provided access token is expired.' || err.responseJSON['error'] == 'An error while decoding access token.') {
        return true;
    } else {
        return false;
    }
}

function getAccessToken() {
    return sessionStorage.getItem('access_token');
}

function sendAccessToken() {
    return '&access_token=' + sessionStorage.getItem('access_token');
}