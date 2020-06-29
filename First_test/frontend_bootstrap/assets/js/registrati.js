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
            console.log(err);

            var keyNames = Object.keys(err.responseJSON);

            for(var i = 0; i < keyNames.length; i++){
                document.getElementById(keyNames[i]).style.borderColor = "red";
            }
            
            if(err.status == 400){
                //Email esistente
                console.log("Errore");
            }
        },
        success: (response) => {
            var expiration_date = new Date();
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);

            sessionStorage.setItem('access_token', response.access_token);
            document.cookie = "refresh_token=" + response.refresh_token + "; expires=" + expiration_date.toUTCString() + "; path=/";

            //window.location.href = "../";
        }
    });
}