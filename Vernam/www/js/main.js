var letter_template = function (cipher, i) {
    return "<div class=\"letter-container\">\n" +
        "<div class=\"letter-index\">\n" +
        "<span>" + i % 128 + "</span>\n" +
        "</div>\n" +
        "<div class=\"cipher-letter\">\n" +
        "<span>" + cipher + "</span>\n" +
        "</div>\n" +
        "<div class=\"plain-letter\">\n" +
        "<input type=\"text\" class=\"form-control input-sm\" tabindex=\"" + (i+1) + "\">\n" +
        "</div>\n" +
        "</div>";
};

var load_ciphertext = function (c1, c2) {
    var i;
    $('#ciphertext1').empty();
    for (i = 0; i < ciphertext[c1].length; i++) {
        $('#ciphertext1').append(letter_template(ciphertext[c1][i], i));
    }
    $('#ciphertext2').empty();
    for (i = 0; i < ciphertext[c2].length; i++) {
        $('#ciphertext2').append(letter_template(ciphertext[c2][i], i + ciphertext[c1].length));
    }
};

var bind_decode = function () {
    $('.plain-letter input').change(function () {
        var cipher_letters = $('.cipher-letter span');
        var plain_letters = $('.plain-letter input');
        var idx1 = plain_letters.index(this);
        var idx2 = (idx1 + 128) % 256;

        if ($(this).val().length === 0) {
            plain_letters.eq(idx1).val('');
            plain_letters.eq(idx2).val('');
        }

        var plain_letter = $(this).val().charCodeAt(0);
        if (0 <= plain_letter && plain_letter < 128) {
            var cipher_letter = parseInt(cipher_letters.eq(idx1).text(), 16);
            var key = cipher_letter ^ plain_letter;
            cipher_letter = parseInt(cipher_letters.eq(idx2).text(), 16);
            plain_letters.eq(idx2).val(String.fromCharCode(cipher_letter ^ key));
        }
    });
};

$(document).ready(function () {
    var querystring = location.search;
    var pairs = {}
    if (querystring.indexOf('?') != -1) {
        querystring = querystring.substr(1);
        querystring = querystring.split('&');
        for (var i = 0; i < querystring.length; i++) {
            pairs[querystring[i].split('=')[0]] = parseInt(querystring[i].split('=')[1]);
        }
    }
    var left = pairs['left'] || 1;
    var right = pairs['right'] || 3;
    // load_ciphertext(0, 2);
    // load_ciphertext(1, 4);
    // load_ciphertext(3, 5);
    load_ciphertext(left - 1, right - 1);
    bind_decode();
});
