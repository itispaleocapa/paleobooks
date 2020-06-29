$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    profile();
});

$("#form").submit(function (event) {
    event.preventDefault();
    profile_update('https://www.paleobooks.it/pbapi/public/users', $(this).serialize());
});

function profile_update(url, data, onlyRefresh){
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: url,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.profile_update('https://www.paleobooks.it/pbapi/public/users', $(this).serialize());
            }
            if (err.status == 400) {
                clearFeedback();
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            location.reload();
        }
    });

}

function modifica(){
    if(document.getElementById("form").style.display == "none")
    { 
        document.getElementById("form").style.display = "block";
    }
    else{
        document.getElementById("form").style.display = "none";
    }
}

function profile() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/users/profile',
        data: {"access_token": getAccessToken()},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.profile();
            }
        },
        success: (response) => {
            var x = document.getElementById("out");
            
            var tab = document.createElement('table');
            tab.setAttribute('class', 'table table-striped');

            var tbody = document.createElement("tbody");
            
            var tr = document.createElement("tr");

            var td1 = document.createElement("td");
            td1.innerHTML = "Nome:"
            var td2 = document.createElement("td");
            td2.innerHTML = response.name;

            tr.appendChild(td1);
            tr.appendChild(td2);

            tbody.appendChild(tr);

            var tr = document.createElement("tr");

            var td1 = document.createElement("td");
            td1.innerHTML = "Email:"
            var td2 = document.createElement("td");
            td2.innerHTML = response.email;

            tr.appendChild(td1);
            tr.appendChild(td2);

            tbody.appendChild(tr);

            tab.appendChild(tbody);

            x.appendChild(tab);

            document.getElementById("bottone").style.display = "inline";
        }
    });
}