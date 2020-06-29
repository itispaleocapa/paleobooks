$("#form").submit(function (event) {
    event.preventDefault();
    registration('https://www.paleobooks.it/pbapi/public/auth/register', $(this).serialize());
});

function registration(url, data) {
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

            var keyNames = Object.keys(err.responseJSON);

            for(var i = 0; i < keyNames.length; i++){
                document.getElementById(keyNames[i]).style.borderColor = "red";
            }
        },
        success: (response) => {
            var expiration_date = new Date();
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);

            sessionStorage.setItem('access_token', response.access_token);
            document.cookie = "refresh_token=" + response.refresh_token + "; expires=" + expiration_date.toUTCString() + "; path=/";

            alert(response['success']);
            window.location.href = "profilo.html";
        }
    });
}