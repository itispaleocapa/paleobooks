$(document).ready(function () {
    classes();
    $('#table').hide();
});

$("#form").submit(function (event) {
    event.preventDefault();
    books('https://www.paleobooks.it/pbapi/public/books', $(this).serialize());
});

function classes() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/classes',
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.classes();
            }
        },
        success: (classes) => {
            $.each(classes, (i, schoolClass) => {
                var row = $('<option value=' + schoolClass.id + '>' + schoolClass.name + '</option>');
                $('#classes').append(row);
            });
        }
    });
}

function loadBooks(id) {
    if (id != 0) {
        document.getElementById('booksTable').innerHTML = "";
        $('#table').show();

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'https://www.paleobooks.it/pbapi/public/classes/' + id + '/books',
            data: {"access_token": sessionStorage.getItem('access_token')},
            error: (err) => {
                if (checkUnauthorized(err)) {
                    refreshToken();
                    this.loadBooks(id);
                }
            },
            success: (books) => {
                $.each(books, (i, book) => {
                    var row = $('<tr>');
                    row.append('<td>' + book.title + '</td>');
                    row.append('<td>' + book.isbn + '</td>');
                    row.append('<td>' + book.price + '</td>');
                    row.append('<td><a href=\"crea-offerta.html?book=' + book.id + '\">Clicca</a></td>');
                    row.append('<td><a href=\"crea-domanda.html?book=' + book.id + '\">Clicca</a></td>');
                    $('#booksTable').append(row);
                });
            }
        });
    } else {
        $('#table').hide();
    }
}

function books(url, data) {
    document.getElementById('booksTable').innerHTML = "";
    $('#table').show();

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: url,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.books(id);
            }
        },
        success: (books) => {
            $.each(books, (i, book) => {
                var row = $('<tr>');
                row.append('<td>' + book.title + '</td>');
                row.append('<td>' + book.isbn + '</td>');
                row.append('<td>' + book.price + '</td>');
                row.append('<td><a href=\"crea-offerta.html?book=' + book.id + '\">Clicca</a></td>');
                row.append('<td><a href=\"crea-domanda.html?book=' + book.id + '\">Clicca</a></td>');
                $('#booksTable').append(row);
            });
        }
    });
}