$(function () {

    $('[name="city"]').fias({
		type: $.fias.type.city,
        change: function (obj) {
            var address = $.fias.getAddress('.js-form-address');

            $('#address').text(address);
        },
        'withParents' : true

    });


});