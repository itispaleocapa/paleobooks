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
            $.each(supplies, (i, supply) => {
                var row = $('<tr>');
                row.append('<td>' + supply.book.title + '</td>');
                row.append('<td>' + supply.book.isbn + '</td>');
                row.append('<td>' + supply.price + '€</td>');
                $('#suppliesTable').append(row);
            });
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
            $.each(demands, (i, demand) => {
                var row = $('<tr>');
                row.append('<td>' + demand.book.title + '</td>');
                row.append('<td>' + demand.book.isbn + '</td>');
                $('#demandsTable').append(row);
            });
        }
    });
}