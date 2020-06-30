$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }
    var url = new URL(window.location.href);
    var s = url.searchParams.get("supply");
    supply(s);
});

$("#form").submit(function (event) {
    event.preventDefault();

    var url = new URL(window.location.href);
    var s = url.searchParams.get("supply");

    supply_update('https://www.paleobooks.it/pbapi/public/supplies/', $(this).serialize(), s);
});

$("#deleteSupply").click(function (event) {
    event.preventDefault();

    var url = new URL(window.location.href);
    var s = url.searchParams.get("supply");

    supply_delete('https://www.paleobooks.it/pbapi/public/supplies/', $(this).serialize(), s);
});

function supply_update(url, data, s){
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: url + s,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.supply_update('https://www.paleobooks.it/pbapi/public/supplies/', $(this).serialize(), s);
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

function supply_delete(url, data, s){
    $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: url + s,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.supply_delete('https://www.paleobooks.it/pbapi/public/supplies/', $(this).serialize(), s);
            }
            if (err.status == 400) {
                clearFeedback();
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "background-color", "red" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            window.location.href = "index.html";
        }
    });
}

function supply(s) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/supplies/' + s,
        data: {"access_token": getAccessToken()},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.supply(s);
            }
        },
        success: (response) => {
            document.getElementById('title').innerHTML = response.book.title;
            document.getElementById('price').innerHTML = response.price + '€';
            /*var x = document.getElementById("out");
            
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

            document.getElementById("bottone").style.display = "inline";*/
        }
    });
}