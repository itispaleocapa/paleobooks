$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    demands();
});

function demands() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/demands',
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
                row.append('<td><a href=\"mailto:' + demand.user.email + '\">' + demand.user.name + '</a></td>');
                $('#demandsTable').append(row);
            });
        }
    });
}