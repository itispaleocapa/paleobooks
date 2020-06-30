$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    class_bazar = sessionStorage.getItem('class_bazar');
    if (class_bazar) {
        if (class_bazar < 90) {
            loadClasses(class_bazar, 2019);
            loadBooks(class_bazar);
        } else {
            loadClasses(class_bazar, 2020);
            loadBooks(class_bazar);
            document.getElementById('year').selectedIndex = 1;
        }
    } else {
        loadClasses(0, 2019);
        $('#table').hide();
    }
});

$("#form").submit(function (event) {
    event.preventDefault();
    books('https://www.paleobooks.it/pbapi/public/books', $(this).serialize());
});

function loadClasses(selected, year) {
    /*class_bazar = sessionStorage.getItem('class_bazar');
    if (class_bazar) {
        if (class_bazar < 90 && year == 2019) {
            selected = class_bazar;
        } else if (class_bazar < 90 && year == 2020) {
            selected = class_bazar + 89;
            class_bazar += 89;
        } else if (class_bazar > 90 && year == 2019) {
            selected = class_bazar - 89;
            class_bazar -= 89;
        } else if (class_bazar > 90 && year == 2020) {
            selected = class_bazar;
        }
        alert(class_bazar + 'cb');
        alert(selected + 'sl');
    }*/
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/classes',
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.loadBooks(selected, year);
            }
        },
        success: (classes) => {
            clearClasses();
            $.each(classes, (i, schoolClass) => {
                if (schoolClass.school_year == year) {
                    if (schoolClass.id == selected) {
                        var row = $('<option selected value=' + schoolClass.id + '>' + schoolClass.name + '</option>');
                        $('#classes').append(row);
                    } else {
                        var row = $('<option value=' + schoolClass.id + '>' + schoolClass.name + '</option>');
                        $('#classes').append(row);
                    }
                }
            });
        }
    });
}

function loadBooks(id) {
    sessionStorage.setItem('class_bazar', id);
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
                    row.append('<td>' + book.price + '€</td>');
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

function clearClasses() {
    var select = document.getElementById("classes");
    var length = select.options.length;
    for (i = length-1; i > 0; i--) {
        select.options[i] = null;
    }
}