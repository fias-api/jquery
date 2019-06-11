$(function () {
    var $region = $('[name="region"]'),
        $district = $('[name="district"]'),
        $city = $('[name="city"]'),
        $street = $('[name="street"]'),
        $building = $('[name="building"]');

    var map = null,
        map_created = false;

    $.fias.setDefault({
        parentInput: '.js-form-address',
        verify: true,
        change: function (obj) {
            if (obj) {
                setLabel($(this), obj.type);

                if(obj.parents){
                    $.fias.setValues(obj.parents, '.js-form-address');
                }
            }

            log(obj);
            addressUpdate();
            mapUpdate();
        },
        checkBefore: function () {
            var $input = $(this);

            if (!$.trim($input.val())) {
                log(null);
                addressUpdate();
                mapUpdate();
                return false;
            }
        }
    });

    $region.fias('type', $.fias.type.region);
    $district.fias('type', $.fias.type.district);
    $city.fias('type', $.fias.type.city);
    $street.fias('type', $.fias.type.street);
    $building.fias('type', $.fias.type.building);

    // Включаем получение родительских объектов для населённых пунктов
    $district.fias('withParents', true);
    $city.fias('withParents', true);
    $street.fias('withParents', true);

    // Отключаем проверку введённых данных для строений
    $building.fias('verify', false);

    ymaps.ready(function () {
        if (map_created) return;
        map_created = true;

        map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 12,
            controls: []
        });

        map.controls.add('zoomControl', {
            position: {
                right: 10,
                top: 10
            }
        });
    });

    function setLabel($input, text) {
        text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        $input.parent().find('label').text(text);
    }

    function mapUpdate() {
        var zoom = 4;

        var address = $.fias.getAddress('.js-form-address', function (objs) {
            var result = '';

            $.each(objs, function (i, obj) {
                var name = '',
                    type = '';

                if ($.type(obj) === 'object') {
                    name = obj.name;
                    type = ' ' + obj.type;

                    switch (obj.contentType) {
                        case $.fias.type.region:
                            zoom = 4;
                            break;

                        case $.fias.type.district:
                            zoom = 7;
                            break;

                        case $.fias.type.city:
                            zoom = 10;
                            break;

                        case $.fias.type.street:
                            zoom = 13;
                            break;

                        case $.fias.type.building:
                            zoom = 16;
                            break;
                    }
                }
                else {
                    name = obj;
                }

                if (result) result += ', ';
                result += type + name;
            });

            return result;
        });

        if (address && map_created) {
            var geocode = ymaps.geocode(address);
            geocode.then(function (res) {
                map.geoObjects.each(function (geoObject) {
                    map.geoObjects.remove(geoObject);
                });

                var position = res.geoObjects.get(0).geometry.getCoordinates(),
                    placemark = new ymaps.Placemark(position, {}, {});

                map.geoObjects.add(placemark);
                map.setCenter(position, zoom);
            });
        }
    }

    function addressUpdate() {
        var address = $.fias.getAddress('.js-form-address');

        $('#address').text(address);
    }

    function log(obj) {
        var $log, i;

        $('.js-log li').hide();

        for (i in obj) {
            $log = $('#' + i);

            if ($log.length) {
                $log.find('.value').text(obj[i]);
                $log.show();
            }
        }
    }
});