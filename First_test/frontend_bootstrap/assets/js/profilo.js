$(document).ready(function () {
    profile();
});

$("#form").submit(function (event) {
    event.preventDefault();
    profile_update('https://www.paleobooks.it/pbapi/public/users', $(this).serialize());
});

function profile_update(url, data){
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: url,
        data:  {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (err.status == '401'
                    || err.text == 'Provided access token is expired.'
                    || err.text == 'An error while decoding access token.') {
                refreshToken();
            }
        },
        success: (response) => {
            console.log(response);
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
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (err.status == '401'
                    || err.text == 'Provided access token is expired.'
                    || err.text == 'An error while decoding access token.') {
                refreshToken();
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