$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }
    var url = new URL(window.location.href);
    var d = url.searchParams.get("demand");
    demand(d);
});

$("#form").submit(function (event) {
    event.preventDefault();

    var url = new URL(window.location.href);
    var d = url.searchParams.get("demand");

    demand_update('https://www.paleobooks.it/pbapi/public/demands/', $(this).serialize(), d);
});

$("#deleteDemand").click(function (event) {
    event.preventDefault();

    var url = new URL(window.location.href);
    var d = url.searchParams.get("demand");

    demand_delete('https://www.paleobooks.it/pbapi/public/demands/', $(this).serialize(), d);
});

function demand_update(url, data, d){
    clearFeedback();
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: url + d,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.demand_update('https://www.paleobooks.it/pbapi/public/demands/', $(this).serialize(), d);
            }
            if (err.status == 400) {
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            location.reload();
        }
    });
}

function demand_delete(url, data, d){
    clearFeedback();
    $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: url + d,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.demand_delete('https://www.paleobooks.it/pbapi/public/demands/', $(this).serialize(), d);
            }
            if (err.status == 400) {
                $("#feedback").add("<p>" + err.responseJSON['error'] + "</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
            }
        },
        success: (response) => {
            window.location.href = "index.html";
        }
    });
}

function demand(d) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/demands/' + d,
        data: {"access_token": getAccessToken()},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.demand(d);
            }
        },
        success: (response) => {
            document.getElementById('title').innerHTML = response.book.title;
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