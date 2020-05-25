$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8000/offers',
        success: (offers) => {
            $.each(offers, (i, offer) => {
                var row = $('<tr>');
                row.append('<td>' + offer.id + '</td>');
                row.append('<td>' + offer.book.title + '</td>');
                row.append('<td>' + offer.book.isbn + '</td>');
                row.append('<td>' + offer.user.name + '</td>');
                $('#table_body').append(row);
            });
        }
    });
});