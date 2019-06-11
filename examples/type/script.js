$(function () {
    var $city = $('[name="city"]'),
        $typeCode = $('[name="typecode"]');

    $city.fias({
        type: $.fias.type.city,
        'withParents': true
    });

    $typeCode.change(function () {
        changeTypeCode($(this).val());
    });

    changeTypeCode($('[name="typecode"]:checked').val());

    function changeTypeCode(value) {
        var typeCode = null;

        switch (value) {
            case 'city':
                typeCode = $.fias.typeCode.city;
                break;

            case 'settlement':
                typeCode = $.fias.typeCode.city + $.fias.typeCode.settlement;
                break;

            case 'all':
                typeCode = $.fias.typeCode.city + $.fias.typeCode.settlement + $.fias.typeCode.village;
                break;
        }

        $city.fias('typeCode', typeCode);
    }
});