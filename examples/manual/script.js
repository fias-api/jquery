$(function () {
    var $city = $('[name="city"]');

    $city.kladr({
        type: $.kladr.type.city,
        'withParents': true,
        change: function (obj) {
            var address = $.kladr.getAddress('.js-form-address');

            $('#address').text(address);
        },
    });

    $('[name="city_id"]').change(function () {
        var id = $(this).val();

        // Устанавливаем значение поля ввода по id
        $city.kladr('controller').setValueById(id);
    });
});