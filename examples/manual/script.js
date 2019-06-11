$(function () {
    var $city = $('[name="city"]');

    $city.fias({
        type: $.fias.type.city,
        'withParents': true,
        change: function (obj) {
            var address = $.fias.getAddress('.js-form-address');

            $('#address').text(address);
        },
    });

    $('[name="city_id"]').change(function () {
        var id = $(this).val();

        // Устанавливаем значение поля ввода по id
        $city.fias('controller').setValueById(id);
    });
});