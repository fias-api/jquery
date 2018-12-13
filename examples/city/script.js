$(function () {

    $('[name="city"]').kladr({
		type: $.kladr.type.city,
        change: function (obj) {
            var address = $.kladr.getAddress('.js-form-address');

            $('#address').text(address);
        },
        'withParents' : true

    });


});