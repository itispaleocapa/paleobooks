$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    supplies();
    demands();
});

function supplies() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/supplies/user',
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.supplies();
            }
        },
        success: (supplies) => {
            if (supplies[0]) {
                $.each(supplies, (i, supply) => {
                    var row = $('<tr>');
                    row.append('<td><a href=\'offerta.html?supply=' + supply.id + '\'>' + supply.book.title + '</a></td>');
                    row.append('<td>' + supply.book.isbn + '</td>');
                    row.append('<td>' + supply.price + '€</td>');
                    $('#suppliesTableBody').append(row);
                });
            } else {
                document.getElementById('supplies').innerHTML = '<h2>Offerte</h2><p>Non stai offrendo nulla...<a href=\'bazar.html\'>offri ora</a></p>';
            }
        }
    });
}

function demands() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/demands/user',
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.demands();
            }
        },
        success: (demands) => {
            if (demands[0]) {
                $.each(demands, (i, demand) => {
                    var row = $('<tr>');
                    row.append('<td><a href=\'domanda.html?demand=' + demand.id + '\'>' + demand.book.title + '</a></td>');
                    row.append('<td>' + demand.book.isbn + '</td>');
                    $('#demandsTableBody').append(row);
                });
            } else {
                document.getElementById('demands').innerHTML = '<h2>Domande</h2><p>Non stai cercando nulla...<a href=\'bazar.html\'>cerca ora</a></p>';
            }
        }
    });
}