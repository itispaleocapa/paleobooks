$("#form").submit(function (event) {
    event.preventDefault();
    demand('https://www.paleobooks.it/pbapi/public/demands', $(this).serialize());
});

$(document).ready(function () {
    if (!isAuthenticated()){
        window.location.href = "login.html";
    }

    var url = new URL(window.location.href);
    var book = url.searchParams.get("book");

    if (book) {
        books(book);
    } else {
        books();
    }
});

function books(book_id = 0) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://www.paleobooks.it/pbapi/public/books',
        data: {"access_token": sessionStorage.getItem('access_token')},
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.books();
            }
        },
        success: (books) => {
            if(book_id == 0) {
                $.each(books, (i, book) => {
                    var row = $('<option value=' + book.id + '>' + book.title + '</option>');
                    $('#books').append(row);
                });
            } else {
                $.each(books, (i, book) => {
                    if(book_id == book.id) {
                        var row = $('<option selected value=' + book.id + '>' + book.title + '</option>');
                        $('#books').append(row);
                    } else {
                        var row = $('<option value=' + book.id + '>' + book.title + '</option>');
                        $('#books').append(row);
                    }
                });
            }
        }
    });
}

function demand(url, data) {
    clearFeedback();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        data: data + sendAccessToken(),
        error: (err) => {
            if (checkUnauthorized(err)) {
                refreshToken();
                this.demand();
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