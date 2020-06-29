function logout(onlyDestroyMemory) {
    if (!onlyDestroyMemory) {
        var refresh_token = getRefreshCookie("refresh_token");
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://www.paleobooks.it/pbapi/public/auth/logout',
            data: {"refresh_token": refresh_token},
            error: (err) => {
                if (response.status == '400' || response.status == '401') {
                    refreshToken();
                }
            },
            success: (response) => {
                //location.reload();
                console.log('logout effettuato con successo');
            }
        });
    }

    document.cookie = "refresh_token=; path=/;";
    sessionStorage.removeItem('access_token');
    window.location.href = "/user/login.html";
    //location.reload();
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
                window.location.href = "/user/login.html";
            },
            success: (response) => {
                sessionStorage.setItem('access_token', response.token);
                location.reload();
            }
        });
    }
    else {
        // Need to logout
        logout(true);
        window.location.href = "/user/login.html";
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