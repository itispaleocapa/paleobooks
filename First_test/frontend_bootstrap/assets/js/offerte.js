$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    supplies();
});

$("#form").submit(function (event) {
    event.preventDefault();
    filter_supplies('https://www.paleobooks.it/pbapi/public/supplies', $(this).serialize());
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
                row.append('<td>' + supply.price + '€</td>');
                row.append('<td><a href=\"mailto:' + supply.user.email + '\">' + supply.user.name + '</a></td>');
                $('#suppliesTable').append(row);
            });
        }
    });
}

function filter_supplies(url, data) {
    clearFeedback();
    document.getElementById('suppliesTable').innerHTML = "";
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
                    this.filter_supplies();
                }
            },
            success: (supplies) => {
                if (supplies[0]) {
                    $('#table').show();
                    $.each(supplies, (i, supply) => {
                        var row = $('<tr>');
                        row.append('<td>' + supply.book.title + '</td>');
                        row.append('<td>' + supply.book.isbn + '</td>');
                        row.append('<td>' + supply.price + '€</td>');
                        row.append('<td><a href=\"mailto:' + supply.user.email + '\">' + supply.user.name + '</a></td>');
                        $('#suppliesTable').append(row);
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