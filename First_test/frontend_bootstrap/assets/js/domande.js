$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    demands();
});

$("#form").submit(function (event) {
    event.preventDefault();
    filter_demands('https://www.paleobooks.it/pbapi/public/demands', $(this).serialize());
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

function filter_demands(url, data) {
    clearFeedback();
    document.getElementById('demandsTable').innerHTML = "";
    $('#table').hide();

    if (document.getElementById('search').value) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            data: data + sendAccessToken(),
            error: (err) => {
                if (checkUnauthorized(err)) {
                    refreshToken();
                    this.filter_demands();
                }
            },
            success: (demands) => {
                console.log(demands);
                if (demands[0]) {
                    $('#table').show();
                    $.each(demands, (i, demand) => {
                        var row = $('<tr>');
                        row.append('<td>' + demand.book.title + '</td>');
                        row.append('<td>' + demand.book.isbn + '</td>');
                        row.append('<td><a href=\"mailto:' + demand.user.email + '\">' + demand.user.name + '</a></td>');
                        $('#demandsTable').append(row);
                    });
                } else {
                    $("#feedback").add("<p>The search did not return any results.</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
                }
            }
        });
    } else {
        $("#feedback").add("<p>The search did not return any results.</p>").css( "color", "red" ).css( "font-size", "20px" ).appendTo('#feedback');
    }
}