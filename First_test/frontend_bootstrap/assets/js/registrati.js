$(document).ready(function () {
    if (isAuthenticated()){
        window.location.href = "index.html";
    }
});

$("#form").submit(function (event) {
    event.preventDefault();
    registration('https://www.paleobooks.it/pbapi/public/auth/register', $(this).serialize());
});

function registration(url, data) {
    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirm_password').value;
    clearFeedback();
    if (password == confirm_password) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            error: (err) => {
                clearError('nameError');
                clearError('emailError');
                clearError('passwordError');
                if (err.status == 400) {
                    clearFeedback();
                    $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
                } else if (err.status == 422) {
                    if (err.responseJSON['name']) {
                        putError('nameError', err.responseJSON['name']);
                    }
                    if (err.responseJSON['email']) {
                        putError('emailError', err.responseJSON['email']);
                    }
                    if (err.responseJSON['password']) {
                        putError('passwordError', err.responseJSON['password']);
                    }
                }
                /*var keyNames = Object.keys(err.responseJSON);

                for(var i = 0; i < keyNames.length; i++){
                    document.getElementById(keyNames[i]).style.borderColor = "red";
                }*/
            },
            success: (response) => {
                var expiration_date = new Date();
                expiration_date.setFullYear(expiration_date.getFullYear() + 1);

                sessionStorage.setItem('access_token', response.access_token);
                document.cookie = "refresh_token=" + response.refresh_token + "; expires=" + expiration_date.toUTCString() + "; path=/";

                alert(response['success']);
                window.location.href = "index.html";
            }
        });
    } else {
        $("#feedback").add("<p>Passwords don\'t match.</p>").css( "background-color", "red" ).appendTo('#feedback');
    }
}