$(document).ready(function () {
    supplies();
});

function supplies() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/supplies',
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
                row.append('<td>' + supply.price + '</td>');
                row.append('<td><a href=\"mailto:' + supply.user.email + '\">' + supply.user.name + '</a></td>');
                $('#suppliesTable').append(row);
            });
        }
    });
}